$(document).ready(function(){

  getList(1);

  $('#btnSearch').on('click',function(){
      getList(1);
    });

  $('#txtSearchString').on('keydown',function(e){
          if(e.which === 13){
            getList(1);
          }

    });

});

function getList(pageNum){
  var searchKind = "name";
  var searchString = $('#txtSearchString').val();
  var pageSize = 5;

  $.ajax({
    url:'/personList',
    type:'POST',
     data:{pageNum:pageNum, pageSize:pageSize, searchKind:searchKind, searchString:searchString},
     success:function(data){
       drawPersonTable(data,pageSize);
     }
   });
 }


function getDeviceList(userid, pageNum){
  var pageSize = 5;

  $.ajax({
    url:'/getDevList',
    type:'POST',
     data:{"pageNum":pageNum, "pageSize":pageSize,"user_id":userid},
     success:function(data){
       drawDevTable(data,pageSize);
     }
   });
}

function drawPersonTable(data,pageSize){
 var tableList = data.personList;
  $("#TbMemberList > tbody tr").remove("tr");
 for(var i=0; i<tableList.length; i++){
   $('#TbMemberList > tbody').append( "<tr><td><a href='#' onclick='getDeviceList(\""+tableList[i].USER_ID+"\",1)'>"+tableList[i].USER_ID+"</a></td><td>"+tableList[i].USER_NAME+"</td></tr>" );
 }
 var total_cnt = parseInt(data.total_cnt[0].CNT/pageSize) + (data.total_cnt[0].CNT % pageSize>0?1:0);
 $("#memListPagenation li").remove();
 for(var t=1; t<=total_cnt; t++){
    $('#memListPagenation').append("<li><a href='#' onclick='getList("+t+")'>"+t+"</a></li>");
 }
 //$('#TbMemberList').html();
}

function drawDevTable(data,pageSize){
 var tableList = data.deviceInfo;

  $("#TbDeviceList > tbody tr").remove("");
 for(var i=0; i<tableList.length; i++){
   $('#TbDeviceList  > tbody').append( "<tr><td>"+tableList[i].SERIAL_NO+"</td><td>"+tableList[i].EQ_GBN+"</td><td>"+tableList[i].AP_SN+"</td><td>"+tableList[i].TGT_APPLIANCE_NAME_KOR+"</td></tr>" );
 }
 var total_cnt = parseInt(data.total_cnt[0].CNT/pageSize) + (data.total_cnt[0].CNT % pageSize>0?1:0);
 $("#DevListPagenation li").remove();
 for(var t=1; t<=total_cnt; t++){
    $('#DevListPagenation').append("<li><a href='#' onclick='getDeviceList(\""+tableList[i].EQ_USER_ID+"\","+t+")'>"+t+"</a></li>");
 }
 //$('#TbMemberList').html();
}
