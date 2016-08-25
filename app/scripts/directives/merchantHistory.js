(function() {
  'use strict';
    
  angular.module('dashboardApp')
    .directive('merchantHistory', [
    '$window', function($window) {
      var MerchantHistory = function(scope, element, attr) {
        var element_dim = (element.parent())[0].getBoundingClientRect();
        var svg_dim = [parseInt(1/2*element_dim.width), parseInt(element_dim.width)];
        var margin = {top:50, right:20, bottom:50, left:50};
        var legend_width = 50;
        var color = d3.scale.category20c();

        var xAxis = d3.svg.axis()
            .orient("bottom");
        var yAxis = d3.svg.axis()
            .orient("left")
            .ticks(10);

        var div_tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .on("click", function() {
                div_tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        var responsiveSVG = d3.select(element[0]);
            //.append("div");
            //.classed("svg-container", true);

        var canvas = responsiveSVG.append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + (svg_dim[1] + margin.left + margin.right + legend_width) + " " + (svg_dim[0] + margin.top + margin.bottom))
            .classed("svg-content-responsive", true)
//            .attr("height", svg_dim[0] + margin.top + margin.bottom)
//            .attr("width", svg_dim[1] + margin.left + margin.right + legend_width);


        var group = canvas.append("g")
            .attr('class','plot')
            .attr("transform", "translate(" + margin.left + ",0)");
    
        var xAxis_gr = group.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + (svg_dim[0] - margin.bottom) + ")");
        
        var yAxis_gr = group.append("g")
            .attr("class","axis y-axis")
            .attr("transform", "translate(" + margin.left  + ",0)");

        var yAxis_label = yAxis_gr
            .append('g')
            .attr('class','label')
            .append('text');

        yAxis_label.text('Equivalent Cash Back (%)')
            .attr({'y':-margin.left, 
                   'x':-svg_dim[0]/2, 
                   'font-size': '12pt',
                   'text-anchor':'middle', 
                   'transform':'rotate(-90)',
                   'visibility':'visible'});

        var findStartDate = function(data) {
            return d3.min(data, function(d) {
                return d.dateCreated;
            });
        }

        var calcEquivalentPercentage = function(portalData) {
            var returnVal = 0;
            if (portalData.reward.limit !== null) {
                returnVal = 0;
            } else if (portalData.reward.rate === "%") {
                returnVal = portalData.reward.value;
            } else {
                returnVal = parseFloat(portalData.reward.value * portalData.reward.equivalentPercentage); 
            }
            return returnVal;
        }

        var findMaxEquivalentPercentage = function(data) {
            return d3.max(data, function(d) {
                return calcEquivalentPercentage(d);
            });            
        }

        var orderDataByPortalKey = function(portalData) {
            var orderedData = {};
            portalData.forEach(function(datapoint){
                if (orderedData[datapoint.portalStoreKey] !== undefined) {
                    orderedData[datapoint.portalStoreKey].push(datapoint);                    
                } else {
                    orderedData[datapoint.portalStoreKey] = [datapoint];
                }
            });
            return orderedData;
        }

        var getPortal = function(portalStoreKey) {
            return portalStoreKey.split(':')[0];
        }

        var xScale = d3.time.scale()
            .range([margin.left, svg_dim[1] - legend_width - margin.right * 2])
            .nice();

        var yScale = d3.scale.linear()
            .range([svg_dim[0] - margin.bottom, margin.top])
            .nice();

        scope.$watch('data', function(newData, oldData){
            var startDate = findStartDate(newData);
            
            xScale.domain([new Date(startDate * 1000),new Date(scope.endDate * 1000)]);
            yScale.domain([0, findMaxEquivalentPercentage(newData)]);

            var lineFunction = d3.svg.line()
                    .x(function(dat) {return xScale(new Date(dat.dateCreated * 1000));})
                    .y(function(dat) {return yScale(calcEquivalentPercentage(dat));})
                    .interpolate('step-before');

            xAxis.scale(xScale);
            yAxis.scale(yScale);
              
            xAxis_gr.call(xAxis);
            yAxis_gr.call(yAxis);

            group.selectAll('g.x-axis text') 
                .style('text-anchor', 'end')
                .attr({
                       'dx':'-.8em',
                       'dy':'.15em',
                       'transform':'rotate(-65)'
                      });

            var dataOrderedByPortal = orderDataByPortalKey(newData);
            var dataLength = d3.keys(dataOrderedByPortal).length;
            var gr_portal = group.selectAll('g.portal');
            gr_portal.remove();
            var gr_portal = group.selectAll('g.portal');
            var gr = gr_portal.data(d3.values(dataOrderedByPortal))
                .enter()
                .append('g')
                .attr('class', function(d) {return getPortal(d[0].portalStoreKey) + ' portal';});

            gr.each(function(d,i){
                var lineGroup = d3.select(this)
                    .append('g')
                    .attr('class','lines');

                var gr_line = lineGroup.selectAll('.line')
                    .data(d);

                gr_line.transition()
                    .duration(1000)
                    .attr('d', lineFunction(d));

                gr_line.enter()
                    .append('path')
                    .attr('d', lineFunction(d))
                    .attr({'fill':'none',
                            'stroke':color(i*parseInt(20/(dataLength-1))), 
                            'stroke-width':'4',
                            'class':'line'});
                
                gr_line.exit()
                    .transition()
                    .remove();

                var circleGroup = d3.select(this)
                    .append('g')
                    .attr('class','circles');

                var gr_circle = circleGroup.selectAll('circle')
                        .data(d);

                gr_circle.transition()
                    .duration(1000)
                    .attr({'r':'5', 
                            'cx':function(dat) {
                                return xScale(new Date(dat.dateCreated * 1000));},
                            'cy':function(dat) {
                                return yScale(calcEquivalentPercentage(dat));}});

                gr_circle.enter()
                    .append('circle')
                    .attr({'r':'5', 
                        'cx':function(dat) {
                            return xScale(new Date(dat.dateCreated * 1000));},
                        'cy':function(dat) {
                            return yScale(calcEquivalentPercentage(dat));},
                        'stroke': color(i*parseInt(20/(dataLength-1))),
                        'stroke-width':'2',
                        'fill':'white',
                        'class':'circle'});

                gr_circle.on('mouseenter', function(dat,ind) {
                    div_tooltip.transition() // fade in
                        .duration(200)
                        // Fill the tooltip background like the corresponding arc
                        .style({'background': color(i*parseInt(20/(dataLength-1))),
                                'opacity': 0.9,
                                'left': function() {
                                    return d3.event.pageX + "px";
                                },'top':function() {
                                    return d3.event.pageY - 30 + "px";
                                }})
                        .text(getPortal(dat.portalStoreKey) + ': ' 
                        + dat.reward.value
                        + ((dat.reward.unit === '%') ? '' : ' ' + dat.reward.unit)
                        + dat.reward.rate
                        + " on " + new Date(dat.dateCreated * 1000).toDateString() );
                });

                gr_circle.exit()
                    .transition()
                    .remove();
            });

            d3.selectAll('g.legend').remove();
            var legend_gr = gr.select('g.plot g.legend')
                        .data(d3.values(dataOrderedByPortal));

            legend_gr.enter()
                .append('g')
                .attr('class','legend');

            legend_gr.each(function(d,i) {
                d3.select(this)
                    .append('rect')
                    .style({'fill': color(i*parseInt(20/(dataLength-1)))})
                    .attr({'x': svg_dim[1] - legend_width - margin.right - 10,
                            'y': i*1.5+'em',
                            'width': '2em',
                            'height': '1em', 
                            'transform':'translate(0,' + margin.top + ')',
                            'class':'legend'});

                d3.select(this)
                    .append('text')
                    .attr({'x': svg_dim[1] - legend_width - margin.right + 10, 
                            'dy':'0.8em', 
                            'dx':'0.8em',
                            'y': i*1.5+'em',
                            'text-anchor':'start',
                            'transform':'translate(0,' + margin.top + ')',
                            'class':'legend'})
                    .text(getPortal(d[0].portalStoreKey));
            });
        }); 
      };

      return {
        scope: {
          data : '=',
          endDate: '='
        },
        restrict: 'A',
        link: MerchantHistory
      };
    }
  ]);
}());