const Cryptr = require("cryptr");
cryptr = new Cryptr('myTotalySecretKey');

var connection = require('./../config');

module.exports.authenticate = (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results, fields) => {
        if (err) {
            res.json({
                status: false,
                message: 'there are some error with query'
            })

        } else {
            if (results.length > 0) {
                decryptedString = cryptr.decrypt(results[0].password);
                if (password == decryptedString) {
                    res.redirect("/users");
                    // res.json({
                    //     status: true,
                    //     message: 'successfully authenticated'
                    // })
                } else {
                    // res.json({
                    //     status: false,
                    //     message: "Email and password does not match"
                    // });
                    res.redirect("/");
                }

            } else {
                // res.json({
                //     status: false,
                //     message: "Email does not exits"
                // });
                res.redirect("/");

            }

        }

    });

};


