

$(document).ready(function(){

   var buttonInterval = setInterval(function(){ callStatus();}, 3000);
  // var mainInterval = setInterval(function(){ mainReflash();}, 5000);

  $('button[name="btn_on"]').on('click',function(){
    var $btn = $(this).button('loading');

    var signal='1';
    if($(this).html().split('</span>')[1].indexOf('On')>0){
      signal = '0';
    }

    var EqSN =  $(this).prop('id').split('^')[1];
    var nowdate = new Date();
    var yyymmdd = ""+nowdate.getFullYear()+(nowdate.getMonth()+1)+ lpad(nowdate.getDate().toString(),2,'0');
    var hhmmss = "" + lpad(nowdate.getHours().toString(),2,'0') + lpad(nowdate.getMinutes().toString(),2,'0') + lpad(nowdate.getSeconds().toString(),2,'0');

     $.ajax({
       url:'/sapi/executeDeviceOnOff',
       type:'GET',
        data:{eq_no:EqSN,c_yyyymmdd:yyymmdd,c_hhmiss:hhmmss,c_signal:signal},
        success:function(data){
          if(data.affectedRows>0){
              $btn.button('reset');
          }else{
            alert('통신불량입니다.');
              $btn.button('reset');
          }
        }
      });
    });
}); 

function callStatus(){
  $('button[name="btn_on"]').each(function(index,item){
    var EqSN = item.id.split('^')[1];

    if(EqSN.indexof('AP')<0){
      $.ajax({
        url:'/sapi/getSignalOfControl',
        type:'GET',
         data:{eq_no:EqSN},
         success:function(data){
           if(data.length>0){
            //  console.log(data[0].C_SIGNAL  + "/ " + (data[0].C_SIGNAL==1)+ "/" + data[0].C_SIGNAL);
              if(data[0].C_SIGNAL==1){
                  $(item).prop('class','btn btn-success btn-sm');
                  $(item).html('<span class="glyphicon glyphicon-off" aria-hidden="true"></span>&nbsp;&nbsp;&nbsp;On');
              }else if(data[0].C_SIGNAL==0){
                $(item).prop('class','btn btn-default btn-sm');
                $(item).html('<span class="glyphicon glyphicon-off" aria-hidden="true"></span>&nbsp;&nbsp;&nbsp;Off');
              }
           }
         }
       });
   }
  });
}

function mainReflash(){

}

function lpad(originalstr, length, strToPad) {
    while (originalstr.length < length)
        originalstr = strToPad + originalstr;
    return originalstr;
}
