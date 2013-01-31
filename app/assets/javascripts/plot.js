function plot_csv_multiple(graph, w, h, idprefix, csv, scale, xcolid, ycolids, colors, update_selected_view) {
  var m, raw, graph, hmap, xmap, ymap, line, xmin, xmax, ymin, ymax, units, xcolid, ycolid, xymin, xymax, get_y_raw, get_x_raw;

  // TODO parameterize this
  m = 64;

  viz = graph.append("svg:g").attr("id","plot-display")
    .attr("transform","translate(" + m + ", " + m + ")");

  units  = gon.scale.measured_units;

  function make_screen_getter(data_to_screen,cid) {
    return {
        column_id: cid,
        to_screen: function(d) { return data_to_screen(d[cid]); }
    }
  }

  function make_raw_getter(cid) {
    return function(d) { 
      return d[cid]; 
    }
  }

  // get domain bounds
  get_x_raw = make_raw_getter(xcolid);
  xmin = []; xmax = [];
  $.each(csv, function(i,el) {
    xmin.push( d3.min(el, get_x_raw) );
    xmax.push( d3.max(el, get_x_raw) );
  });
  xmin = d3.min(xmin);
  xmax = d3.max(xmax);
  
  ymin = []; ymax = []; 
  get_y_raw = [];
  for (var i = 0; i < ycolids.length; i++) {
    get_y_raw[i] = make_raw_getter(ycolids[i]);
  }
  $.each(csv, function(i,el) {
    for (var i = 0; i < ycolids.length; i++) {
      ymin.push( d3.min(el, get_y_raw[i]) );
      ymax.push( d3.max(el, get_y_raw[i]) );
    }
  });
  ymin = d3.min(ymin);
  ymax = d3.max(ymax);

  // set up screen domain maps
  xmap = d3.scale.linear().domain([xmin,xmax]).range([0, w-2*m]);
  ymap = d3.scale.linear().domain([ymin,ymax]).range([h-2*m, 0]);

  // create getters than map from data space to screen spce
  var get_x = make_screen_getter(xmap,xcolid);
  var get_y = [];
  for (var i = 0; i < ycolids.length; i++) {
    get_y[i] = make_screen_getter(ymap,ycolids[i]);
  }

  // RENDER SCREEN OBJECTS FOR DATA
  line = [];
  for (var i = 0; i < ycolids.length; i++) {
    line.push( d3.svg.line()
                .x(get_x.to_screen)
                .y(get_y[i].to_screen) );
  }

  $.each( csv, function(j,el) {
    for (var i = 0; i < ycolids.length; i++) {
      viz.append("svg:path")
        .data(csv)
        .style("stroke",colors[j])
        .attr("class", idprefix[j] + "path_" + ycolids[i])
        .attr("d", line[i](el));
    }
  });

  function make_point_selector(get_y, csv_index) {
    return function (d,i) {

      var data = {
        "x1":get_x.to_screen(d),
        "y1":get_y.to_screen(d), 
        "x0":null, 
        "y0":null
      };

      // if there was a previous selected point, we will transition the selection from that one to the new one
      var data0 = d3.select('.selected').data()[0];

      if (data0 === undefined) {
        data.x0 = data.x1;
        data.y0 = data.y1;
      } else {
        data.x0 = data0.x1;
        data.y0 = data0.y1;
      }

      // now render the selection
      d3.selectAll('.selected').remove();
      viz.selectAll('.selected')
          .data([data])
        .enter().append("circle").attr("class","selected")
          .attr("r", 12)
          .attr("cx", function(dd){return dd.x0})
          .attr("cy", function(dd){return dd.y0})
          .style("fill", "none")
          .style("stroke", "green")
          .style("stroke-width", 3)
        .transition()
          .duration(750)
          .attr("r", 12)
          .attr("cx", function(dd){return dd.x1})
          .attr("cy", function(dd){return dd.y1});

      // render the centered derivative at xclick
      var m;
      if ((i+1) < csv[csv_index].length && (i-1) >= 0) {
        var d2     = csv[csv_index][i+1];
        var d0     = csv[csv_index][i-1];
        var d1     = d;
        var mf     = (get_y.to_screen(d2)-get_y.to_screen(d1))/(get_x.to_screen(d2)-get_x.to_screen(d1));
        var mb     = (get_y.to_screen(d1)-get_y.to_screen(d0))/(get_x.to_screen(d1)-get_x.to_screen(d0));
            m      = 0.5 * (mf + mb);
        var yclick = get_y.to_screen(d);
        var xclick = get_x.to_screen(d);
        var bclick = yclick - m * xclick;
        function dydx(x) {
          return m * x + bclick;
        }

        if ( $('.derivative').length == 0) {
          viz.append('line').attr('class','derivative')
            .attr('x1',xmap.range()[0])
            .attr('x2',xmap.range()[1])
            .attr('y1',bclick)
            .attr('y2',dydx(xmap.range()[1]))
            .style('stroke','black');
        } else {
          viz.selectAll('.derivative')
            .transition()
              .duration(750)
              .attr('x1',xmap.range()[0])
              .attr('x2',xmap.range()[1])
              .attr('y1',bclick)
              .attr('y2',dydx(xmap.range()[1]));
        }
      } else {
        viz.selectAll('.derivative').remove();
        m = undefined;
      }

      update_selected_view(
        xmap.invert(get_x.to_screen(d)), get_x.column_id, 
        ymap.invert(get_y.to_screen(d)), get_y.column_id,
        -m); // HACK since we are working with inverted screen coordinates

    }
  }

  $.each( csv, function(j,el) {
    for (var i = 0; i < ycolids.length; i++) {
      viz.selectAll(idprefix[j]+"circle_"+ycolids[i])
        .data(el)
        .enter().append("svg:circle").attr("class",idprefix[j]+"circle_"+ycolids[i]).attr("id",idprefix[j]+"circle_" + ycolids[i] + "_" + i)
          .attr("cx", get_x.to_screen)
          .attr("cy", get_y[i].to_screen)
          .attr("r", 8)
          .style('stroke','black')
          .style('fill',colors[j])
          .on("click", make_point_selector(get_y[i], j));
    }
  });
  
  var xaxis = d3.svg.axis().scale(xmap).ticks(8);
  var yaxis = d3.svg.axis().scale(ymap).ticks(10).orient("left");

  var axis_x = viz.append("svg:g")
    .attr("class","x axis")
    .attr("transform","translate(0," + (h-2*m) + ")")
    .call(xaxis);

  if (d3.min(ymap.domain()) < 0 && 0 < d3.max(ymap.domain())) {
    console.log("adding horizontal zero indicator");
    viz.append("line")
      .attr("x1",0)
      .attr("x2",w-2*m) //HACK why 2*m??
      .attr("y1",ymap(0))
      .attr("y2",ymap(0))
      .style('stroke','gray')
      .style('stroke-width',1);
  }

  var axis_y = viz.append("svg:g")
    .attr("class","y axis")
    .attr("transform","translate(0,0)")
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

  // for (var i = 0; i < idprefix.length; i++) {
  //   graph.append("text")
  //     .attr("class", "leg y")
  //     .attr("text-anchor", "start")
  //     .attr("x", m+m/4)
  //     .attr("y", m+16*i)
  //     .text(idprefix[i])
  //     .style("stroke",colors[i]);
  // }

  return {"xmap": xmap, "ymap": ymap, "line": line}
}

