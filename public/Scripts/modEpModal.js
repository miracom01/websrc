$(document).ready(function(){
    // AP/ EP 수정/ 삭제
    $('#btn_modEpModal_submit').on('click',function(){
      var $btn = $(this).button('loading');
      var eq_No = $('#txtModEqNO').val();
       var type = '';
       var EqName = $('#txt_modEpModal_ApEPName').val();
       var EqKind = $('#txtModEPKind').val();
       var ApSN = $('#txt_modEpModal_ApSN').val();
       var EqSN =  $('#txt_modEpModal_EQSN').val();

       $.ajax({
         url:'/modEPAP',
         type:'POST',
          data:{eq_No:eq_No,type:type,EqKind:EqKind,EqName:EqName,EqSN:EqSN,ApSN:ApSN},
          success:function(data){
            alert(data);
            $btn.button('reset');
            init_modEpModal();
            location.reload();
          }
        });
      });

      $('#btn_delEpModal_submit').on('click',function(){
        var $btn = $(this).button('loading');
         var eq_No = $('#txtModEqNO').val();
         $.ajax({
           url:'/delEPAP',
           type:'POST',
            data:{"EQ_NO":eq_No},
            success:function(data){
              alert(data);
              $btn.button('reset');
              init_modEpModal();
              location.reload();
            }
          });
        });

        //AP EP Type 선택
        $('#btn_modEpModal_AP').on('click',function(){
          $('#btn_modEpModal_AP').prop('class','btn btn-primary');
          $('#btn_modEpModal_EP').prop('class','btn btn-default');
          $('#divModAPSn').hide();
          $('#divModEPKind').hide();
          $('#txt_modEpModal_ApSN').val('');
          $('#ddlModEPKind').html('선택 <span class="caret"></span>');
          });
        $('#btn_modEpModal_EP').on('click',function(){
            $('#btn_modEpModal_EP').prop('class','btn btn-primary');
            $('#btn_modEpModal_AP').prop('class','btn btn-default');
            $('#divModAPSn').show();
            $('#divModEPKind').show();
          });

});

function setModEpModal(sn){
  //setting
  $.ajax({
    url:'/getSelectedApEpInfo',
    type:'POST',
     data:{"EqSN":sn},
     success:function(data){
       set_modEpModal(data);
     }
   });
}


function set_modEpModal(data){
  var pdata = data.EqInfo[0];

  changeModEPKind(pdata.TGT_APPLIANCE_NM,pdata.TGT_APPLIANCE);
  $('#txt_modEpModal_EQSN').val(pdata.SERIAL_NO);
  $('#txt_modEpModal_ApSN').val(pdata.AP_SN);
  $('#txtModEqNO').val(pdata.EQ_NO);
  if(pdata.EQ_GBN=='AP'){
    $('#btn_modEpModal_AP').click();
  }else{
    $('#btn_modEpModal_EP').click();
  }

  $('#btn_modEpModal_AP').prop('disabled','true');
  $('#btn_modEpModal_EP').prop('disabled','true');
}

function changeModEPKind(name,code){
  $('#txtModEPKind').val(code);
  $('#ddlModEPKind').html(name +' <span class="caret"></span>');
}

function selectedModMyApSN(sn){
  $('#txt_modEpModal_ApSN').val(sn);
}

function init_modEpModal(){
  $('#btn_modEpModal_AP').prop('disabled','false');
  $('#btn_modEpModal_EP').prop('disabled','false');
}
