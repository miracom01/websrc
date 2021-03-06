
module.exports = function(app) {
  var express = require('express');
  var route = express.Router();
  var conn = require('../config/mysql/db')();

  //1) 전력 측정 데이터 저장(IoT)
  route.get('/saveVoltData', function(req,res) {
    var data = {
      eq_no: req.query.eq_no,
      m_yyyymmdd: req.query.m_yyyymmdd,
      m_hhmiss: req.query.m_hhmiss,
      m_value: req.query.m_value
    };
    var sql = "INSERT INTO TB_EQ_VOLT_MEASURE SET ?";
    conn.query(sql, data, function(err, results){
      if(err){
        console.log(err);
        res.send({'result':false, 'errCode': err.code});
      }else {
        console.log(JSON.stringify(results));
        res.send(results);
      }
    });
  });

  //2) 장비 제어 처리결과 회신(IoT)
  route.get('/sendResultOfControl',function(req,res) {
    //eq_no=201610EP0000000003&c_yyyymmdd=20161031&c_hhmiss=100534&c_signal=1
    var eq_no = req.query.eq_no;
    var c_yyyymmdd = req.query.c_yyyymmdd;
    var c_hhmiss = req.query.c_hhmiss;
    var c_signal = req.query.c_signal;
    var fin_yn = 'Y';

    var sql = 'UPDATE TB_EQ_CTRL_SIGNAL SET FIN_YN = ? WHERE EQ_NO = ? AND C_YYYYMMDD = ? AND C_HHMISS = ? AND C_SIGNAL = ?';
    conn.query(sql, [fin_yn, eq_no, c_yyyymmdd, c_hhmiss, c_signal], function(err, results){
      if(err){
        console.log(err);
        res.send({'result': false, 'errCode': err.code});
      }else {
        console.log(JSON.stringify(results));
        res.send(results);
      }
    });
  });

  //3) EP 장비 제어 신호 확인(IoT)
  route.get('/getSignalOfControl',function(req,res) {
    var eq_no = req.query.eq_no;
    var sql = `
      SELECT EQ_NO, C_YYYYMMDD, C_HHMISS, C_SIGNAL
      FROM TB_EQ_CTRL_SIGNAL WHERE EQ_NO = ? AND FIN_YN = 'N'
      ORDER BY C_YYYYMMDD DESC, C_HHMISS DESC`;

    conn.query(sql, [eq_no], function(err, results){
      if(err){
        console.log(err);
        res.send({'result': false, 'errCode': err.code});
      }else {
        console.log(JSON.stringify(results));
        res.send(results);
      }
    });
  });

  //3-1) EP 장비 제어 신호 확인(IoT)
  route.get('/getSignalOfControl2',function(req,res) {
    var eq_no = req.query.eq_no;
    var sql = `
      SELECT EQ_NO, C_YYYYMMDD, C_HHMISS, C_SIGNAL
      FROM TB_EQ_CTRL_SIGNAL WHERE EQ_NO = ? AND FIN_YN = 'Y'
      ORDER BY C_YYYYMMDD DESC, C_HHMISS DESC`;

    conn.query(sql, [eq_no], function(err, results){
      if(err){
        console.log(err);
        res.send({'result': false, 'errCode': err.code});
      }else {
        console.log(JSON.stringify(results));
        res.send(results);
      }
    });
  });

  //4) EP 장비 제어 신호 생성(Mobile)
  route.get('/executeDeviceOnOff',function(req,res) {
    var signalInfo = {
      eq_no: req.query.eq_no,
      c_yyyymmdd: req.query.c_yyyymmdd,
      c_hhmiss: req.query.c_hhmiss,
      c_signal: req.query.c_signal
    };
    //console.log(signalInfo);
    var sql = 'INSERT INTO TB_EQ_CTRL_SIGNAL SET ?';
    conn.query(sql, signalInfo, function(err, results){
      if(err){
        console.log(err);
        res.send({'result': false, 'errCode': err.code});
      }else{
        console.log(JSON.stringify(results));
        res.send(results);
      }
    });
  });

  //5) EP별 해당월의 전력사용량 합 조회 (Mobile)
  route.get('/getElectricSumForMonth',function(req,res) {
    var eq_no = req.query.eq_no;
    var yyyymm = req.query.yyyymm+'%';
    //console.log(eq_no,yyyymm);
    var sql = `
      SELECT EQ_NO, SUBSTR(M_YYYYMMDD,1,6) YYYYMM, SUM(M_VALUE) AS SUM_VALUE
      FROM TB_EQ_VOLT_MEASURE
      WHERE EQ_NO = ? AND M_YYYYMMDD LIKE ?
      GROUP BY EQ_NO,SUBSTR(M_YYYYMMDD,1,6)`;
    conn.query(sql, [eq_no, yyyymm], function(err, results){
      if(err){
        console.log(err);
        res.send({'result': false, 'errCode': err.errCode});
      }else{
        console.log(JSON.stringify(results));
        res.send(results);
      }
    });
  });

  //6) EP별 해당월의 일별 전력사용량 목록 조회 (Mobile)
  route.get('/getEverydayForMonth',function(req,res) {
    var eq_no = req.query.eq_no;
    var yyyymm = req.query.yyyymm+'%';
    //console.log(eq_no,yyyymm);
    var sql = `
      SELECT EQ_NO, M_YYYYMMDD AS YYYYMMDD, SUM(M_VALUE) AS SUM_VALUE
      FROM TB_EQ_VOLT_MEASURE
      WHERE EQ_NO = ? AND M_YYYYMMDD LIKE ?
      GROUP BY EQ_NO, M_YYYYMMDD`;
    conn.query(sql, [eq_no, yyyymm], function(err, results){
      if(err){
        console.log(err);
        res.send({'result': false, 'errCode': err.errCode});
      }else{
        console.log(JSON.stringify(results));
        res.send(results);
      }
    });
  });

  //7) EP별 해당일의 전력사용량 합 조회 (Web)
  route.get('/getElectricSumForDay',function(req,res) {
    var eq_no = req.query.eq_no;
    var yyyymmdd = req.query.yyyymmdd;
    //console.log(eq_no,yyyymm);
    var sql = `
      SELECT EQ_NO, M_YYYYMMDD , SUM(M_VALUE) AS SUM_VALUE
      FROM TB_EQ_VOLT_MEASURE
      WHERE EQ_NO = ? AND M_YYYYMMDD = ?
      GROUP BY EQ_NO, M_YYYYMMDD `;
    conn.query(sql, [eq_no, yyyymmdd], function(err, results){
      if(err){
        console.log(err);
        res.send({'result': false, 'errCode': err.errCode});
      }else{
        console.log(JSON.stringify(results));
        res.send(results);
      }
    });
  });

  //8) 유저별 해당월의 전력사용량 합 조회 (Web)
  route.get('/getElectricSumOnUser',function(req,res) {
    var user_id = (req.query.user_id!=''?req.query.user_id:req.session.user_id);
    var yyyymm = req.query.yyyymm+'%';
    //console.log(eq_no,yyyymm);
    var sql = `
      SELECT SUBSTR(M_YYYYMMDD,1,6) YYYYMM, SUM(M_VALUE) AS SUM_VALUE
      FROM TB_EQ_VOLT_MEASURE
      WHERE EQ_NO IN (select EQ_NO from TB_EQUIP_MASTER
      where eq_user_id = ? and eq_gbn = 'EP') AND M_YYYYMMDD LIKE ?
      GROUP BY SUBSTR(M_YYYYMMDD,1,6)`;
    conn.query(sql, [user_id, yyyymm], function(err, results){
      if(err){
        console.log(err);
        res.send({'result': false, 'errCode': err.errCode});
      }else{
        console.log(JSON.stringify(results));
        res.send(results);
      }
    });
  });


  return route;
};
