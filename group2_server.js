
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
  var deviceInfo = null;
  var myAPSNInfo = null;
  var applianceInfo = null;
  var sql = " SELECT CODE, CODE_NAME, DESCRIPTION, RESERVED1, RESERVED2 FROM TB_COMMCODE "
  sql += " WHERE P_CODE='HOMEAPP' "
  sql += " ORDER BY DP_ORDER ASC ";
  conn.query(sql, userid , function(err, results){
    if(err){
      console.log("[getApplianceInfo(fail)] " + userid );
      console.log(err);
      res.status(500).send();
    } else {
      applianceInfo =  results;
    }
  });

  sql = " SELECT SERIAL_NO FROM TB_EQUIP_MASTER WHERE EQ_USER_ID = ? AND EQ_GBN = 'AP' ";
  conn.query(sql, userid , function(err, results){
    if(err){
      console.log("[getUSERAPInfo(fail)] " + userid );
      console.log(err);
      res.status(500).send();
    } else {
      myAPSNInfo =  results;
    }
  });

  sql = " SELECT MAST.EQ_NO, SERIAL_NO, EQ_GBN, AP_NO, IFNULL(CODE_NAME,'AP') TGT_APPLIANCE_NAME_ENG, IFNULL(DESCRIPTION,'AP') TGT_APPLIANCE_NAME_KOR, IFNULL(RESERVED1,'antenna.png') ICON_NM, C_YYYYMMDD, C_HHMISS, C_SIGNAL ";
  sql +=  " FROM ";
  sql +=  " TB_EQUIP_MASTER MAST ";
  sql +=  " LEFT OUTER JOIN ";
  sql +=  "   (SELECT * FROM TB_EQ_CTRL_SIGNAL ";
  sql +=  "     WHERE (EQ_NO, C_YYYYMMDD, C_HHMISS) IN ";
  sql +=  "           (SELECT EQ_NO , SUBSTR(LAST_T,1,8) C_YYYYMMDD, SUBSTR(LAST_T,9) C_HHMISS FROM ";
  sql +=  "             (SELECT EQ_NO, MAX(concat(C_YYYYMMDD,C_HHMISS)) LAST_T FROM TB_EQ_CTRL_SIGNAL WHERE FIN_YN = 'Y' "
  sql +=  "    GROUP BY EQ_NO) SIG)) SIG ";
  sql +=  " ON MAST.EQ_NO = SIG.EQ_NO ";
  sql +=  " LEFT OUTER JOIN ";
  sql +=  " (SELECT * FROM TB_COMMCODE WHERE P_CODE='HOMEAPP' ) APP ";
  sql +=  " ON  MAST.TGT_APPLIANCE = APP.CODE ";
  sql +=  " WHERE ";
  sql +=  " EQ_USER_ID = ?  ";  // 1? user_id

  conn.query(sql, userid , function(err, results){
    if(err){
      console.log("[getEQList(fail)] " + userid );
      console.log(err);
      res.status(500).send();
    } else {
      deviceInfo =  JSON.stringify(results);
      //console.log("[getEQList(Success)] " +req.session.user_id + "/ " + deviceInfo );
      res.render("main", {
           "userId": req.session.user_id,
           "displayUserName" : req.session.user_name,
           "deviceInfo": results,
           "applianceInfo":applianceInfo,
           "myAPSNInfo": myAPSNInfo
       });
    }
  });
/*
    res.render("main", {
         "userId": req.session.user_id,
         "displayUserName" : req.session.user_name,
         "deviceInfo": deviceInfo
     });
     */
});


app.post('/addEPAP', function(req, res){
  var type = req.param('type');
  var EqName = req.param('EqName');
  var EqKind = req.param('EqKind');
  var EqSN = req.param('EqSN');
  var ApSN = req.param('ApSN');
  var userid = req.session.user_id;

  console.log("[AddEquip(try)] " + userid + ": " + type + "/" + EqName + "/" + EqSN + "/" + ApSN  );

  //1?TYPE
  //2?EqSN
  //3?type
  //4?userid
  //5?ApSN
  //6?EqKind
  var sql = "INSERT INTO TB_EQUIP_MASTER(EQ_NO,SERIAL_NO, EQ_GBN, EQ_USER_ID, AP_NO, TGT_APPLIANCE, CREATE_DTTM ) ";
  sql += " SELECT ";
  sql += " (SELECT CONCAT(DATE_FORMAT(NOW(),'%Y%m'),?,LPAD(MAX(SUBSTR(EQ_NO,9))+1,10,0)) NEXT_VAL FROM TB_EQUIP_MASTER WHERE SUBSTR(EQ_NO,1,6)= DATE_FORMAT(NOW(),'%Y%m')), ";
  sql += " ? , ? , ? , " ;
  sql += " (SELECT EQ_NO FROM TB_EQUIP_MASTER WHERE EQ_GBN='AP' AND SERIAL_NO=? ) , ";
  sql += " ? , now() ";
  sql += " from dual ";
  conn.query(sql, [type,EqSN,type,userid,ApSN,EqKind], function(err, results){
    if(err){
      console.log("[AddEquip(fail)] " + userid + ": " + type + "/" + EqKind + "/" + EqSN + "/" + ApSN  );
      console.log(err);
      res.status(500).send();
    } else {
      console.log("[AddEquip(Success)] " + userid + ": " + type + "/" + EqKind + "/" + EqSN + "/" + ApSN  );
      res.send('입력 성공!!');
    }
  });
});

var server = app.listen(7777, function(){
  console.log("Group_2 Express server has started on port 7777.");
});
