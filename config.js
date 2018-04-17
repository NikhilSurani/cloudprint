const mysql = require('mysql');

var connection  = mysql.createConnection({
    host       : 'localhost',
    user       : "root",
    password   : "root",
    database   : "nodejs"
});

connection.connect((err) =>{
    if(!err){
        console.log("Database is connected ... \n\n");  
    }else {
        console.log("Error connecting database ... \n\n");  
    }
});

module.exports = connection;