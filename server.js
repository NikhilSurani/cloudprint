const express = require("express");
const bodyParser = require('body-parser');
var authenticateController = require('./controllers/authenticate-controller');
var registerController = require('./controllers/register-controller');
var connection = require("./config");
const path = require('path');
var http = require('http');
const userController = require('./controllers/user-controller');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {  
    res.render('login', {page_title: "Login Page"});
 }); 
  
//  app.get('/login.html', function (req, res) {  
//     res.sendFile( __dirname + "/" + "login.html" );  
//  });

 app.get('/users', userController.list);
 app.get('/users/add', userController.add);
 app.post('/users/add', userController.save);
 app.get('/users/edit/:id', userController.edit);
 app.post('/users/edit/:id', userController.edit_save)
 app.get('/users/delete/:id', userController.remove);
 
// console.log(authenticateController);
app.post('/controllers/register-controller', registerController.register);
app.post('/controllers/authenticate-controller', authenticateController.authenticate);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });