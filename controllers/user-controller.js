var connection = require('./../config');

// user listing
module.exports.list = (req, res) => {
    var limit = 3;
    var page;
    
    if (req.query && req.query.page) {        
        console.log(req.query.page);
        page = parseInt(req.query.page);
    } else {
        page = 1;
    }

    var start = (page * limit) - limit;

    var totalCount;
    var next;
    var previous;
        var prequery = `SELECT COUNT(id) AS TotalCount FROM customer`;
        var query = connection.query(prequery, (err, result) => {            
            if(err){
                return res.send(err);
            }
        if (result) {            
            total = result[0].TotalCount;
            var pages = Math.ceil(total / limit);          

            if (page > 1){
                previous = page - 1;
            } 
            if (page <= (pages - 1)){
                next = page + 1;
            } 
        }
    });
    
    let prepareQuery = `SELECT * FROM customer ORDER BY updated DESC LIMIT ${start},${limit}`;
    var query = connection.query(prepareQuery, function (err, rows) {
        if (err) {
            // console.log("Error Selecting : %s ", err);
            console.log(query)
            return res.status(500).send(err);
        }
        res.render('users', { page_title: "Users - Node.js", data: rows, next: next, prev: previous, currentPage: page });
    });
    //console.log(query.sql);
};
// add new user 
module.exports.add = (req, res) => {
    res.render("add_user", { page_title: "Add New User" });
};

module.exports.save = (req, res) => {
    let today = new Date();
    var input = JSON.parse(JSON.stringify(req.body));
    var data = {
        name: input.name,
        address: input.address,
        email: input.email,
        phone: input.phone,
        created: today,
        updated: today
    };
    var query = connection.query("INSERT INTO customer set ? ", data, function (err, rows) {
        if (err) {
            req.flash('error', 'Something went wrong. Please try once again.');
            // console.log("Error inserting : %s ", err);
        } else {
            req.flash('success', 'You have been successfully registered.');
            res.redirect('/users');
        }
    });
};

// Edit user details
module.exports.edit = (req, res) => {
    var id = req.params.id;
    var query = connection.query('SELECT * FROM customer WHERE id = ?', [id], function (err, rows) {
        if (err) {
            req.flash('error', 'Something went wrong. Please try once again.');
            // console.log("Error Selecting : %s ", err);
        } else {
            res.render('add_user', { page_title: "Edit User - Node.js", data: rows });
        }

    });
}

// edit and save user details
module.exports.edit_save = (req, res) => {
    let today = new Date();
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    var data = {
        name: input.name,
        address: input.address,
        email: input.email,
        phone: input.phone,
        updated: today
    }

    var query = connection.query("UPDATE customer SET ? WHERE id = " + id, data, function (err, rows) {
        if (err) {
            req.flash('error', 'Something went wrong. Please try once again.');
        } else {
            req.flash('success', 'Record has been updated successfully.');
            res.redirect('/users');
        }

    });

}
// Remove user details from list
module.exports.remove = (req, res) => {
    var id = req.params.id;
    var query = connection.query("DELETE FROM customer WHERE id = " + id, function (err, rows) {
        if (err) {
            req.flash('error', 'Something went wrong. Please try once again.');
            // console.log("Error deleting : %s ", err);
        }
        req.flash('success', 'Record has been removed successfully.');
        res.redirect('/users');
    });

}
