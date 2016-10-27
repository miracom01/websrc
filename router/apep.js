
module.exports = function(app) {
  var express = require('express');
  var route = express.Router();

  route.get('/ApEpManagement',function(req,res){
      res.send("test")
//res.render('ApEpManagement', {});
  });

  route.get('/listApEpList',function(req,res) {
    //test
      res.render('ApEpManagement', {});
  });
  return route;
};
