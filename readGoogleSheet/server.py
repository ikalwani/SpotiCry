from flask import Flask, send_from_directory, jsonify

# using flask instead for authentication
# after loggin in-> server sets cookie called session id 
# this session id will refer to the session that u opened at login 
# server will check for any session which refers to the session id 
# if there is a session w that ID, u are authetincated 


app = Flask(__name__)

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/hello')
def hello():
    return jsonify(message="Hello from Flask!")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
