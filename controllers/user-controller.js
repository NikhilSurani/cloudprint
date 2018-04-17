var connection = require('./../config');


// user listing
module.exports.list = (req, res) => {

    var query = connection.query('SELECT * FROM customer ORDER BY ID DESC', function (err, rows) {
        if (err) {
            console.log("Error Selecting : %s ", err);
        }
        res.render('users', { page_title: "Users - Node.js", data: rows });
    });
    //console.log(query.sql);
};
// add new user 
module.exports.add = (req, res) => {
    res.render("add_user", { page_title: "Add New User" });
};

module.exports.save = (req, res) => {

    var input = JSON.parse(JSON.stringify(req.body));

    var data = {
        name: input.name,
        address: input.address,
        email: input.email,
        phone: input.phone
    };

    var query = connection.query("INSERT INTO customer set ? ", data, function (err, rows) {
        if (err)
            console.log("Error inserting : %s ", err);

        res.redirect('/users');
    });

};
// Edit user details
module.exports.edit = (req, res) => {
    var id = req.params.id;
    var query = connection.query('SELECT * FROM customer WHERE id = ?', [id], function (err, rows) {
        if (err)
            console.log("Error Selecting : %s ", err);

        res.render('add_user', { page_title: "Edit User - Node.js", data: rows });
    });
}

// edit and save user details
module.exports.edit_save = (req, res) => {

    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;

    var data = {
        name: input.name,
        address: input.address,
        email: input.email,
        phone: input.phone
    }

    var query = connection.query("UPDATE customer set ? WHERE id = ? ", data, function (err, rows) {
        if (err)
            console.log("Error inserting : %s ", err);

        res.redirect('/users');
    });

}

module.exports.remove = (req, res) => {
    var id = req.params.id;
    var query = connection.query("DELETE FROM customer  WHERE id = ? ", [id], function (err, rows) {
        if (err){
            console.log("Error deleting : %s ", err);
        }
        res.redirect('/users');

    });

}
