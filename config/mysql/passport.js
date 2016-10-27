module.exports = function(app){
  var conn = require('./db')();
  var bkfd2Password = require("pbkdf2-password");
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var hasher = bkfd2Password();
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    console.log('serializeUser---------', user);
    done(null, user.user_id);
  });
  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser--------', id);
    var sql = 'SELECT * FROM TB_USER_MASTER WHERE user_id=?';
    conn.query(sql, [id], function(err, results){
      if(err){
        console.log(err);
        done('There is no user.');
      } else {
        console.log(results[0]);
        done(null, results[0]);
      }
    });
  });

  passport.use(new LocalStrategy(
    function(username, password, done){
      var uname = username;
      var pwd = password;
      var sql = "SELECT * FROM TB_USER_MASTER WHERE user_id=?";
      conn.query(sql, [uname], function(err, results){
        if(err){
          console.log(err);
          return done('There is no user.');
        }

        var user = results[0];
        //done(null, user);
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password){
            console.log('LocalStrategy', user);
            done(null, user);
          } else {
            console.log('11111111111111111111111111');
            done('Password that have submitted is incorrect');
          }
        });
      });
    }
  ));

  return passport;
};
