
module.exports = function() {
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var conn = require('../config/mysql/db')();
  var route = require('express').Router();

  route.get('/login', function(req, res){
    //var sql = 'SELECT id,title FROM topic';
    //conn.query(sql, function(err, topics, fields){
    res.render('login');
    //});
  });

  route.post('/login', function(req,res,next) {
    // passport.authenticate('local', function(err, user, info) {
    //   if (err) { return next(err); }
    //   if (!user) { return res.redirect('/login'); }
    //   req.login(user, function(err) {
    //     if (err) { return next(err); }
    //     return res.redirect('/');
    //   });
    //
    // })(req, res, next);
    var uname = req.body.username;
    var pwd = req.body.password;

    var sql = "SELECT * FROM TB_USER_MASTER WHERE user_id=?";
    conn.query(sql, [uname], function(err, rows){
      if(err){
        console.log(err);
        res.status(500).send();
      }

      if(rows.length === 0) {
        console.log('There is no user!');
        res.redirect('/auth/login');
      }else {
        var user = rows[0];
        //console.log('['+uname+']','['+user.USER_ID+']');
        return hasher({password:pwd, salt:user.SALT}, function(err, pass, salt, hash){
          console.log('['+hash+']','['+user.PASSWORD+']');
          if(hash === user.PASSWORD){
            console.log('LocalStrategy', user);
            req.session.user_id = user.USER_ID;
            req.session.user_name = user.USER_NAME;
            req.session.save(function(){
              res.redirect('/main');
              //res.render('main', {userId: req.session.user_id, displayUserName: req.session.displayName});
            });
          } else {
            res.send('Who are you? <a href="/auth/login">login</a>');
          }
        });
        //done(null, user);
        // return hasher({password:pwd, salt:user.SALT}, function(err, pass, salt, hash){
        //   if(hash === user.password){
        //     console.log('LocalStrategy', user);
        //     done(null, user);
        //   } else {
        //     console.log('11111111111111111111111111');
        //     done(null, false);
        //   }
        // });
      }
    });
  });

  route.get('/logout', function(req, res){
    console.log("logout finished : "+req.session.user_id);
    delete req.session.user_id;
    req.session.save(function(){
       res.send('you have been log-out successfully..... <a href="/auth/login">login</a>');
    });
  });


  return route;
};
