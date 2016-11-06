
module.exports = function(app) {
  var express = require('express');
  var route = express.Router();
  var conn = require('../config/mysql/db')();


  route.get('/ApEpManagement',function(req,res){
    res.render('ApEpManagement', {
            nPos: 2,
            userId: req.session.user_id,
            displayUserName : req.session.user_name});
  });

  route.get('/ApEpStatistics',function(req,res){
    res.render('Statistics/Statistics', {
            nPos: 3,
            userId: req.session.user_id,
            displayUserName : req.session.user_name});
  });


  app.post('/personList', function(req, res){
    //{pageNum:pageNum, pageSize:pageSize, searchKind:searchKind, searchString:searchString}

    var userid = req.session.user_id;
    var pageNum = req.param('pageNum');
    var pageSize = req.param('pageSize');
    var searchKind = req.param('searchKind');
    var searchString = req.param('searchString');

    var total_cnt = 0;
    var fr = (pageNum-1) * pageSize;
    //var ft = fr + pageSize -1;

    var sql = " SELECT COUNT(*) CNT FROM TB_USER_MASTER WHERE 1=1 ";
    if(searchKind=="name" && searchString!=""){
      sql += " AND lower(USER_NAME) like CONCAT('%',lower(?),'%') ";
    }else if(searchKind=="id" && searchString!=""){
      sql += " AND lower(USER_ID) like CONCAT('%',lower(?),'%') "
    }

    conn.query(sql, [searchString], function(err, results){
      if(err){
        console.log("[personCnt(fail)] " + userid + ": " + searchString );
        console.log(err);
        res.status(500).send();
      } else {
        console.log("[personCnt(Success)] " + userid + ": " + results );
        total_cnt = results;
      }
    });



    sql = " SELECT USER_ID, USER_NAME FROM TB_USER_MASTER WHERE 1=1 ";
    if(searchKind=="name" && searchString!=""){
      sql += " AND lower(USER_NAME)  like CONCAT('%',lower(?),'%')  ";
    }else if(searchKind=="id" && searchString!=""){
      sql += " AND lower(USER_ID)  like CONCAT('%',lower(?),'%') "
    }
    sql += " ORDER BY USER_NAME ASC " ;
    sql += " LIMIT "+fr+", "+pageSize+" ";

    conn.query(sql, [searchString], function(err, results){
      if(err){
        console.log("[personList(fail)] " + userid + ": " + searchString );
        console.log(err);
        res.status(500).send();
      } else {
        console.log("[personList(Success)] " + userid + ": " + JSON.stringify(results) );
        res.send({
             "total_cnt": total_cnt,
             "personList" : results});
      }
    });
  });


  app.post('/getDevList',function(req,res){
    var searchId =  req.param('user_id');;
    var pageNum = req.param('pageNum');
    var pageSize = req.param('pageSize');

    var total_cnt = 0;
    var fr = (pageNum-1) * pageSize;

    var deviceInfo = null;

    var sql = " SELECT COUNT(*) CNT FROM TB_EQUIP_MASTER ";
    sql +=  " WHERE ";
    sql +=  " EQ_USER_ID = ?  ";  // 1? user_id

    conn.query(sql, searchId, function(err, results){
      if(err){
        console.log("[personCnt(fail)] " +  req.session.user_id + ": " + searchId );
        console.log(err);
        res.status(500).send();
      } else {
        console.log("[personCnt(Success)] " +  req.session.user_id + ": " + JSON.stringify(results) );
        total_cnt = results;
      }
    });

    sql = " SELECT EQ_USER_ID, MAST.EQ_NO, SERIAL_NO, EQ_GBN, AP_NO , (SELECT SERIAL_NO FROM TB_EQUIP_MASTER T1 WHERE T1.EQ_NO = MAST.AP_NO) AP_SN, ";
    sql +=  " IFNULL(CODE_NAME,'AP') TGT_APPLIANCE_NAME_ENG, IFNULL(DESCRIPTION,'AP') TGT_APPLIANCE_NAME_KOR, IFNULL(RESERVED1,'antenna.png') ICON_NM, C_YYYYMMDD, C_HHMISS, C_SIGNAL ";
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
    sql += " ORDER BY SERIAL_NO DESC " ;
    sql += " LIMIT "+fr+", "+pageSize+" ";

    conn.query(sql, searchId , function(err, results){
      if(err){
        console.log("[getDevList(fail)] " + req.session.user_id );
        console.log(err);
        res.status(500).send();
      } else {
        console.log("[getDevList(Success)] " + req.session.user_id + ": " + JSON.stringify(results) );
        res.send({
             "userId": req.session.user_id,
             "displayUserName" : req.session.user_name,
             "searchId" : searchId,
             "deviceInfo": results,
             "total_cnt" : total_cnt
         });
      }
    });
  });

  return route;
};
