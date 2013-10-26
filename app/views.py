from app import app, db
from app.models import User
from flask import render_template, request, flash, redirect, url_for, session
from wtforms import Form, BooleanField, TextField, PasswordField, validators

@app.route('/', methods = ['GET', 'POST'])
def index():
    if request.method == 'POST':
        #add request
        pass
    if request.method == 'GET':
        #add request
        pass
	return render_template('snap.html')

@app.route("/logout", methods=["GET", "POST"])
def logout():
    session.pop('user_id')
    return redirect(url_for('create'))

@app.route("/login", methods=["GET", "POST"])
def login():
    if form.validate_on_submit():
        flash(u'Successfully logged in as %s' % form.user.email)
        session['user_id'] = form.user.id
        return redirect(url_for('files'))
    return render_template('login.html', form=form)

@app.route('/create', methods = ['GET', 'POST'])
def create():
    form = SignupForm(request.form)
    signupForm = LoginForm(request.form)
    if request.method == 'POST' and form.validate():
        user = User(form.firstName.data, form.lastName.data, form.email.data,
                    form.password.data)
        db.session.add(user)
        flash('Thanks for registering')
        db.session.commit()
        return redirect(url_for('files'))
    if signupForm.validate():
        flash(u'Successfully logged in as %s' % signupForm.user.email)
        session['user_id'] = signupForm.user.id
        return redirect(url_for('files'))
    return render_template('create.html', form=form, signupForm=signupForm)

@app.route('/files', methods = ['GET', 'POST'])
def files():
    # form = SignupForm(request.form)
    # if request.method == 'POST' and form.validate():
    #     user = User(form.firstName.data, form.lastName.data, form.email.data,
    #                 form.password.data)
    #     db.session.add(user)
    #     flash('Thanks for registering')
    #     db.session.commit()
    #     return redirect(url_for('files'))
    return render_template('files.html')


class SignupForm(Form):
    firstName = TextField('First Name', [validators.Length(min=4, max=25)])
    lastName = TextField('Last Name', [validators.Length(min=4, max=25)])
    email = TextField('Email Address', [validators.Length(min=6, max=35)])
    password = PasswordField('New Password', [
        validators.Required(),
    ])

class LoginForm(Form):
    email = TextField('Email', [validators.Required()])
    password = PasswordField('Password', [validators.Required()])

    def __init__(self, *args, **kwargs):
        Form.__init__(self, *args, **kwargs)
        self.user = None

    def validate(self):
        rv = Form.validate(self)
        if not rv:
            return False

        user = User.query.filter_by(
            email=self.email.data, password=self.password.data).first()
        if user is None:
            self.email.errors.append('Unknown username or incorrect password')
            return False
        #TODO    
        # if not user.check_password(self.password.data):
        #     self.password.errors.append('Invalid password')
        #     return False

        self.user = user
        return True