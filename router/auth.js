
module.exports = function(app) {
  var express = require('express');
  var route = express.Router();

  route.post('/login',function(req,res) {

  });

  route.get('/login/:username',function(req,res) {
  });

  return route;
};
