var mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'sql3.freemysqlhosting.net',
    user : 'sql3337853',
    password : 'IiW982Rnzm',
    database : 'sql3337853'
  });
  
connection.connect();

module.exports = connection;