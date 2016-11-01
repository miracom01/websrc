
module.exports = function(app) {
  var express = require('express');
  var route = express.Router();
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var conn = require('../config/mysql/db')();

  route.post('/register', function(req, res){
    hasher({password:req.body.password}, function(err, pass, salt, hash){
      console.log(req.body.username, req.body.displayName, req.body.password);
      var user = {
        user_id:req.body.username,
        user_name:req.body.displayName,
        password:hash,
        salt:salt
      };
      var sql = 'INSERT INTO TB_USER_MASTER SET ?';
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
    });
  });

  route.get('/register', function(req, res){
    res.render('members/new_member_create');
  });

  route.get('/getRegion2ByAjax', function(req,res){
    console.log('/members/getRegion2ByAjax', req.query.region1);
    var sql = `
    SELECT CODE, CODE_NAME, DESCRIPTION
    FROM TB_COMMCODE WHERE P_CODE=?
    ORDER BY DP_ORDER`;
    console.log(sql);
    conn.query(sql, [req.query.region1], function(err, results){
      if(err){
        console.log(err);
        res.status(500).end();
      } else {
        res.send({reg2Info:results});
      }
    });



  });

  route.get('/minfo_detail', function(req, res){
    var sql = 'SELECT user_id, user_name FROM TB_USER_MASTER WHERE USER_ID=?';
    conn.query(sql, [req.session.user_id], function(err, results){
      if(err){
        console.log(err);
        res.status(500).end();
      } else {
        var minfo = results[0];
        res.render('members/minfo_detail',{minfo:minfo});
      }
    });


  });


  // route.post('/newMember',function(req,res) {
  //   var sql = "INSERT INTO TB_USER_MASTER "
  //       + "(USER_ID, USER_NAME, REGION1, REGION2, USER_ADDRESS, POSTAL_CODE, TEL_NO, USER_SEX, USER_YEARS, HOME_MEM_GBN, CREATE_DTTM, UPDATE_DTTM)"
  //       + "VALUES"
  //       + "('qq', '', 'GG', 'GG001', '강원도 춘천', '111222', '', 'M', '10', '01', sysdate(), '')";
  //
  // });
  //
  // route.get('/newMember',function(req,res) {
  //   res.render('new_member_create',{});
  //
  //   var sql = "INSERT INTO TB_USER_MASTER "
  //       + "(USER_ID, USER_NAME, REGION1, REGION2, USER_ADDRESS, POSTAL_CODE, TEL_NO, USER_SEX, USER_YEARS, HOME_MEM_GBN, CREATE_DTTM, UPDATE_DTTM)"
  //       + "VALUES"
  //       + "('qq', '', 'GG', 'GG001', '강원도 춘천', '111222', '', 'M', '10', '01', sysdate(), '')";
  //
  //   console.log(sql);
  // });

  return route;
};
