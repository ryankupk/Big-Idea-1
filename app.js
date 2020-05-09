"use strict";
const express = require("express");
const app = express();
const fs = require("fs");
const http = require("http").createServer(app);
const bodyParser = require("body-parser");
const io = require('socket.io')(http, { origins: '*:*'});
const db = require('./db.js');
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.get('/', (req, res)=>{
    res.send('hello world');
});


app.post('/createUser', (req, res) => {
  console.log(req.body);

  let searchUser = 'Select * from Users where Username = ?'
  db.query(searchUser, [req.body.email], (err, results) => {
    if(err){
      res.status(400).send({
        message: err.message
      });
    } else {
      if(results.length > 0){
        res.status(400).send({
          message: 'User already exists'
        });
      } else {
        let createUser = 'Insert into Users (UserID, Username, Password) values (?,?,?)';
        let timestamp = Date.now();
        db.query(createUser, [timestamp, req.body.email, req.body.password], (err, results) => {
          if(err){
            res.status(400).send({
              message: err.message
            });
          } else {
            res.send({
              message: 'User Succesfully Created.'
            });
          };
        });
      };
    };
  });
});

app.post('/authenticate', (req, res) => {
  console.log(req.body);
  res.send({
    'type': 'authenticate'
  });
  // var command = 'SELECT COUNT(*) AS isMatch FROM Users WHERE Username=? AND Password=?';

  // db.query(command, [req.body.username, req.body.password], (error, results) => {
  //   if(error){
  //     console.log(error)
  //     res.send({'error': 'dbFailure'});
  //   }
  //   else if(results[0].isMatch){
  //     res.send({'authenticated': 1})
  //   }
  //   else{
  //     res.send({'authenticated': 0})
  //   }
  // })
});


// io.on("db", function (socket) {
//     console.log('user connected');

//     socket.on("disconnect", function () {
//       console.log('disconnected');
//     });

//     socket.on('message', (msg)=>{
//         console.log(msg);
//         // socket.broadcast.send('message', msg);
//         socket.broadcast.emit('message', msg);
//     });
//   });

http.listen(3000, function () {
    console.log("listening on port: 3000");
});