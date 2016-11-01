$(document).ready(function(){
//AP EP Type 선택


  $('#btn_addEpModal_AP').on('click',function(){
    $('#txtInputAPEPType').val('AP');
    $('#btn_addEpModal_AP').prop('class','btn btn-primary');
    $('#btn_addEpModal_EP').prop('class','btn btn-default');
    });
  $('#btn_addEpModal_EP').on('click',function(){
      $('#txtInputAPEPType').val('EP');
      $('#btn_addEpModal_EP').prop('class','btn btn-primary');
      $('#btn_addEpModal_AP').prop('class','btn btn-default');
    });


    // AP/ EP 입력
    $('#btn_addEpModal_submit').on('click',function(){
       var type = $('#txtInputAPEPType').val();
       var ApEPName = $('#txt_addEpModal_ApEPName').val();
       var ApSN = $('#txt_addEpModal_ApSN').val();

       $.ajax({
         url:'/addEPAP',
         type:'POST',
          data:{type:type,ApEPName:ApEPName,ApSN:ApSN},
          success:function(data){
            alert(data);
            $('#btn_addEpMoal_Close').click();  // modal 닫기
          }
        });
      });

});
