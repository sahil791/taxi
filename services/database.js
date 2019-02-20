/**
 *  File to create connection of mysql with nodejs.
 */

const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'taxi'
});

connection.connect(function(err,rows){
    if(err){
        console.log(err);
    }
    else{
        console.log("connection successfull");
    }
});

module.exports = connection;