require('../css/styles.scss')
var d3 = require('d3')
var $ = require('jquery')
var _ = require('underscore')

var annotations = [
    {
        "date": new Date (2016,10,8),
        "what": "Prime Minister Narendra Modi’s announces to ban old notes of Rs 500 and Rs 1,000. Hospitals, pharmacies, railway ticket counters, public business, co-operative milk booths, crematoriums, petrol pumps, and airline ticketing counters at airports are allowed to accept old notes for the next three days."
    },
    {
        "date": new Date (2016,10,9),
        "what": "Banks and government treasuries shut to arrange new currencies"
    },
    {
        "date": new Date (2016,10,10),
        "what": "Old notes can be used to pay educational fees; they can also be used to clear any charges, taxes, and penalties due to government, municipal, and local bodies, and for utilities such as water and electricity."
    },
    {
        "date": new Date (2016,10,13),
        "what": "Currency exchange limit raised from Rs 4000 to Rs 4,500 and ATM withdrawal to Rs 2,500 from Rs 2000"
    },
    {
        "date": new Date (2016,10,15),
        "what": "Instructions to banks to use indelible ink marks on those exchanging money to stop same set of people entering bank again and again."
    },
        {
        "date": new Date (2016,10,17),
        "what": "Currency exchange limit lowered to Rs 2,000 after reports of people getting black money exchanged by hiring workers."
    },
    {
        "date": new Date (2016,10,24),
        "what": "Government changes rules for using banned Rs 500 notes with last date for use at petrol pumps and for buying airline tickets set as December 15. Rs 1,000 old notes can only be deposited into accounts."
    }
]

var data = [
  {
    "type": "exchange",
    "date": new Date (2016,10,8)
  },
  {
    "type": "exchange",
    "date": new Date (2016,10,13)
  },
  {
    "type": "exchange",
    "date": new Date (2016,10,17)
  },
  {
    "type": "exchange",
    "date": new Date (2016,10,24)
  },
  {
    "type": "withdrawal",
    "date": new Date (2016,10,8)
  },
  {
    "type": "withdrawal",
    "date": new Date (2016,10,13)
  },
  {
    "type": "old-notes",
    "date": new Date (2016,10,8)
  },
  {
    "type": "old-notes",
    "date": new Date (2016,10,9)
  },
  {
    "type": "old-notes",
    "date": new Date (2016,10,10)
  },
  {
    "type": "old-notes",
    "date": new Date (2016,10,24)
  }
]
var date_format = d3.timeFormat("%b %d");
var container_width = $('.copy').width()
var container_height = 2000
var margin = {top: 30, bottom: 40, left: 40, right: 30}
var time_scale = d3.scaleTime()
                    .domain(d3.extent(data, function(e){return e.date})) 
                    .range([0,(container_height-margin.top-margin.bottom)])
var time_axis = d3.axisLeft(time_scale)
                    .tickValues(_.chain(data).pluck('date').uniq().value())
                    .tickSize(-container_width, 0, 0)
                    .tickFormat(function(d){return date_format(d)})
var x_scale = d3.scalePoint()
                .domain(["0","exchange","withdrawal","old-notes","1"])
                .range([0,(container_width-margin.left-margin.right)])

var svg = d3.select('.chart-container')
    .append('svg')
    .attr('class','scroller-container')
    .attr('width',(container_width))
    .attr('height',(container_height))
    .append('g')
    .attr('transform','translate('+margin.left+","+margin.top+")")

svg.append('g')
    .call(time_axis)
    .attr('class','axis')

svg.append('g')
    .attr('class','el')
    .selectAll('line')
    .data(["exchange","withdrawal","old-notes"])
    .enter()
    .append('line')
    .attr("x1", function(e){return x_scale(e)})     // x position of the first end of the line
    .attr("y1", 0)      // y position of the first end of the line
    .attr("x2", function(e){return x_scale(e)})     // x position of the second end of the line
    .attr("y2", (container_height-margin.top-margin.bottom));    // y position of the second end of the line

svg.append('g')
    .attr('class','points-layer')
    .selectAll('.point')
    .data(data)
    .enter()
    .append('circle')
    .attr('class',function(d){return 'point '+d.type})
    .attr('cx',function(d){return x_scale(d.type)})
    .attr('cy',function(d){return time_scale(d.date)})
    .attr('r',5)

d3.select('.chart-container')
    .append('div')
    .attr('class','annotation-container')
    .selectAll('.annotation')
    .data(annotations)
    .enter()
    .append('div')
    .attr('class','annotation')
    .style('top',function(d){return (time_scale(d.date)+50)+'px'})
    .append('p')
    .text(function(d){return d.what})


var buffer = 200;
var svg_pos = $('svg').offset().top;
console.log(svg_pos)
$(document).ready(function() {  
    var stickyNavTop = $('.counter-container').offset().top;  
    var stickyNav = function(){  
        var scrollTop = $(window).scrollTop();  

        if (scrollTop > stickyNavTop) {   
            $('.counter-container').addClass('fixed');
            $('.chart-container,.annotation').addClass('move');
        } else {  
            $('.counter-container').removeClass('fixed');
            $('.chart-container,.annotation').removeClass('move');   
        }  
        };

    
    var maxtick = 0
    var maxdate
    var tickDetector = function(){
        var scrollTop = $(window).scrollTop();
        $('.tick').each(function(i) {
             var tickpos = (parseFloat(svg_pos)+parseFloat($(this).attr('transform').split(',')[1].replace(')',"")))
             if ((tickpos-buffer<=scrollTop) && maxtick<tickpos){
                maxtick = tickpos
                maxdate = $(this).text()
             } else if (scrollTop<maxtick-buffer){
                maxtick = 0
             }
        });
    }

    var updateDots = function(){
        d3.selectAll('.point')
            .transition()
            .attr('class',function(d){
                if ((parseFloat(time_scale(d.date))+parseFloat(svg_pos))==maxtick){
                    return ('point active '+d.type)
                } else {
                    return 'point'
                }
            })
            .duration('500')

    }

    var updateAnnotation = function(){
        d3.selectAll('.annotation')
            .attr('class',function(d){
                if ((parseFloat(time_scale(d.date))+parseFloat(svg_pos))==maxtick){
                    return ('annotation show')
                } else {
                    return 'annotation'
                }
            })

    }


    var updateCounter = function(){
        var filterdata = _.filter(data,function(d){return time_scale(d.date)<=maxtick-parseFloat(svg_pos)})
        $('.counter-value').text(filterdata.length)
        $('.counter .date').text(maxdate)
    }

    $(window).scroll(function() { 
        stickyNav();
        tickDetector();
        updateDots();
        updateCounter();
        updateAnnotation();
    }); 
});