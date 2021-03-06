$(document).ready(function(){
  //초기 세팅
$('#divAPSn').hide();
$('#divEPKind').hide();

//AP EP Type 선택
  $('#btn_addEpModal_AP').on('click',function(){
    $('#txtInputAPEPType').val('AP');
    $('#btn_addEpModal_AP').prop('class','btn btn-primary');
    $('#btn_addEpModal_EP').prop('class','btn btn-default');
    $('#divAPSn').hide();
    $('#divEPKind').hide();
    $('#txt_addEpModal_ApSN').val('');
    $('#ddlEPKind').html('선택 <span class="caret"></span>');
    });
  $('#btn_addEpModal_EP').on('click',function(){
      $('#txtInputAPEPType').val('EP');
      $('#btn_addEpModal_EP').prop('class','btn btn-primary');
      $('#btn_addEpModal_AP').prop('class','btn btn-default');
      $('#divAPSn').show();
      $('#divEPKind').show();
    });


    // AP/ EP 입력
    $('#btn_addEpModal_submit').on('click',function(){
      var $btn = $(this).button('loading');

       var type = $('#txtInputAPEPType').val();
       var EqName = $('#txt_addEpModal_ApEPName').val();
       var EqKind = $('#txtEPKind').val();
       var ApSN = $('#txt_addEpModal_ApSN').val();
       var EqSN =  $('#txt_addEpModal_EQSN').val();

       $.ajax({
         url:'/addEPAP',
         type:'POST',
          data:{type:type,EqKind:EqKind,EqName:EqName,EqSN:EqSN,ApSN:ApSN},
          success:function(data){
            alert(data);
            init_addEpModal();
            $btn.button('reset');
            $('#btn_addEpModal_Close').click();  // modal 닫기
            location.reload();
          }
        });
      });
});

function init_addEpModal(){
  $('#txtInputAPEPType').val('');
  $('#btn_addEpModal_AP').prop('class','btn btn-default');
  $('#btn_addEpModal_EP').prop('class','btn btn-default');
  $('#divAPSn').hide();

  $('#txtInputAPEPType').val('');
  $('#txt_addEpModal_ApEPName').val('');
  $('#txt_addEpModal_ApSN').val('');

  $('#ddlEPKind').html('선택 <span class="caret"></span>');
}


function changeEPKind(name,code){
  $('#txtEPKind').val(code);
  $('#ddlEPKind').html(name +' <span class="caret"></span>');
}

function selectedMyApSN(sn){
  $('#txt_addEpModal_ApSN').val(sn);
}
