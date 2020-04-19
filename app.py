#flask app
import flask
from flask_socketio import SocketIO, send
from flask import Flask, json, request, jsonify
import datetime
import pymysql as mariadb



# x = datetime.datetime.now()
# print(x)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secretkey'
socket = SocketIO(app, cors_allowed_origins='*')

try:
    db = mariadb.connect(user='sql3334414', password='Pyyhb6L2cr', database='sql3334414',host="sql3.freemysqlhosting.net")
except:
    print("ur db is fucked buddy")

cursor = db.cursor()


"""
Message structure:
date, sender, contents
(time, sender, contents)

json object:
{
    date: 01/01/2020,
    sender: '😀😀😀😉😉😙😚',
    contents: '🍆🍆🍆🍳🥚'

    date: 01/01/2020,
    sender: '😀😀😀😉😉😙😚',
    contents: 'a-b-e-t-3-w'

}
"""


messages = [
    {'date': '10/10/2020', 'sender': '😀😉😊😎', 'contents': '🎉🎫🖼👓🎀🎋💋💋💋💋'}
]

@app.route('/')
def mainRoute():
    #actually nothing
    return "hello world"

@app.route('/newuser', methods=['POST'])
def handleNewUser():
    params = request.json

    success = {"user": "added"}
    exists = {"error": "usernameExists"}
    failure = {"error": "userCreationFailed"}

    commmand = ""
    try:
        command = "SELECT COUNT(Username) AS count FROM Users WHERE Username = \"% s\""\
            %(params["username"])

        cursor.execute(command)
    except:
        return failure
    
    if cursor.fetchone()[0] > 0:
        #username is taken
        print("username taken")
        return exists

    try:
        command = "INSERT INTO Users (Username, Password) VALUES (\"% s\", \"% s\")"\
        %(params["username"], params["password"])
        
        cursor.execute(command)
        db.commit()

    except:
        return failure
    
    return success

@app.route('/authenticate', methods=['POST'])
def authenticate():
    params = request.json

    failure = {"error": "couldNotAuthenticate"}

    try:
        command = "SELECT COUNT(UserID) FROM Users WHERE Username = \"% s\" AND Password = \"% s\""\
            %(params["username"], params["password"])

        cursor.execute(command)
    except:
        return failure
    
    if cursor.fetchone()[0] == 1:
        return {"authenticated": 1}
    
    return {"authenticated": 0}


@socket.on('connect')
def handleConnection():
    print("connected")
    socket.emit("user connected", broadcast=True)

# #receives json object with messages
# @socket.on('json')
# def handleMessage(message):
#     print("json")
#     print(message)
#     socket.send(json.jsonify(messages[0]), broadcast=True)

@socket.on('message')
def handleMessage(message):
    print("message")
    print(message)
    socket.send(json.dumps(messages[0]), broadcast=True)


if __name__ == "__main__":
    # app.run(debug=True)
    # socketio.run(app, host='0.0.0.0', port=5000)
    socket.run(app, debug=True)