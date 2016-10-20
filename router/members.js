
module.exports = function(app) {
  var express = require('express');
  var route = express.Router();

  route.post('/newMember',function(req,res) {

  });

  route.get('/newMember',function(req,res) {
    res.render('new_member_create', {
        title: "MY HOMEPAGE",
        length: 5
    });
  });

  return route;
};
