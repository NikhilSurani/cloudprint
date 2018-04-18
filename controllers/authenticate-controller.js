const Cryptr = require("cryptr");
cryptr = new Cryptr('myTotalySecretKey');

var connection = require('./../config');

module.exports.authenticate = (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results, fields) => {
        if (err) {
            req.flash('error', 'Something is missing. Please try again after sometimes.');                                  
            res.redirect('/');

        } else {
            if (results.length > 0) {
                decryptedString = cryptr.decrypt(results[0].password);
                if (password == decryptedString) {                    
                    req.session.user = results[0];  
                    req.flash('success', 'Successfully log in!');                                  
                    res.redirect("/users");
                } else {
                    req.flash('error', 'User name & password doesn\'t matches.');                                  
                    res.redirect("/");
                }

            } else {
                req.flash('error', 'Please sign up.');                                  
                res.redirect('/signup');

            }

        }

    });

};


