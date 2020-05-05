"use strict";
var express = require("express");
var app = express();
var fs = require("fs");
var http = require("http").createServer(app);
var bodyParser = require("body-parser");
var io = require('socket.io')(http, { origins: '*:*'});
var db = require('./db.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res)=>{
    res.send('hello world');
});


app.post('/newuser', (req, res) =>{
  var command = 'SELECT COUNT(*) AS isMatch FROM Users WHERE Username=?';

  db.query(command, [req.body.username], (error, results) =>{
    if(error) {
      console.log(error)
      res.send({'error': 'dbFailure'});
    }

    else if(results[0].isMatch) res.send({'error': 'usernameExists'});

    else{
      command = 'INSERT INTO Users (Username, Password) VALUES (?, ?)'
      db.query(command, [req.body.username, req.body.password], (error) => {
        if(error){
          console.log(error)
          res.send({'error': 'dbFailure'});
        }

        else res.send({'success': 'userCreated'})

      })
      db.commit();
    }
  })
});


app.post('/authenticate', (req, res) =>{
  var command = 'SELECT COUNT(*) AS isMatch FROM Users WHERE Username=? AND Password=?';

  db.query(command, [req.body.username, req.body.password], (error, results) =>{
    if(error){
      console.log(error)
      res.send({'error': 'dbFailure'});
    }
    else if(results[0].isMatch){
      res.send({'authenticated': 1})
    }
    else{
      res.send({'authenticated': 0})
    }
  })
});


io.on("db", function (socket) {
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