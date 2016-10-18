
module.exports = function(app) {
  var express = require('express');
  var route = express.Router();

  route.post('/saveMeasureData',function(req,res) {

  });

  route.get('/verifyCtrlSignal/:ep_id',function(req,res) {
  });

  route.get('/checkEpStatus/:ep_id',function(req,res) {
    res.send('checkEpStatus in ep_id :'+req.params.ep_id+', aa : '+req.query.aa);
  });

  return route;
};
