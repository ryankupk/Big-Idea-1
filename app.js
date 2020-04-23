"use strict";
var express = require("express");
var app = express();
var fs = require("fs");
var http = require("http").createServer(app);
var bodyParser = require("body-parser");
// var io = require("socket.io")(http);
var io = require('socket.io')(http, { origins: '*:*'});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res)=>{
    res.send('hello world');
});

io.on("connection", function (socket) {
    console.log('user connected');

    socket.on("disconnect", function () {
      console.log('disconnected');
    });

    socket.on('message', (msg)=>{
        console.log(msg);
        // socket.broadcast.send('message', msg);
        socket.broadcast.emit('message', msg);
    });
  });

http.listen(3000, function () {
    console.log("listening on port: 3000");
});