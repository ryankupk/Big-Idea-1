#flask app
import flask
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def mainRoute():
    return "hello world"

@app.route('/testing', methods=['POST'])
def testing():
    data = request.data
    print(data)
    return {
        'testing': 'something hm'
    }

@app.route('/something')
def something():
    return {
        'something': 'something'
    }


app.run(debug=True)