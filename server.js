
var app = require('./config/mysql/express')();
//var passport = require('./config/mysql/passport')(app);
var path = require('path');
var fs = require("fs");
var morgan = require('morgan');

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
// setup the logger
app.use(morgan('debug', {stream: accessLogStream}));


app.use(function (req, res, next) {
  var isLogin = false;
  var url = req.originalUrl;

  if(req.session.user_id) {
    isLogin = true;
  }
  console.log('====================================');
  console.log( isLogin );
  console.log('Request URL:', url);
  console.log(req.session.user_id,req.session.user_name);
  console.log('====================================');

  if(!isLogin && (url.indexOf('/auth/login') > -1 || url.indexOf('/members/register') > -1)) {
    next();
  }else if(isLogin ) {
    next();
  }else {
    res.send(`
      <html>
        <body>
          you have been not login. <br>
          if you want to log-in Click <a href="/auth/login"><b>Here</b></a>
        </body>
      </html>
      `);
  }

});

var members = require('./router/members')(app);
var ap_ep = require('./router/ap_ep')(app);
var sapi = require('./router/service_api')(app);
// /*routing */
app.use('/members',members); //회원정보 관리
app.use('/ap_ep',ap_ep); //AP/EP관리
app.use('/sapi',sapi); //서비스 api

app.set('views', './views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
//var router = require('./router/auth')(app,session);//로그인/인증관련
//var router = require('./router/main')(app, fs);


var auth = require('./router/auth')();
app.use('/auth', auth);


app.get('/',function(req,res){
  res.redirect('/main');
});

app.get('/main',function(req,res){
    res.render('main', {
        userId: req.session.user_id,
        displayUserName : req.session.user_name
    });
});



app.post('/main', function(req, res, next){
  //txtInputApSN
  //txtInputApName
  if(req.body.hidPostKey == "addAp"){
    
  }
  res.send('user id: ' + req.session.user_id + ' /ap_name: ' +req.body.txtInputApName+ ' /ap_sn' +req.body.txtInputApSN );
    console.log(req.session.user_id, req.body.txtInputApName, req.body.txtInputApSN);
    var user = {
      user_id:req.session.user_id,
      ap_name:req.body.txtInputApName,
      ap_sn:req.body.txtInputApSN
    };

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





var server = app.listen(7777, function(){
  console.log("Group_2 Express server has started on port 7777....qq");
});
