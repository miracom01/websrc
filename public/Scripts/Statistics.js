$(document).ready(function(){



  Morris.Area({
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


  Morris.Line({
  element: 'area-example',
  data: [
    { elapsed: '1월', a: 100, b: 90 },
    { elapsed: '2월', a: 75,  b: 65 },
    { elapsed: '3월', a: 50,  b: 40 },
    { elapsed: '4월', a: 75,  b: 85 },
    { elapsed: '6월', a: 45,  b: 65 },
    { elapsed: '5월', a: 50,  b: 40 },
    { elapsed: '7월', a: 70, b: 90 },
    { elapsed: '8월', a: 100, b: 110 },
    { elapsed: '9월', a: 75,  b: 65 },
    { elapsed: '10월', a: 50,  b: 40 },
    { elapsed: '11월', a: 75,  b: 65 },
    { elapsed: '12월', a: 70,  b: 100 }
  ],
  xkey: 'elapsed',
  ykeys: ['a', 'b'],
  labels: ['2016', '2015'],
  parseTime: false
});


  Morris.Bar({
    element: 'bar-example',
    data: [
      { y: '2010', a: 3, b: 1 },
      { y: '2011', a: 14,  b: 3 },
      { y: '2012', a: 41,  b: 15 },
      { y: '2013', a: 57,  b: 19 },
      { y: '2014', a: 110,  b: 30 },
      { y: '2015', a: 130,  b: 41 },
      { y: '2016', a: 180, b: 83 }
    ],
    xkey: 'y',
    ykeys: ['a', 'b'],
    labels: ['Ep', 'Ap']
  });

  Morris.Donut({
    element: 'donut-example',
    data: [
      {label: "선풍기", value: 4},
      {label: "형광등", value: 7},
      {label: "온열기", value: 8},
      {label: "전자레인지", value: 12}
    ],
      formatter: function (x) { return x + "ea"}
  });


Morris.Donut({
  element: 'donut-example2',
  data: [
    {label: "female", value: 70},
    {label: "male", value: 30},
  ],
    formatter: function (x) { return x + "%"}
});




});
