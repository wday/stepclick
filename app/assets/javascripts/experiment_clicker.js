var c;
var ctx;
var framenum_min; 
var framenum_max;
var initial_fps;
var is_measuring;
var scale_start_point;
var scale_end_point;
var scale;
var cur_framenum;
var points;
var imgwidth;
var imgheight;
var scale_length_px;
var scale_known_distance;
var scale_known_units;
var is_recording;
var experiment_id;
var experiment_clip_path;

function start_measuring() {
  is_measuring = 1;
  scale_start_point = null;
  scale_end_point = null;
  $('#btn-measure-scale').html("click two points");
}

function stop_measuring() {
  $('#btn-measure-scale').html("start measuring");
  is_measuring = 0;
} 

function fps() {
  return initial_fps;
}

function fit_canvas_to_window() {
  var c = document.getElementById("imgbox");
  var ctx = c.getContext("2d");

  var cheight = $(window).height() - $("#clicker").offset().top;
  
  console.log("clicker height: " + cheight);

  $("#clicker").height(cheight);

  ctx.canvas.width  = $("#clicker").width();
  ctx.canvas.height = $("#clicker").height();

  load_frame(cur_framenum);
}

function load_frame(framenum) {
  var clip_path = "../../../data/video/" + experiment_clip_path;
  var frame_path = "frame/" + zeroFill( framenum, 4 ) + ".jpg";
  var imgurl = clip_path + "/" + frame_path;

  var img = new Image();
  img.onload = function() {
    var aspect = this.height / this.width;
    var ctx_aspect = c.height / c.width;
    
    // if this img is shorter, fit the width and shrink the height
    if (aspect < ctx_aspect) {
      imgwidth = c.width;
      imgheight = c.height * aspect / ctx_aspect;
    // if this img is wider, fit the height and shrink the width
    } else {
      imgwidth = c.width * ctx_aspect / aspect;
      imgheight = c.height;
    }
    ctx.drawImage(this,0,0,imgwidth,imgheight);
    var disptime = $("#display-time");
    var disptime = $("#display-time");
    var curtime = (cur_framenum-1)/fps();
    $("#display-time").html(curtime.toFixed(3) + " (s)");
    $("#display-frame").html((cur_framenum-1));
    render_points();
  } 
  cur_framenum = framenum;
  img.src = imgurl;

}

function render_points() {
  var c = document.getElementById("imgbox");
  var ctx = c.getContext("2d");

  var pdata = [];
  ctx.fillStyle = "yellow";

  $(points).each(function() {
    ctx.fillRect(this.px_x(imgwidth)-1, imgheight - this.px_y(imgheight) + 1, 3, 3);
    pdata.push(this.toTuple(scale_known_distance,scale_length_px));
  });

  ctx.fillStyle = "red";

  if( scale_start_point ) {
    ctx.fillRect(scale_start_point.px_x(imgwidth)-1, imgheight - scale_start_point.px_y(imgheight)+1,3,3);
  }

  if( scale_end_point ) {
    ctx.fillRect(scale_end_point.px_x(imgwidth)-1, imgheight - scale_end_point.px_y(imgheight)+1,3,3);
  }

  if( scale_start_point && scale_end_point ) {
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;
    ctx.beginPath()
    ctx.moveTo( scale_start_point.px_x(imgwidth), imgheight - scale_start_point.px_y(imgheight) );
    ctx.lineTo( scale_end_point.px_x(imgwidth), imgheight - scale_end_point.px_y(imgheight) );
    ctx.stroke();
  }
  
}

function load_start_frame() {
  load_frame(framenum_min);
}

function load_previous_frame() {
  var frame_skip = Number($('#skip-distance').val());
  if (cur_framenum - frame_skip >= framenum_min) {
    load_frame(cur_framenum - frame_skip);
  }
}

