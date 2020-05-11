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
      //report errors on db query
      res.status(400).send({
        message: err.message
      });
    } 
    
    else {
      //if there are any results, user already exists
      if(results.length > 0){
        //report error
        res.status(400).send({
          message: 'User already exists'
        });
      } 
      
      else { //if no db query error and no existing users under that email, create user
        let createUser = 'Insert into Users (UserID, Username, Password) values (?,?,?)';
        let timestamp = Date.now();
        //query db with insertion of new user data
        db.query(createUser, [timestamp, req.body.email, req.body.password], (err, results) => {
          if(err){
            //report query error
            res.status(400).send({
              message: err.message
            });
          } 
          
          else {
            //if successful, send success message
            res.send({
              message: 'User Successfully Created.'
            });
          }
        });
      }
    }
  });
});

app.post('/authenticate', (req, res) => {
  console.log(req.body);

  var searchUser = 'SELECT COUNT(*) AS isMatch FROM Users WHERE Username=? AND Password=?';

  db.query(searchUser, [req.body.username, req.body.password], (err, results) => {
    if(err){
      //report db error
      res.status(400).send({
        message: err.message
      });
    }

    else {

      if(results[0].isMatch){
        //if first element of query response is a match, authentication is successful
        console.log("success");
        res.send({message: 'authenticated'})
      }

      else{
        //otherwise authentication fails
        console.log("fail");
        res.status(400).send({message: 'authentication failed'})
      }
  }
  })
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