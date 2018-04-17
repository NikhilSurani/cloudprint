var Cryptr = require('cryptr');
var express =require("express");
var connection = require('./../config');


module.exports.register = function(req, res) {
    var today = new Date();
    var encryptedString = cryptr.encrypt(req.body.password);

    var users = { 
        "first_name":req.body.name,
        "last_name": req.body.lname,
        "email":req.body.email,
        "password":encryptedString,
        "created":today,
        "modified":today
    }
    console.log(users);
    connection.query('INSERT INTO users SET ?', users, (err, results, fields) => {
        if(err){
            res.json({
                status:false,
                message:'there are some error with query'
            });    
        }else {
            res.json({
                status:true,
                data:results,
                message:'user registered sucessfully'
            })            
    
        }

    });




};