function has_previous_frame() {
  var frame_skip = Number($('#skip-distance').val());
  return cur_framenum - frame_skip >= framenum_min;
}

function load_next_frame() {
  console.log("loading next frame");
  var frame_skip = Number($('#skip-distance').val());
  if (cur_framenum + frame_skip <= framenum_max ) {
    load_frame(cur_framenum + frame_skip);
  }
}

function has_next_frame() {
  var frame_skip = Number($('#skip-distance').val());
  return cur_framenum + frame_skip <= framenum_max;
} 


function set_scale_length(l) {
  scale_length_px = l;
}

function set_scale() {
  scale_length_px      = scale_end_point.distance_to(scale_start_point);
  scale_known_distance = Number($('#scale-distance-known').val());
  scale_known_units    = $('#scale-distance-units').val();

  $.post( 
    "/experiments/" + experiment_id + "/set_scale/",
    { scale: {
        x0: scale_start_point.x,
        y0: scale_start_point.y,
        x1: scale_end_point.x,
        y1: scale_end_point.y,
        measured_length: scale_known_distance,
        measured_units: scale_known_units
      }
    },
    function (data) {
      console.log("posted scale");
    }
  );
}

function start_recording() {
  is_recording = 1;
}

function click_handler(e) {

  // event is in page space, must remap to canvas space
  var x = 1.0 * (e.pageX - $('#imgbox').offset().left);
  var y = 1.0 * (e.pageY - $('#imgbox').offset().top);

  // normalize to image
  var xprime = x / imgwidth;
  var yprime = (imgheight - y) / imgheight; // axis is inverted compared to "science" plot standards

  if (is_measuring) {
    if (scale_start_point == null) {
      scale_start_point = new DataPoint(0,0,xprime,yprime);
      render_points();
    } else if (scale_end_point == null) {
      scale_end_point = new DataPoint(0,0,xprime,yprime);
      render_points();
      set_scale_length(scale_end_point.distance_to(scale_start_point));
      stop_measuring();
    }
  } else if (is_recording) {
    var curtime = (cur_framenum-1)/fps();
    var pt = new DataPoint(cur_framenum,curtime,xprime,yprime);
    $.post('/experiments/' + experiment_id + '/add_datum/',
      { datum: { 
          frame: cur_framenum,
          time: curtime,
          x: xprime,
          y: yprime }
      },
      function(data) {
        console.log('submitted datum: ' + data);
      }
    );
    points.push(pt);
    if (has_next_frame()) {
      load_next_frame();
    } else {
      is_recording = 0;
      render_points();
    }
  } else {
    console.log('unexpected click event state');
  }
}

function ajax_load_data() {
  $.ajax( {
    type: "GET",
    dataType: "json",
    url: "/experiments/" + experiment_id + "/data.json",
    success: function(data) {
      console.log("received existing data points, n = " + data.length);
      $.each(data, function() {
        console.log("loading datum: " + this.frame + ", " + this.time + ", " + this.x + ", " + this.y);
        points.push(new DataPoint(this.frame, this.time, this.x, this.y));
      });
    },
    complete: function() {
      ajax_load_scale();
    }
  });
}

function ajax_load_scale() {
  $.ajax( {
    type: "GET",
    dataType: "json",
    url: "/experiments/" + experiment_id + "/scales.json",
    success: function (data) {
      console.log("received existing scale, n = " + data.length);
      if (data.length > 0) {
        s = data[0];
        scale_start_point = new DataPoint(0,0,s.x0,s.y0);
        scale_end_point   = new DataPoint(0,0,s.x1,s.y1);
        scale_length_px   = s.measured_length;
        scale_known_units = s.measured_units;
        $("#scale-distance-known").val(s.measured_length);
        $("#scale-distance-units").val(s.measured_units);
      }
    },
    complete: function() { finish_init(); }
  });
}

function finish_init() {
  start_recording();

  fit_canvas_to_window(); // this also loads the initial frame
}
