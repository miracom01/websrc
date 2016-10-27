
module.exports = function(app) {
  var express = require('express');
  var route = express.Router();

  route.get('/ApEpManagement',function(req,res){
    res.render('ApEpManagement', {
            userId: req.session.user_id,
            displayUserName : req.session.user_name});
  });

  route.get('/listApEpList',function(req,res) {
  });
  return route;
};
