$(document).ready(function(){
  //초기 세팅
$('#divAPSn').hide();

//AP EP Type 선택
  $('#btn_addEpModal_AP').on('click',function(){
    $('#txtInputAPEPType').val('AP');
    $('#btn_addEpModal_AP').prop('class','btn btn-primary');
    $('#btn_addEpModal_EP').prop('class','btn btn-default');
    $('#divAPSn').hide();
    $('#txt_addEpModal_ApSN').val('');
    });
  $('#btn_addEpModal_EP').on('click',function(){
      $('#txtInputAPEPType').val('EP');
      $('#btn_addEpModal_EP').prop('class','btn btn-primary');
      $('#btn_addEpModal_AP').prop('class','btn btn-default');
      $('#divAPSn').show();
    });


    // AP/ EP 입력
    $('#btn_addEpModal_submit').on('click',function(){
      var $btn = $(this).button('loading');

       var type = $('#txtInputAPEPType').val();
       var EqName = $('#txt_addEpModal_ApEPName').val();
       var ApSN = $('#txt_addEpModal_ApSN').val();
       var EqSN =  $('#txt_addEpModal_EQSN').val();


       $.ajax({
         url:'/addEPAP',
         type:'POST',
          data:{type:type,EqName:EqName,EqSN:EqSN,ApSN:ApSN},
          success:function(data){
            alert(data);
            init_addEpMoal();
            $btn.button('reset');
            $('#btn_addEpMoal_Close').click();  // modal 닫기
          }
        });
      });


/*


// 삭제
$('#btn_remove').on('click',function(){
  var ck = new Array();
   $('.ck:checked').each(function(index,item){
     ck.push($(item).val());
   });

   $.ajax({
     url:'/remove',
     type:'GET',
     data:{ck:ck},
     success:function(data){
       alert(data+'삭제');
       $('#btn_list').trigger('click');
      }
    });
  });


// 수정
$('#btn_add').on('click',function(){
  var id = $('#id').val();
  var pw = $('#pw').val();
  var name = $('#name').val();
  var age = $('#age').val();
  var gender = $('#gender').val();

   $.ajax({
      url:'/add',
      type:'POST',
      data:{id:id,pw:pw,name:name,age:age,gender:gender},
      success:function(data){
        alert(data+'님 추가');
        $('#btn_list').trigger('click');
      }
     });
   });



// 목록
$('#btn_list').on('click',function(){
  $.ajax({
    url:'/list',
    type:'GET',
    success:function(data){
      $('#list').empty();
      $(data).each(function(index,item){
        $('#list').append('<tr>');
        $('#list').append('<td><input type="checkbox" class="ck" value="'+item.id+'"></td>');
        $('#list').append('<td>'+item.id+'</td>');
         $('#list').append('<td>'+item.pw+'</td>');
         $('#list').append('<td>'+item.name+'</td>');
         $('#list').append('<td>'+item.age+'</td>');
         $('#list').append('<td>'+item.gender+'</td>');
         $('#list').append('</tr>');
       });
     }
   });
  });
  */
});

function init_addEpMoal(){
  $('#txtInputAPEPType').val('');
  $('#btn_addEpModal_AP').prop('class','btn btn-default');
  $('#btn_addEpModal_EP').prop('class','btn btn-default');
  $('#divAPSn').hide();

  $('#txtInputAPEPType').val('');
  $('#txt_addEpModal_ApEPName').val('');
  $('#txt_addEpModal_ApSN').val('');
}
