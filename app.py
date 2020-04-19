#flask app
import flask
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def mainRoute():
    return "hello world"

app.run(debug=True)