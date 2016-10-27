module.exports = function(){

  //   MySQL 로드
  // var mysql = require('mysql');
  // var pool = mysql.createPool({
  //     connectionLimit: 5,
  //     host     : 'ec2-52-78-49-178.ap-northeast-2.compute.amazonaws.com',
  //     user     : 'root',
  //     password : 'miracom500',
  //     database : 'group2'
  // });
  //return pool.getConnection();
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host     : 'ec2-52-78-49-178.ap-northeast-2.compute.amazonaws.com',
    user     : 'root',
    password : 'miracom500',
    database : 'group2'
  });
  conn.connect();
  return conn;

};
