
module.exports = function(app) {
  var route = require('express').Router();

  route.get('/ApEpManagement',function(req,res){
      res.render('ApEpManagement', {});

  });

  route.post('/ApEpManagement', function(req, res){
    res.render('ApEpManagement', {});
  });

  route.get('/listApEpList',function(req,res) {
    //test
      res.render('ApEpManagement', {});
  });
  return route;
};
