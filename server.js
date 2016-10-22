var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs");
var path = require('path');
var morgan = require('morgan');

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(session({
 secret: 'miracomSecretKey',
 resave: false,
 saveUninitialized: true
}));

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

var router = require('./router/main')(app, fs);
