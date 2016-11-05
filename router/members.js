
module.exports = function(app) {
  var express = require('express');
  var route = express.Router();
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var conn = require('../config/mysql/db')();

  route.post('/register', function(req, res){
    hasher({password:req.body.password}, function(err, pass, salt, hash){
      //console.log(req.body.username, req.body.displayName, req.body.password);
      var user = {
        user_id: req.body.username,
        user_name: req.body.displayName,
        password: hash,
        salt: salt,
        region1: req.body.region1,
        region2: req.body.region2,
        sex: req.body.sex,
        age: req.body.age,
        home_mem_gbn: req.body.home_mem_gbn
      };
      var sql = 'INSERT INTO TB_USER_MASTER SET ?';
      conn.query(sql, user, function(err, results){
        if(err){
          console.log(err);
          res.status(500).send();
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

  route.get('/getMemberGbnByAjax', function(req,res){
    //console.log('/members/getRegion2ByAjax', req.query.region1);
    var sql = "SELECT CODE, CODE_NAME, DESCRIPTION FROM TB_COMMCODE WHERE P_CODE = 'HOME' ORDER BY DP_ORDER";
    //console.log(sql);
    conn.query(sql, function(err, results){
      if(err){
        console.log(err);
        res.status(500).send();
      } else {
        res.send({oinfo:results});
      }
    });
  });

  route.get('/getAgeByAjax', function(req,res){
    //console.log('/members/getRegion2ByAjax', req.query.region1);
    var sql = "SELECT CODE, CODE_NAME, DESCRIPTION FROM TB_COMMCODE WHERE P_CODE = 'AGE' ORDER BY DP_ORDER";
    //console.log(sql);
    conn.query(sql, function(err, results){
      if(err){
        console.log(err);
        res.status(500).send();
      } else {
        res.send({oinfo:results});
      }
    });
  });

  route.get('/getRegionByAjax', function(req,res){
    //console.log('/members/getRegion2ByAjax', req.query.region1);
    var sql = "SELECT CODE, CODE_NAME, DESCRIPTION FROM TB_COMMCODE WHERE P_CODE = 'REGION' ORDER BY DP_ORDER";
    //console.log(sql);
    conn.query(sql, function(err, results){
      if(err){
        console.log(err);
        res.status(500).send();
      } else {
        res.send({reg1Info:results});
      }
    });
  });

  route.get('/getRegion2ByAjax', function(req,res){
    //console.log('/members/getRegion2ByAjax', req.query.region1);
    var sql = "SELECT CODE, CODE_NAME, DESCRIPTION FROM TB_COMMCODE WHERE P_CODE = ?  ORDER BY DP_ORDER";
    //console.log(sql);
    conn.query(sql, [req.query.region1], function(err, results){
      if(err){
        console.log(err);
        res.status(500).send();
      } else {
        res.send({reg2Info:results});
      }
    });
  });

  route.get('/minfo_detail', function(req, res){
    var sql = 'SELECT user_id, user_name, region1, region2, user_sex, user_years, home_mem_gbn FROM TB_USER_MASTER WHERE USER_ID = ?';
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

  route.post('/minfo_update', function(req, res){
    console.log(req.body.region1, req.body.region2, req.body.password);
    console.log(req.body.sex, req.body.age, req.body.home_mem_gbn);
    hasher({password:req.body.password}, function(err, pass, salt, hash){

      var user_id = req.body.username;
      var region1 = req.body.region1;
      var region2 = req.body.region2;
      var sex = req.body.sex;
      var age = req.body.age;
      var home_mem_gbn = req.body.home_mem_gbn;
      var sql = `
        UPDATE TB_USER_MASTER
        SET PASSWORD = ?, SALT = ?, REGION1 = ?, REGION2 = ?, USER_SEX = ?, USER_YEARS = ?, HOME_MEM_GBN = ?, UPDATE_DTTM = SYSDATE()
        WHERE USER_ID = ?`;

      conn.query(sql, [hash,salt,region1,region2,sex,age,home_mem_gbn,user_id], function(err, results){
        if(err){
          console.log(err);
          res.status(500).send();
        } else {
          console.log(results);
          res.redirect('/main');
        }
      });
    });
  });

  return route;
};
