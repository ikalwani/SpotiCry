from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_cors import CORS

# using flask instead for authentication
# after loggin in-> server sets cookie called session id 
# this session id will refer to the session that u opened at login 
# server will check for any session which refers to the session id 
# if there is a session w that ID, u are authetincated 


app = Flask(__name__)
app.config['SECRET_KEY'] = 'a_very_secret_key'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/spoticry'
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
CORS(app)

@login_manager.user_loader
def load_user(username):
    user_data = mongo.db.users.find_one({"username": username})
    if not user_data:
        return None
    return User(user_data['username'], user_data['password'])

class User(UserMixin):
    def __init__(self, username, password):
        self.username = username
        self.password = password

    def get_id(self):
        return self.username

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user_data = mongo.db.users.find_one({"username": username})
    if user_data and bcrypt.check_password_hash(user_data['password'], password):
        user = User(user_data['username'], user_data['password'])
        login_user(user)
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"message": "Invalid username or password"}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/api/dashboard', methods=['GET'])
@login_required
def dashboard():
    user_data = mongo.db.user_data.find_one({"username": current_user.username})
    return jsonify(user_data), 200

if __name__ == '__main__':
    app.run(debug=True)

# @app.route('/')
# def serve():
#     return send_from_directory(app.static_folder, 'index.html')

# @app.route('/api/hello')
# def hello():
#     return jsonify(message="Hello from Flask!")

# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def catch_all(path):
#     return send_from_directory(app.static_folder, 'index.html')

# if __name__ == '__main__':
#     app.run(debug=True)
