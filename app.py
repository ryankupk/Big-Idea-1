#flask app
import flask
from flask import Flask

app = Flask(__name__)

@app.route('/')
def mainRoute():
    return "hello world"


app.run(debug=True)