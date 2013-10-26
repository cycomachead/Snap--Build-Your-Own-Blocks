from app import db
from sqlalchemy import Column, SmallInteger, Integer, String,\
        LargeBinary, DateTime, ForeignKey, Table, Unicode, Boolean

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True)
    first_name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    password = Column(String(64))

    def __init__(self, first, last, email, password):
        self.first_name = first
        self.last_name = last
        self.password = password
        self.email = email

    def __repr__(self):
        return '<User %r>' % self.first_name