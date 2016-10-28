
module.exports = function(app) {
  var express = require('express');
  var route = express.Router();
  var conn = require('../config/mysql/db')();

  route.get('/listApEpList',function(req,res) {
  });

  route.get('/ApEpManagement',function(req,res){
    res.render('ApEpManagement', {
            userId: req.session.user_id,
            displayUserName : req.session.user_name});
  });




  return route;
};
