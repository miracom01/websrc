module.exports = function(){
  var express = require('express');
  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session);
  var bodyParser = require('body-parser');

  var app = express();
  // create a write stream (in append mode)
app.use(express.static('public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  // app.set('views', './views');
  // app.set('view engine', 'jade');

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(session({
    secret: '1234DSFs@adf1234!@#$asd',
    resave: false,
    saveUninitialized: true,
    store:new MySQLStore({
      host:'ec2-52-78-49-178.ap-northeast-2.compute.amazonaws.com',
      port:3306,
      user:'root',
      password:'miracom500',
      database:'group2'
    })
  }));
  return app;
};
