var Cryptr = require('cryptr');
var express =require("express");
var connection = require('./../config');


module.exports.register = function(req, res) {
    var today = new Date();
    var encryptedString = cryptr.encrypt(req.body.password);

    var users = { 
        "first_name":req.body.fname,
        "last_name":req.body.lname,        
        "email":req.body.email,
        "password":encryptedString,
        "created":today,
        "modified":today
    }

    connection.query('INSERT INTO users SET ?', users, (err, results, fields) => {
        if(err){
            // res.json({
            //     status:false,
            //     message:'there are some error with query'
            // });    
            req.flash('error', 'There are some error with query');
            res.redirect("/signup");            
        }else {
            // res.json({
            //     status:true,
            //     data:results,
            //     message:'user registered sucessfully'
            // })
            req.flash('success', 'you have registered sucessfully!');  
            res.redirect("/");            
    
        }

    });




};

