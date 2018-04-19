const express = require("express");
const bodyParser = require('body-parser');
var authenticateController = require('./controllers/authenticate-controller');
var registerController = require('./controllers/register-controller');
var connection = require("./config");
const path = require('path');
var http = require('http');
const userController = require('./controllers/user-controller');
const fs = require("fs");
const session = require('express-session');
const flash = require('connect-flash');
const fileUpload  = require('express-fileupload');
// var paginate = require('express-paginate');



var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    safeFileNames: true,
    preserveExtension: 4
  }));

  

app.use((req, res, move) => {
    var now = new Date().toString();
    var log = `${now}  ${req.url}  ${req.method}`;
    
    fs.appendFileSync("./logs/server.log", log + '\n', (err) => {
        console.log(err);
    });
    move();
    
});

app.use(session({
    key: 'user_sid',
    secret: 'heyyanode',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('error');
    next();
});


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

var sessionChecker = (req, res, next) => {   
    if (req.session.user) {
        app.locals.user = req.session.user;    
        next();
    } else {
        res.redirect('/');
    }    
};

app.get('/', function (req, res) {          
    res.render('login', { page_title: "Login Page", user: app.locals.user});
 });
 
 app.get('/logout', function (req, res) {  
    req.flash('success', 'You have successfully logout!');  
    req.session.user = '';  
    // req.session.destroy();    
    app.locals.user = '';
    res.redirect("/");            
    
 });
  
 app.get('/signup', function (req, res) {      
    res.render('register', { page_title: "Sign up Page", user: app.locals.user }); 
 });

 // console.log(authenticateController);
 app.post('/controllers/register-controller', registerController.register);
 app.post('/controllers/authenticate-controller', authenticateController.authenticate);

 app.get('/users',sessionChecker, userController.list);
 app.get('/users/add',sessionChecker,userController.add);
 app.post('/users/add',sessionChecker, userController.save);
 app.get('/users/edit/:id', sessionChecker, userController.edit);
 app.post('/users/edit/:id', sessionChecker, userController.edit_save)
 app.get('/users/delete/:id', sessionChecker, userController.remove); 

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });