module.exports = function(app, fs)
{



  route.post('/main', function(req, res, next){
    //txtInputApSN
    //txtInputApName
    res.send('user id: ' + req.session.user_id + ' /ap_name: ' +req.body.addApform.txtInputApName+ ' /ap_sn' +req.body.addApform.txtInputApSN );


      console.log(req.session.user_id, req.body.addApform.txtInputApName, req.body.addApform.txtInputApSN);
      var user = {
        user_id:req.session.user_id,
        ap_name:req.body.addApform.txtInputApName,
        ap_sn:req.body.addApform.txtInputApSN
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

};
