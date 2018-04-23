const Cryptr        = require('cryptr');
const connection    = require('./../config');
const path          = require('path');
const expressValidator = require('express-validator');

module.exports.register = function(req, res) {
    var today = new Date();
    var encryptedString = cryptr.encrypt(req.body.password);        

    req.checkBody('fname', 'First name is required').notEmpty();
    req.checkBody('lname', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required ').notEmpty();
    req.checkBody('email', 'must be a valid email').isEmail();
    req.checkBody('password', 'password is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        req.session.errors = errors;
        req.session.success = false;                
        req.flash('error', errors);
        res.redirect('/signup');
        return;
    }

    if(req.files.uploaded_image){
        var inputFile  = req.files.uploaded_image;
        var file_name =  req.files.uploaded_image.name
        let upload_img_dir = path.join(__dirname, "../public/images/profiles");    
    
        inputFile.mv(upload_img_dir + "/" + file_name, function(err) {
            if (err){                
                req.flash('error', 'Error occuurs while uploading file.');
            }            
          });
    }    

    var users = { 
        "first_name":req.body.fname,
        "last_name":req.body.lname,        
        "email":req.body.email,
        "password":encryptedString,
        "profile_img_title": file_name,
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

