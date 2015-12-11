/*
    extensions.js

    a Scratch compatible extension reader for Snap!

    written by Bernat Romagosa
    Copyright (C) 2015 by Bernat Romagosa

    This file is part of Snap!.

    Snap! is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of
    the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.


    toc
    ---
    the following list shows the order in which all constructors are
    defined. Use this list to locate code in this document:



    credits
    -------
     

    revision history
    ----------------
    Dec 11 - first working prototype (Bernat)
 */

/*global 
 */

// Global stuff ////////////////////////////////////////////////////////

modules.extensions = '2015-December-11';

// Declarations

var ExtensionLoader = {};

ExtensionLoader.loadFromURL = function(src, callback) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', src);
    document.head.appendChild(script);
    script.onload = callback;
    // ScratchExtensions takes over when the script is loaded
}

// Scratch compatibility

// Some extensions make use of some jQuery functions

$ = {};
$.getScript = ExtensionLoader.loadFromURL;

// We need a ScratchExtensions singleton that knows how to read extensions
// and translates them into something that Snap! understands

var ScratchExtensions = {
    menuOptions: []
};

ScratchExtensions.register = function(name, descriptor, extension) {
    var namespace = name.toLowerCase().replace(/[^a-z]/, '') + '_',
        category = name.length > 14 ? name.substring(0, 11) + '...' : name;

    if (!SpriteMorph.prototype.categories[category]) {
        SpriteMorph.prototype.categories.push(category);
        SpriteMorph.prototype.blockColor[category] = SpriteMorph.prototype.blockColor['other'];
    }

    this.loadMethods(extension, namespace);
    this.loadMenus(descriptor.menus);
    this.loadBlocks(descriptor.blocks, namespace, category);

    var event = new Event('extensionLoaded');
    document.dispatchEvent(event);
}

ScratchExtensions.loadMethods = function(methodHolder, namespace) {
    Object.keys(methodHolder).forEach(function(eachMethodName){
        Process.prototype[namespace + eachMethodName] = methodHolder[eachMethodName];
    })
}

ScratchExtensions.loadMenus = function(menus) {
    var myself = this;

    Object.keys(menus).forEach(function(eachKey) {
        myself.menuOptions[eachKey] = {};
        menus[eachKey].forEach(function(eachValue) {
            myself.menuOptions[eachKey][eachValue] = eachValue;
        })
    })
  
}

ScratchExtensions.loadBlocks = function(blockSpecs, namespace, category) {
    /* 
       A BlockSpec is an array that holds an op code, a spec string, and a
       method name. Op codes are:

       ' '     Synchronous command
       'w'     Asynchronous command
       'r'     Synchronous reporter
       'R'     Asynchronous reporter
       'h'     Hat block (synchronous, returns boolean, true = run stack)
        
    */

    blockSpecs.forEach(function(spec) {
        var op = spec[0],
            specString = spec[1],
            methodName = namespace + spec[2],
            defaults = spec.splice(3),
            isAsync,
            type;


        switch(op) {
            case ' ':
                type = 'command';
                isAsync = false;
                break;
            case 'w':
                type = 'command';
                isAsync = true;
                break;
            case 'r':
                type = 'reporter';
                isAsync = false;
                break;
            case 'R':
                type = 'reporter';
                isAsync = true;
                break;
            case 'h':
                type = 'hat';
                isAsync = false;
                break;
            default:
                type = 'command';
                isAsync = 'false';
                break;
        }

        if (Process.prototype[methodName]) {
            SpriteMorph.prototype.blocks[methodName] = {
                type: type,
                category: category,
                spec: specString,
                defaults: defaults
            }
            // push this one to the palette!

        } else { 
            console.log('missing method: ' + methodName);
        }
    })
}
