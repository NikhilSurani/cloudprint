var connection = require('./../config');


// user listing
module.exports.list = (req, res) => {

    var query = connection.query('SELECT * FROM customer ORDER BY updated DESC', function (err, rows) {
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
    let  today = new Date();

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
        if (err){
            req.flash('error', 'Something went wrong. Please try once again.'); 
            // console.log("Error inserting : %s ", err);
        }else {
            req.flash('success', 'You have been successfully registered.');             
            res.redirect('/users');
        }         
    });
};

// Edit user details
module.exports.edit = (req, res) => {
    var id = req.params.id;
    var query = connection.query('SELECT * FROM customer WHERE id = ?', [id], function (err, rows) {
        if (err){
            req.flash('error', 'Something went wrong. Please try once again.');                                  
            // console.log("Error Selecting : %s ", err);
        }else{            
            res.render('add_user', { page_title: "Edit User - Node.js", data: rows });
        }

    });
}

// edit and save user details
module.exports.edit_save = (req, res) => { 
    let  today = new Date();   

    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id; 

    var data = {
        name: input.name,
        address: input.address,
        email: input.email,
        phone: input.phone,        
        updated: today  
    }   

    var query = connection.query("UPDATE customer SET ? WHERE id = " + id,  data, function (err, rows) {        
        if (err){
            req.flash('error', 'Something went wrong. Please try once again.');                                              
        }else {            
            req.flash('success', 'Record has been updated successfully.');             
            res.redirect('/users');
        }
        
    });

}
// Remove user details from list
module.exports.remove = (req, res) => {
    var id = req.params.id;
    var query = connection.query("DELETE FROM customer WHERE id = " + id, function (err, rows) {
        if (err){
            req.flash('error', 'Something went wrong. Please try once again.');                                              
            // console.log("Error deleting : %s ", err);
        }
        req.flash('success', 'Record has been removed successfully.');             
        res.redirect('/users');

    });

}
