var express = require('express'); 
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var util = require('./lib/utility.js');
var bcrypt = require('bcrypt-nodejs');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var User = require('./db/User/userModel.js');
var UserCtrl = require('./db/User/userController');

var db = mongoose.connection;

var port = process.env.PORT || 3000;
var host = process.env.host || '127.0.0.1';
// mongoose.connect('mongodb://' + host + '/peacefulSplinter');

app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({secret: 'shhhh', saveUninitialized: true, resave: true}));

app.listen(port, function(){
  console.log("Listening on " + port);
});

app.use(passport.initialize());

// passport.use('local-login', new LocalStrategy(function(username, password, done){
//     User.findOne({username: username}, function(err, user){

//         if (err) {
//           return done(err);
//         } 
//         // if username not in database
//         if (!user) {
//           return done(null, false, {message: 'username not found!!!'});
//         }
//         // compare both passwords
//         user.comparePassword(password, function(err, isMatch){
//             if (err) return done(err);
//             if (isMatch) {
//               return done(null, user)
//             } else {
//               return done(null, false, {message: "invalid password"});
//             }
//         });
//         //return done(null, user);
//     });
// }));

passport.use('local-signup', new LocalStrategy(function(username, password, done){
    User.findOne({username: username}, function(err, user){

        if (err) {
          return done(err);
        } 
        // if username in database
        if (user) {
          return done(null, false, {message: 'That username is already taken!'});
        } else { // add user to database
          var newUser = new User();
          newUser.username = username;
          newUser.password = password;
          
          newUser.save(function(err){
            if (err) throw err;
            return done(null, newUser);
          });
        }
    });
}));

// SET UP OUR ROUTES!

// serve up login page after hitting /login
// app.get('/login', function(req, res){
//   console.log('hello');
//   res.sendFile(__dirname + '/login.html');
//   //res.render('test');
// });

// app.post('/login', passport.authenticate('local-login', {
//   successRedirect: '/home',
//   failureRedirect: '/login'

// }));

// serve up /signup after hitting /signup
app.get('/signup', function(req, res){
  res.sendFile(__dirname + '/signup.html');
});

// process the signup form
app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/home',
  failureRedirect: '/signup'
  // check to see if username already exists
  // save to db here
}));

// check to see if user logged in to view home page
// app.get('/home', util.isLoggedIn, function(req, res){
//   res.sendFile(__dirname + '/home.html');
// });

// serve up /login page after hitting /logout
// app.get('/logout', function(req, res){
//   req.logout();
//   res.redirect('/login');
// });

// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/test.html'); // home page
// });

// app.post('/', function (req, res) {
//  // creates new user instance
//  var username = req.body.username;
//  var password = req.body.password;

//  var userQuery = User.where({username: username});
//  userQuery.findOne(function(err, user){
// 	console.log(user);
// 	if (err) throw err;
// 	if (user) {
// 		 console.log('user exists!');
//     else {
// 		  new User({
// 		  	username: username,
// 		  	password: password
// 		  }).save();
//       	}
//        }
// 	  }
//     if (!user) {
//      bcrypt.genSalt(10, function (error, result) {
//        bcrypt.hash(password, result, null, function (err, hash) {
//          User.save({
//              username: username,
//              salt: result,
//              password: hash
//            })
//            .complete(function (err, user) {
//              if (!!err) {
//                console.log('An error occurred while creating the table: user.create', err);
//              } else {
//                console.log('made it to DB!');
//                res.redirect('/');
//              }
//            });
//        });
//      });
//    }
//  });

// });

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/test.html');
});

// Testing
app.post('/', UserCtrl.setCookie);
app.post('/test', UserCtrl.destroyCookie);

module.exports = passport
