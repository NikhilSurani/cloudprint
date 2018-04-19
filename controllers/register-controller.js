var Cryptr        = require('cryptr');
var connection    = require('./../config');
var path          = require('path');


module.exports.register = function(req, res) {
    var today = new Date();
    var encryptedString = cryptr.encrypt(req.body.password);    
    let inputFile  = req.files.uploaded_image;
    let file_name =  req.files.uploaded_image.name;    
    
    let upload_img_dir = path.join(__dirname, "../public/images/profiles");    

    inputFile.mv(upload_img_dir + "/" + file_name, function(err) {
        if (err){
            // return res.status(500).send(err); 
            req.flash('error', 'Error occuurs while uploading file.');
        }
        // else {
        //     req.flash('success', 'file uploaded successfuly.');
        // }
      });

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

