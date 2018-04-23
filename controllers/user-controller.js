const connection = require('./../config');
const expressValidator = require('express-validator');

// user listing
module.exports.list = (req, res) => {
    var limit = 3;
    var page;

    if (req.query && req.query.page) {
        page = parseInt(req.query.page);
    } else {
        page = 1;
    }

    var start = (page * limit) - limit;
    var totalCount, next, previous;

    var searchInput;
    if (req.query && req.query.search) {
        searchInput = req.query.search.trim();
        searchInput = searchInput.replace(/<(?:.|\n)*?>/gm, '');
        req.session.search = searchInput;
    } else {
        searchInput = req.session.search;          
    }

    if(req.query && req.query.searchremove){
        searchInput = '';          
        req.session.search = '';        
    }
    
    var prequery = `SELECT COUNT(id) AS TotalCount FROM customer WHERE status = 1 ${searchInput ? `AND name LIKE '%${searchInput}%'` : ""}`;
    var query = connection.query(prequery, (err, result) => {
        if (err) {
            return res.send(err);
        }
        if (result) {
            total = result[0].TotalCount;
            var pages = Math.ceil(total / limit);

            if (page > 1) {
                previous = page - 1;
            }
            if (page <= (pages - 1)) {
                next = page + 1;
            }
        }
    });    

    let prepareQuery = `SELECT * FROM customer WHERE status = 1  ${searchInput ? `AND name LIKE '%${searchInput}%'` : ""} ORDER BY updated DESC LIMIT ${start},${limit}`;
    var query = connection.query(prepareQuery, function (err, rows) {
        if (err) {
            return res.status(500).send(err);
        }
        res.render('users', { page_title: "Users - Node.js", data: rows, next: next, prev: previous, currentPage: page, search: searchInput });
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

    req.checkBody('name', 'name is required').notEmpty();    
    req.checkBody('email', 'Email is required ').notEmpty();
    req.checkBody('email', 'must be a valid email').isEmail();
    req.checkBody('phone', 'Number is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        req.session.errors = errors;
        req.session.success = false;                
        req.flash('error', errors);
        res.redirect('/Users/add');
        return;
    }

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
