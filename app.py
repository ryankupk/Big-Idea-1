#flask app
import flask
from flask_socketio import SocketIO, send
from flask import Flask, json
import datetime

# x = datetime.datetime.now()
# print(x)



app = Flask(__name__)
app.config['SECRET_KEY'] = 'secretkey'
socket = SocketIO(app, engineio_logger=True,logger=True, cors_allowed_origins='*')

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
    {'date': '10/10/2020', 'sender': '😀😉😊😎', 'contents': '🎉🎫🖼👓🎀🎋💋💋💋💋'}#,
    # {date: , sender: , contents: },
    # {date: , sender: , contents: },
    # {date: , sender: , contents: },
    # {date: , sender: , contents: }
]

@app.route('/')
def mainRoute():
    #actually nothing
    return "hello world"

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