function plot_csv(graph, w, h, csv, scale, xcolid, ycolids, colors, update_selected_view) {
  var m, raw, graph, hmap, xmap, ymap, line, xmin, xmax, ymin, ymax, units, xcolid, ycolid, xymin, xymax, get_y_raw, get_x_raw;

  // TODO parameterize this
  m = 64;

  viz = graph.append("svg:g").attr("id","plot-display")
    .attr("transform","translate(" + m + ", " + m + ")");

  units  = gon.scale.measured_units;

  function make_screen_getter(data_to_screen,cid) {
    return {
        column_id: cid,
        to_screen: function(d) { return data_to_screen(d[cid]); }
    }
  }

  function make_raw_getter(cid) {
    return function(d) { 
      return d[cid]; 
    }
  }

  csv  = gon.data;

  // get domain bounds
  get_x_raw = make_raw_getter(xcolid);
  xmin      = d3.min(csv, get_x_raw);
  xmax      = d3.max(csv, get_x_raw);
  
  ymin      = []; 
  ymax      = []; 
  get_y_raw = [];
  for (var i = 0; i < ycolids.length; i++) {
    get_y_raw[i] = make_raw_getter(ycolids[i]);
  }
  for (var i = 0; i < ycolids.length; i++) {
    ymin.push( d3.min(csv, get_y_raw[i]) );
    ymax.push( d3.max(csv, get_y_raw[i]) );
  }
  ymin = d3.min(ymin);
  ymax = d3.max(ymax);

  // set up screen domain maps
  xmap = d3.scale.linear().domain([xmin,xmax]).range([0, w-2*m]);
  ymap = d3.scale.linear().domain([ymin,ymax]).range([h-2*m, 0]);

  // create getters than map from data space to screen spce
  var get_x = make_screen_getter(xmap,xcolid);
  var get_y = [];
  for (var i = 0; i < ycolids.length; i++) {
    get_y[i] = make_screen_getter(ymap,ycolids[i]);
  }

  // RENDER SCREEN OBJECTS FOR DATA
  line = [];
  for (var i = 0; i < ycolids.length; i++) {
    line.push( d3.svg.line()
                .x(get_x.to_screen)
                .y(get_y[i].to_screen) );
  }

  for (var i = 0; i < ycolids.length; i++) {
    viz.append("svg:path")
      .data(csv)
      .style("stroke",colors[i])
      .attr("d", line[i](csv));
  }

  function make_point_selector(get_y) {
    return function (d,i) {

      var data = {
        "x1":get_x.to_screen(d),
        "y1":get_y.to_screen(d), 
        "x0":null, 
        "y0":null
      };

      // if there was a previous selected point, we will transition the selection from that one to the new one
      var data0 = d3.select('.selected').data()[0];

      if (data0 === undefined) {
        data.x0 = data.x1;
        data.y0 = data.y1;
      } else {
        data.x0 = data0.x1;
        data.y0 = data0.y1;
      }

      // now render the selection
      d3.selectAll('.selected').remove();
      viz.selectAll('.selected')
          .data([data])
        .enter().append("circle").attr("class","selected")
          .attr("r", 12)
          .attr("cx", function(dd){return dd.x0})
          .attr("cy", function(dd){return dd.y0})
          .style("fill", "none")
          .style("stroke", "green")
          .style("stroke-width", 3)
        .transition()
          .duration(750)
          .attr("r", 12)
          .attr("cx", function(dd){return dd.x1})
          .attr("cy", function(dd){return dd.y1});

      // render the centered derivative at xclick
      var m;
      if ((i+1) < csv.length && (i-1) >= 0) {
        var d2     = csv[i+1];
        var d0     = csv[i-1];
        var d1     = d;
        var mf     = (get_y.to_screen(d2)-get_y.to_screen(d1))/(get_x.to_screen(d2)-get_x.to_screen(d1));
        var mb     = (get_y.to_screen(d1)-get_y.to_screen(d0))/(get_x.to_screen(d1)-get_x.to_screen(d0));
            m      = 0.5 * (mf + mb);
        var yclick = get_y.to_screen(d);
        var xclick = get_x.to_screen(d);
        var bclick = yclick - m * xclick;
        function dydx(x) {
          return m * x + bclick;
        }

        if ( $('.derivative').length == 0) {
          viz.append('line').attr('class','derivative')
            .attr('x1',xmap.range()[0])
            .attr('x2',xmap.range()[1])
            .attr('y1',bclick)
            .attr('y2',dydx(xmap.range()[1]))
            .style('stroke','black');
        } else {
          viz.selectAll('.derivative')
            .transition()
              .duration(750)
              .attr('x1',xmap.range()[0])
              .attr('x2',xmap.range()[1])
              .attr('y1',bclick)
              .attr('y2',dydx(xmap.range()[1]));
        }
      } else {
        viz.selectAll('.derivative').remove();
        m = undefined;
      }

      update_selected_view(
        xmap.invert(get_x.to_screen(d)), get_x.column_id, 
        ymap.invert(get_y.to_screen(d)), get_y.column_id,
        -m); // HACK since we are working with inverted screen coordinates

    }
  }


  for (var i = 0; i < ycolids.length; i++) {
    viz.selectAll(idprefix+"circle_"+ycolids[i])
      .data(csv)
      .enter().append("svg:circle").attr("class",idprefix+"circle_"+ycolids[i]).attr("id",idprefix+"circle_" + ycolids[i] + "_" + i)
        .attr("cx", get_x.to_screen)
        .attr("cy", get_y[i].to_screen)
        .attr("r", 8)
        .style('stroke','black')
        .style('fill',colors[i])
        .on("click", make_point_selector(get_y[i]));
  }

  var xaxis = d3.svg.axis().scale(xmap).ticks(8);
  var yaxis = d3.svg.axis().scale(ymap).ticks(10).orient("left");

  var axis_x = viz.append("svg:g")
    .attr("class","x axis")
    .attr("transform","translate(0," + (h-2*m) + ")")
    .call(xaxis);

  if (d3.min(ymap.domain()) < 0 && 0 < d3.max(ymap.domain())) {
    console.log("adding horizontal zero indicator");
    viz.append("line")
      .attr("x1",0)
      .attr("x2",w-2*m) //HACK why 2*m??
      .attr("y1",ymap(0))
      .attr("y2",ymap(0))
      .style('stroke','gray')
      .style('stroke-width',1);
  }

  var axis_y = viz.append("svg:g")
    .attr("class","y axis")
    .attr("transform","translate(0,0)")
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

  return {"xmap": xmap, "ymap": ymap, "line": line}
}