$(document).ready(function(){



  Morris.Line({
    // ID of the element in which to draw the chart.
    element: 'myfirstchart',
    // Chart data records -- each entry in this array corresponds to a point on
    // the chart.
    data: [
      { year: '2013', value: 20 },
      { year: '2014', value: 10 },
      { year: '2015', value: 20 },
      { year: '2016', value: 10 }
    ],
    // The name of the data record attribute that contains x-values.
    xkey: 'year',
    // A list of names of data record attributes that contain y-values.
    ykeys: ['value'],
    // Labels for the ykeys -- will be displayed when you hover over the
    // chart.
    labels: ['Value']
  });


  Morris.Area({
  element: 'area-example',
  data: [
    { month: '1월', a: 100, b: 90 },
    { month: '2월', a: 75,  b: 65 },
    { month: '3월', a: 50,  b: 40 },
    { month: '4월', a: 75,  b: 65 },
    { month: '6월', a: 75,  b: 65 },
    { month: '5월', a: 50,  b: 40 },
    { month: '7월', a: 100, b: 90 },
    { month: '8월', a: 100, b: 90 },
    { month: '9월', a: 75,  b: 65 },
    { month: '10월', a: 50,  b: 40 },
    { month: '11월', a: 75,  b: 65 },
    { month: '12월', a: 50,  b: 40 }
  ],
  xkey: 'month',
  ykeys: ['a', 'b'],
  labels: ['2016', '2015']
});


  Morris.Bar({
    element: 'bar-example',
    data: [
      { y: '2006', a: 100, b: 90 },
      { y: '2007', a: 75,  b: 65 },
      { y: '2008', a: 50,  b: 40 },
      { y: '2009', a: 75,  b: 65 },
      { y: '2010', a: 50,  b: 40 },
      { y: '2011', a: 75,  b: 65 },
      { y: '2012', a: 100, b: 90 }
    ],
    xkey: 'y',
    ykeys: ['a', 'b'],
    labels: ['Series A', 'Series B']
  });

  Morris.Donut({
    element: 'donut-example',
    data: [
      {label: "선풍기", value: 4},
      {label: "형광등", value: 7},
      {label: "온열기", value: 8},
      {label: "전자레인지", value: 12}
    ]
  });



Morris.Donut({
  element: 'donut-example2',
  data: [
    {label: "female", value: 70},
    {label: "male", value: 30},
  ]
});




});
