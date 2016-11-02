
module.exports = function(app) {
  var express = require('express');
  var route = express.Router();
  var conn = require('../config/mysql/db')();

  //1) 전력 측정 데이터 저장
  route.get('/saveVoltData', function(req,res) {
    var eq_no = req.query.eq_no;
    var m_yyyymmdd = req.query.m_yyyymmdd;
    var m_hhmiss = req.query.m_hhmiss;
    var m_value = req.query.m_value;

    var sql = `
    INSERT INTO TB_EQ_VOLT_MEASURE
    (EQ_NO, M_YYYYMMDD, M_HHMISS, M_VALUE)
    VALUES
    (?, ?, ?, ?)`;

    var errObj = {
      errCode: "",
      errNo: ""
    };
    conn.query(sql, [eq_no, m_yyyymmdd, m_hhmiss, m_value], function(err, results){
      if(err){
        console.log(err);
        errObj.errCode = err.code;
        errObj.errNo = err.errno;
        res.send({result:false, err:errObj});
      }
      res.send({'result':true});
    });
  });
  //2) 장비 제어 처리결과 회신
  route.get('/sendResultOfControl',function(req,res) {

  });
  //3) EP 장비 제어 신호 확인
  route.get('/getSignalOfControl',function(req,res) {
    res.send('checkEpStatus in ep_id :'+req.params.ep_id+', aa : '+req.query.aa);
  });

  return route;
};
