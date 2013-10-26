from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
app.secret_key = '1\xdbf4\x98_\xb62\x1eU!\xb2\xee:\xde\x93\xd9\xd2\xec\x9b\\\xa7\xad\xed'
db = SQLAlchemy(app)


from app import views, models