
module.exports = function(app) {
  var express = require('express');
  var route = express.Router();

  route.post('/newMember',function(req,res) {
    var sql = "INSERT INTO TB_USER_MASTER "
        + "(USER_ID, USER_NAME, REGION1, REGION2, USER_ADDRESS, POSTAL_CODE, TEL_NO, USER_SEX, USER_YEARS, HOME_MEM_GBN, CREATE_DTTM, UPDATE_DTTM)"
        + "VALUES"
        + "('qq', '', 'GG', 'GG001', '강원도 춘천', '111222', '', 'M', '10', '01', sysdate(), '')";

  });

  route.get('/newMember',function(req,res) {
    res.render('new_member_create', {
        title: "MY HOMEPAGE",
        length: 5
    });

    var sql = "INSERT INTO TB_USER_MASTER "
        + "(USER_ID, USER_NAME, REGION1, REGION2, USER_ADDRESS, POSTAL_CODE, TEL_NO, USER_SEX, USER_YEARS, HOME_MEM_GBN, CREATE_DTTM, UPDATE_DTTM)"
        + "VALUES"
        + "('qq', '', 'GG', 'GG001', '강원도 춘천', '111222', '', 'M', '10', '01', sysdate(), '')";

    console.log(sql);
  });

  return route;
};
