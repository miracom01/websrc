

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
        url:'/sapi/getSignalOfControl2',
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
                 $('#estimatedAmount').html("<strong> 약 " + number_format(calcDstimatedAmount(data[0].SUM_VALUE.toFixed(2)).toFixed(0)) + " 원 </strong>");
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

function number_format( number )
{
  var nArr = String(number).split('').join(',').split('');
  for( var i=nArr.length-1, j=1; i>=0; i--, j++)  if( j%6 != 0 && j%2 == 0) nArr[i] = '';
  return nArr.join('');
}

function calcDstimatedAmount(sum){
    var basicPay=0;
    var electricPay=0;
    var plus=0;
    if(sum>=1 && sum<=100){
        basicPay=410;
        electricPay = sum * 60.7;
    }else if(sum>=101 && sum<=200){
        basicPay=910;
        var count=0;
        while(sum>=100){
            count++;
            sum = sum-100;
            if(count==1){
                plus=60.7;
            }else if(count==2){
                plus=125.9;
            }else if(count==3){
                plus=187.9;
            }else if(count==4){
                plus=280.6;
            }else if(count==5){
                plus=417.7;
            }else if(count>=6){
                plus=709.5;
            }
            electricPay += 100 *plus;
        }
        electricPay += sum*plus;

    }else if(sum>=201 && sum<=300){
        basicPay=1600;
        var count=0;
        while(sum>=100){
            count++;
            sum = sum-100;
            if(count==1){
                plus=60.7;
            }else if(count==2){
                plus=125.9;
            }else if(count==3){
                plus=187.9;
            }else if(count==4){
                plus=280.6;
            }else if(count==5){
                plus=417.7;
            }else if(count>=6){
                plus=709.5;
            }
            electricPay += 100 *plus;
        }
        electricPay += sum*plus;
    }else if(sum>=301 && sum<=400){
        basicPay=3850;
        var count=0;
        while(sum>=100){
            count++;
            sum = sum-100;
            if(count==1){
                plus=60.7;
            }else if(count==2){
                plus=125.9;
            }else if(count==3){
                plus=187.9;
            }else if(count==4){
                plus=280.6;
            }else if(count==5){
                plus=417.7;
            }else if(count>=6){
                plus=709.5;
            }
            electricPay += 100 *plus;
        }
        electricPay += sum*plus;
    }else if(sum>=401 && sum<=500){
        basicPay=7300;
        var count=0;
        while(sum>=100){
            count++;
            sum = sum-100;
            if(count==1){
                plus=60.7;
            }else if(count==2){
                plus=125.9;
            }else if(count==3){
                plus=187.9;
            }else if(count==4){
                plus=280.6;
            }else if(count==5){
                plus=417.7;
            }else if(count>=6){
                plus=709.5;
            }
            electricPay += 100 *plus;
        }
        electricPay += sum*plus;
    }else if(sum>=501){
        basicPay=12940;
        var count=0;
        while(sum>=100){
            count++;
            sum = sum-100;
            if(count==1){
                plus=60.7;
            }else if(count==2){
                plus=125.9;
            }else if(count==3){
                plus=187.9;
            }else if(count==4){
                plus=280.6;
            }else if(count==5){
                plus=417.7;
            }else if(count>=6){
                plus=709.5;
            }
            electricPay += 100 *plus;
        }
        electricPay += sum*plus;
    }
    return basicPay + electricPay;
}
