function plot_csv(graph, w, h, csv, scale, xcolid, ycolids, colors) {
  var m, raw, graph, hmap, xmap, ymap, line, xmin, xmax, ymin, ymax, units, xcolid, ycolid, xymin, xymax;

  // TODO parameterize this
  m = 64;

  units  = gon.scale.measured_units;

  csv  = gon.data;

  xmin = d3.min(csv, function(d){return d[xcolid]});
  xmax = d3.max(csv, function(d){return d[xcolid]});
  
  ymin = []; 
  ymax = [];
  for (var i = 0; i < ycolids.length; i++) {
    ymin.push( d3.min(csv, function(d){return d[ycolids[i]]}) );
    ymax.push( d3.max(csv, function(d){return d[ycolids[i]]}) );
  }

  ymin = d3.min(ymin);
  ymax = d3.max(ymax);

  xmap = d3.scale.linear().domain([xmin,xmax]).range([m, w-m]);
  ymap = d3.scale.linear().domain([ymin,ymax]).range([h-m, m]);

  line = [];
  for (var i = 0; i < ycolids.length; i++) {
    line.push( d3.svg.line()
                .x(function(d) {return xmap(d[xcolid]);})
                .y(function(d) {return ymap(d[ycolids[i]]);}) );
  }

  for (var i = 0; i < ycolids.length; i++) {
    graph.append("svg:path")
      .data(csv)
      .style("stroke",colors[i])
      .attr("d", line[i](csv));
  }

  var xaxis = d3.svg.axis().scale(xmap).ticks(8);
  var yaxis = d3.svg.axis().scale(ymap).ticks(10).orient("left");

  var axis_y = graph.append("svg:g")
    .attr("class","x axis")
    .attr("transform","translate(0," + (h-m) + ")")
    .call(xaxis);

  var axis_x = graph.append("svg:g")
    .attr("class","y axis")
    .attr("transform","translate(" + m + ",0)")
    .call(yaxis);

  graph.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "middle")
      .attr("x", w/2)
      .attr("y", h-6)
      .text("Time (s)");

  graph.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "middle")
      .attr("y", 7)
      .attr("x", -h/2)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Position (" + units + ")");

  for (var i = 0; i < ycolids.length; i++) {
    graph.append("text")
      .attr("class", "leg y")
      .attr("text-anchor", "start")
      .attr("x", m+m/4)
      .attr("y", m+16*i)
      .text(ycolids[i] + " (" + units + ")")
      .style("stroke",colors[i]);
  }
}