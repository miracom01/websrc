
module.exports = function(app) {
  var express = require('express');
  var route = express.Router();

  route.get('/apepmanage',function(req,res){
      res.render('ApEpManagement', {});
  });

  route.get('/listApEpList',function(req,res) {

  });
  return route;
};
