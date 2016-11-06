

$(document).ready(function(){

   var buttonInterval = setInterval(function(){ callStatus();}, 5000);
   var mainInterval = setInterval(function(){ mainReflash();}, 5000);

  $('button[name="btn_on"]').on('click',function(){
    var $btn = $(this).button('loading');

    var signal='1';
    if($(this).html().split('</span>')[1].indexOf('On')>0){
      signal = '0';
    }

    var EqSN =  $(this).prop('id').split('^')[1];
    var nowdate = new Date();
    var yyyymmdd = ""+nowdate.getFullYear()+lpad((nowdate.getMonth()+1),2,'0')+ lpad(nowdate.getDate().toString(),2,'0');
    var hhmmss = "" + lpad(nowdate.getHours().toString(),2,'0') + lpad(nowdate.getMinutes().toString(),2,'0') + lpad(nowdate.getSeconds().toString(),2,'0');

     $.ajax({
       url:'/sapi/executeDeviceOnOff',
       type:'GET',
        data:{eq_no:EqSN,c_yyyymmdd:yyyymmdd,c_hhmiss:hhmmss,c_signal:signal},
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

    if(EqSN.indexOf('AP')<0){
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
  $('div[name="myCard"]').each(function(index,item){
    var EqSN = item.id.split('^')[1];
    var nowdate = new Date();
    var yyyymm = ""+nowdate.getFullYear()+lpad((nowdate.getMonth()+1),2,'0');
    var yyyymmdd = ""+nowdate.getFullYear()+lpad((nowdate.getMonth()+1),2,'0')+ lpad(nowdate.getDate().toString(),2,'0');
    var lastmonth = ""+nowdate.getFullYear()+lpad((nowdate.getMonth()),2,'0');
    var user_id = '';


    if(EqSN.indexOf('AP')<0){
      // //일일 사용량
      // $(item).find('[id="dailyUsed"]').html()
      // //당월 사용량
      // $(item).find('[id="thisMonthAmountUsed"]').html()
      // //전월 사용량
      // $(item).find('[id="lastMonthAmountUsed"]').html()
      // console.log(EqSN +": " + $(item).find('[id="dailyUsed"]').html() +"/"+$(item).find('[id="thisMonthAmountUsed"]').html()+"/"+$(item).find('[id="lastMonthAmountUsed"]').html());

      //일일 사용량
      // var eq_no = req.query.eq_no;
      // var yyyymm = req.query.yyyymm+'%';
      $.ajax({
        url:'/sapi/getElectricSumForDay',
        type:'GET',
         data:{eq_no:EqSN,yyyymmdd:yyyymmdd},
         success:function(data){
           if(data.length>0){
              $(item).find('[id="dailyUsed"]').html(data[0].SUM_VALUE.toFixed(2));
           }else{
              $(item).find('[id="dailyUsed"]').html('Checking..');
           }
         }
       });

       //당월 사용량
       $.ajax({
         url:'/sapi/getElectricSumForMonth',
         type:'GET',
          data:{eq_no:EqSN,yyyymm:yyyymm},
          success:function(data){
            if(data.length>0){
               $(item).find('[id="thisMonthAmountUsed"]').html(data[0].SUM_VALUE.toFixed(2));
            }else{
               $(item).find('[id="thisMonthAmountUsed"]').html('Checking..');
            }
          }
        });

        //전월 사용량
        $.ajax({
          url:'/sapi/getElectricSumForMonth',
          type:'GET',
           data:{eq_no:EqSN,yyyymm:lastmonth},
           success:function(data){
             if(data.length>0){
                $(item).find('[id="lastMonthAmountUsed"]').html(data[0].SUM_VALUE.toFixed(2));
             }else{
                $(item).find('[id="lastMonthAmountUsed"]').html('Checking..');
             }
           }
         });

         //유저별 당월 사용량
         $.ajax({
           url:'/sapi/getElectricSumOnUser',
           type:'GET',
            data:{user_id:user_id,yyyymm:yyyymm},
            success:function(data){
              if(data.length>0){
                 $('#thisMonth_progress').html(data[0].SUM_VALUE.toFixed(2));
              }else{
                 $('#thisMonth_progress').html('Checking..');
              }
            }
          });

         //유저별 전월 사용량
         $.ajax({
           url:'/sapi/getElectricSumOnUser',
           type:'GET',
            data:{user_id:user_id,yyyymm:lastmonth},
            success:function(data){
              if(data.length>0){
                 $('#lastMonth_progress').html(data[0].SUM_VALUE.toFixed(2));
              }else{
                 $('#lastMonth_progress').html('Checking..');
              }
            }
          });


    }
  });
}

function lpad(originalstr, length, strToPad) {
    while (originalstr.length < length)
        originalstr = strToPad + originalstr;
    return originalstr;
}
