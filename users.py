from app import db
from app.models import User

users = User.query.all()
print "=========USERS=========="
for user in users:
    print user.first_name, user.last_name, user.email