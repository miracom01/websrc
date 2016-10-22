var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
<<<<<<< HEAD
var fs = require("fs")
=======
var fs = require("fs");
>>>>>>> 815a1994b881b84325e123e295609706a6751e5e

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

<<<<<<< HEAD
var server = app.listen(7777, function(){
 console.log("Group_2 Express server has started on port 7777")
});

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
=======

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

>>>>>>> 815a1994b881b84325e123e295609706a6751e5e
app.use(session({
 secret: 'miracomSecretKey',
 resave: false,
 saveUninitialized: true
}));

<<<<<<< HEAD
=======
var auth = require('./router/auth')(app);
var members = require('./router/members')(app);
var ap_ep = require('./router/ap_ep')(app);
var sapi = require('./router/service_api')(app);
// /*routing */
app.use('/auth',auth); //로그인/인증관련
app.use('/members',members); //회원정보 관리
app.use('/ap_ep',ap_ep); //AP/EP관리
app.use('/sapi',sapi); //서비스 api

var server = app.listen(7777, function(){
 console.log("Group_2 Express server has started on port 7777");
});
>>>>>>> 815a1994b881b84325e123e295609706a6751e5e

var router = require('./router/main')(app, fs);
