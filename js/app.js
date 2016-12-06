require('../css/styles.scss')
var d3 = require('d3')
var $ = require('jquery')
var _ = require('underscore')

var annotations = [
    {
        "date": new Date (2016,10,8),
        "what": "<span class = 'exchange'>Old notes worth Rs 4000 can be exchanged at banks.</span> <span class = 'withdrawal'>ATM withdrawal limit at Rs. 2,000. Withdrawal limit from banks fixed at Rs. 20,000 a week; daily limit at Rs. 10,000.</span> <span class = 'old-notes'>Fuel stations, airports, railways to accept old notes.</span>"
    },
        {
        "date": new Date (2016,10,9),
        "what": "<span class = 'old-notes'>Metro stations, ASI monuments, toll plazas and medicine shops to also accept old notes.</span>"
    },
    {
        "date": new Date (2016,10,10),
        "what": "<span class = 'old-notes'>Old notes can be used to pay educational fees, clear any charges, taxes, and penalties due to government, municipal, and local bodies, and other utilities.</span>"
    },
    {
        "date": new Date (2016,10,13),
        "what": "<span class = 'exchange'>Currency exchange limit raised from Rs 4,000 to Rs 4,500.</span> <span class = 'withdrawal'>ATM withdrawal limit increased to Rs 2,500.</span>"
    },
    {
        "date": new Date (2016,10,15),
        "what": "<span class = 'exchange'>Banks instructed to use indelible ink marks on people exchanging money.</span>"
    },
        {
        "date": new Date (2016,10,17),
        "what": "<span class = 'exchange'>Exchange limit lowered to Rs 2,000 after reports of people getting black money exchanged by hiring workers.</span>"
    },
            {
        "date": new Date (2016,10,21),
        "what": "<span class = 'old-notes'>Farmers allowed to buy seeds with old currency.</span>"
    },
    {
        "date": new Date (2016,10,24),
        "what": "</span><span class = 'exchange'> Exchange of money is stopped.</span> <span class = 'old-notes'>Banned Rs 500 notes can be used at petrol pumps and for buying airline tickets till December 15. Old Rs 1,000 notes can only be deposited into accounts."
    },
    {
        "date": new Date (2016,10,28),
        "what": "<span class = 'withdrawal'>RBI waives withdrawal limits, but only for new notes you deposit in your account. Withdrawal limits for other customers remains capped at Rs 24,000 per week.</span>"
    },
    {
        "date": new Date (2016,11,1),
        "what": "<span class = 'old-notes'>Old Rs 500 notes can be used at petrol pumps and for buying airline tickets till December 2 instead of December 15.</span>"
    }
]
var data = [
  {
    "type": "exchange",
    "date": new Date (2016,10,8)
  },
    {
    "type": "withdrawal",
    "date": new Date (2016,10,8)
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
    "type": "withdrawal",
    "date": new Date (2016,10,13)
  },
  {
    "type": "exchange",
    "date": new Date (2016,10,13)
  },
    {
    "type": "exchange",
    "date": new Date (2016,10,15)
  },
  {
    "type": "exchange",
    "date": new Date (2016,10,17)
  },
    {
    "type": "old-notes",
    "date": new Date (2016,10,21)
  },
  {
    "type": "exchange",
    "date": new Date (2016,10,24)
  },
  {
    "type": "old-notes",
    "date": new Date (2016,10,24)
  },
    {
    "type": "withdrawal",
    "date": new Date (2016,10,28)
  },
    {
    "type": "old-notes",
    "date": new Date (2016,11,1)
  }
]

var date_format = d3.timeFormat("%b %d");
var container_width = $('.copy').width()
var container_height = (container_width<600)?2000:2600
var margin = {top: 30, bottom: 40, left: 40, right: 30}
var time_scale = d3.scaleTime()
                    .domain(d3.extent(data, function(e){return e.date})) 
                    .range([0,(container_height-margin.top-margin.bottom)])
var time_axis = d3.axisLeft(time_scale)
                    .tickValues(_.chain(annotations).pluck('date').uniq().value())
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
    .html(function(d){return d.what})


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
        
        var filterdata = _.filter(data,function(d){return Math.round(time_scale(d.date))<=Math.round(maxtick-parseFloat(svg_pos))})
        var date = (filterdata.length>0)?maxdate:'Nov 07'
        if (filterdata.length>0){
            var sentence = 'By <b>'+date+'</b>, rules for <span class = "exchange">cash exchange</span> had been changed <b>' + getTimes(_.where(filterdata,{type: 'exchange'}).length) + '</b>, <span class = "withdrawal">withdrawal limits</span> had been changed <b>'+ getTimes(_.where(filterdata,{type: 'withdrawal'}).length) +'</b>, and options for the <span class = "old-notes">usage of old notes</span> had been changed <b>'+getTimes(_.where(filterdata,{type: 'old-notes'}).length)+'</b> .' 
        } else {
            var sentence = 'No changes were made till November 7.'
        }
        
        $('.counter').html(sentence)
    }

    var getTimes = function(num){
        if (num == 1){
            return 'once'
        } else if (num ==2){
            return 'twice'
        } else if (num ==3){
            return 'thrice'
        } else {
            return num + ' times'
        }
    }

    $(window).scroll(function() { 
        stickyNav();
        tickDetector();
        updateDots();
        updateCounter();
        updateAnnotation();
    }); 
});