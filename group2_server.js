
var app = require('./config/mysql/express')();
//var passport = require('./config/mysql/passport')(app);
var path = require('path');
var fs = require("fs");
var morgan = require('morgan');
var conn = require('./config/mysql/db')();

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

  if(!isLogin && (url.indexOf('/auth/login') > -1 || url.indexOf('/members/register') > -1 || url.indexOf('/sapi/') > -1)) {
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
    var userid = req.session.user_id;

    var deviceInfo = [{ap_name:"test1_1",ap_sn:"test1_2"},
                      {ap_name:"test2_1",ap_sn:"test2_2"},
                      {ap_name:"test3_1",ap_sn:"test3_2"},
                      {ap_name:"test4_1",ap_sn:"test4_2"},
                      {ap_name:"test5_1",ap_sn:"test5_2"},
                      {ap_name:"test6_1",ap_sn:"test6_2"},
                      {ap_name:"test7_1",ap_sn:"test7_2"}];

    res.render('main', {
         userId: req.session.user_id,
         displayUserName : req.session.user_name,
         deviceInfo: deviceInfo
     });
});



// commit 방식에서 ajax 방식으로 변경
app.post('/addEPAP', function(req, res){
  var type = req.param('type');
  var EqName = req.param('EqName');
  var EqSN = req.param('EqSN');
  var ApSN = req.param('ApSN');
  var userid = req.session.user_id;

  console.log("[AddEquip(try)] " + userid + ": " + type + "/" + EqName + "/" + EqSN + "/" + ApSN  );

  //1?TYPE
  //2?EqSN
  //3?type
  //4?userid
  //5?ApSN
  //6?EqName
  var sql = "INSERT INTO TB_EQUIP_MASTER(EQ_NO,SERIAL_NO, EQ_GBN, EQ_USER_ID, AP_NO, TGT_APPLIANCE, CREATE_DTTM ) ";
  sql += " SELECT ";
  sql += " (SELECT CONCAT(DATE_FORMAT(NOW(),'%Y%m'),?,LPAD(MAX(SUBSTR(EQ_NO,9))+1,10,0)) NEXT_VAL FROM TB_EQUIP_MASTER WHERE SUBSTR(EQ_NO,1,6)= DATE_FORMAT(NOW(),'%Y%m')), ";
  sql += " ? , ? , ? , " ;
  sql += " (SELECT EQ_NO FROM TB_EQUIP_MASTER WHERE EQ_GBN='AP' AND SERIAL_NO=? ) , ";
  sql += " ? , now() ";
  sql += " from dual ";
  conn.query(sql, [type,EqSN,type,userid,ApSN,EqName], function(err, results){
    if(err){
      console.log("[AddEquip(fail)] " + userid + ": " + type + "/" + EqName + "/" + EqSN + "/" + ApSN  );
      console.log(err);
      res.status(500).send();
    } else {
      console.log("[AddEquip(Success)] " + userid + ": " + type + "/" + EqName + "/" + EqSN + "/" + ApSN  );
      res.send('입력 성공!!');
    }
  });


});




var server = app.listen(7777, function(){
  console.log("Group_2 Express server has started on port 7777.");
});
