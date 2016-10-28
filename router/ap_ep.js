
module.exports = function(app) {
  var express = require('express');
  var route = express.Router();
  var conn = require('../config/mysql/db')();

  route.get('/listApEpList',function(req,res) {
  });


  route.post('/ApEpManagement', function(req, res){
    //txtInputApSN
    //txtInputApName
      console.log(req.session.user_id, req.body.txtInputApName, req.body.txtInputApSN);
      var user = {
        user_id:req.session.user_id,
        ap_name:req.body.txtInputApName,
        ap_sn:req.body.txtInputApSN
      };

      res.send('user id: ' + req.session.user_id + ' /ap_name: ' +req.body.txtInputApName+ ' /ap_sn' +req.body.txtInputApSN );

      /*
      var sql = 'INSERT INTO TB_EQUIP_MASTER SET ?';
      conn.query(sql, user, function(err, results){
        if(err){
          console.log(err);
          res.status(500);
        } else {
          req.session.user_id = user.user_id;
          req.session.user_name = user.user_name;
          console.log("login finished : "+req.session.user_id);
          req.session.save(function(){
            res.redirect('/main');
            //res.render('index',{sessionId:req.session.user_id});
          });
        }
      });
      */
  });

  route.get('/ApEpManagement',function(req,res){
    res.render('ApEpManagement', {
            userId: req.session.user_id,
            displayUserName : req.session.user_name});
  });













  return route;
};
