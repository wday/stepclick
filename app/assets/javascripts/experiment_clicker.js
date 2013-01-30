var c;
var ctx;
var scale_start_point;
var scale_end_point;
var scale;
var cur_framenum;
var current_particle_id;
var particles;
var imgwidth;
var imgheight;
var scale_length_px;
var scale_known_distance;
var scale_known_units;
var experiment_clip_path;
var is_measuring;

function start_measuring() {
  if ($("#scale-distance-known").val().length == 0 || $("#scale-distance-units").val().length == 0) {
    alert("Please enter the length of the object to be measured");
  } else {
    scale_start_point = null;
    scale_end_point   = null;
    load_frame(cur_framenum);
    alert('Click two points of known distance');
  }
}

function fps() {
  return gon.fps;
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
    render();
  } 
  cur_framenum = framenum;
  img.src = imgurl;

}

function render() {
  var c = document.getElementById("imgbox");
  var ctx = c.getContext("2d");
  render_points(c,ctx);
  render_scale(c,ctx);
}

function render_points(c, ctx) {
  // Render all particle points using their colors
  $.each( particles, function() {
    var fill_color = this.color;
    $.each( this.points, function() {
      draw_circle(ctx, fill_color, this.px_x(imgwidth), imgheight - this.px_y(imgheight), 7)
    });
  });
}

function draw_circle(ctx, color, x, y, r)  {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2*Math.PI);
  ctx.fill();
  ctx.closePath();
  ctx.stroke();
}

function render_scale(c,ctx) {

  if( scale_start_point && scale_end_point ) {
    ctx.strokeStyle = "green";
    ctx.lineWidth = 4;
    ctx.beginPath()
    ctx.moveTo( scale_start_point.px_x(imgwidth), imgheight - scale_start_point.px_y(imgheight) );
    ctx.lineTo( scale_end_point.px_x(imgwidth), imgheight - scale_end_point.px_y(imgheight) );
    ctx.stroke();
  }

  if( scale_start_point ) {
    draw_circle(ctx, "red", scale_start_point.px_x(imgwidth), imgheight-scale_start_point.px_y(imgheight),6);
  }

  if( scale_end_point ) {
    draw_circle(ctx, "red", scale_end_point.px_x(imgwidth), imgheight-scale_end_point.px_y(imgheight),6);
  }
  
}

function load_start_frame() {
  load_frame(gon.framenum_min);
}

function load_previous_frame_skip()  { load_previous_frame(Number($('#skip-distance').val())); }
function load_previous_frame_first() { load_previous_frame(1); }
function load_previous_frame(frame_skip) {
  if (cur_framenum - frame_skip >= gon.framenum_min) {
    load_frame(cur_framenum - frame_skip);
  }
}
function has_previous_frame() {
  var frame_skip = Number($('#skip-distance').val());
  return cur_framenum - frame_skip >= gon.framenum_min;
}

function load_next_frame_skip()  { load_next_frame(Number($('#skip-distance').val())); }
function load_next_frame_first() { load_next_frame(1); }
function load_next_frame(frame_skip) {
  if (cur_framenum + frame_skip <= gon.framenum_max ) {
    load_frame(cur_framenum + frame_skip);
  }
}
function has_next_frame() {
  var frame_skip = Number($('#skip-distance').val());
  return cur_framenum + frame_skip <= gon.framenum_max;
} 


function set_scale() {

  // TODO check to make sure scale_start_point and scale_end_point exist
  scale_length_px      = scale_end_point.distance_to(scale_start_point);
  scale_known_distance = Number($('#scale-distance-known').val());
  scale_known_units    = $('#scale-distance-units').val();

  $.post( 
    "/experiments/" + gon.experiment_id + "/set_scale/",
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

  is_measuring = false;
}

function click_handler(e) {

  // event is in page space, must remap to canvas space [screen -> canvas element]
  var x = 1.0 * (e.pageX - $('#imgbox').offset().left);
  var y = 1.0 * (e.pageY - $('#imgbox').offset().top);

  // normalize to image dimensions [canvas element -> image content]
  var xprime = x / imgwidth;
  var yprime = (imgheight - y) / imgheight; // axis is inverted compared to "science" plot standards

  if ( is_measuring && !scale_start_point && !scale_end_point ) {
    scale_start_point = new DataPoint(0,0,xprime,yprime);
  } else if (is_measuring && scale_start_point && !scale_end_point) {
    scale_end_point = new DataPoint(0,0,xprime,yprime);
    set_scale();
  } else if (current_particle_id) {
    click_handle_particle_point(x,y,xprime,yprime);
  }
  render();
}

function click_handle_particle_point(x,y,xprime,yprime) {
  var curtime = (cur_framenum-1)/fps();
  var pt      = new DataPoint(cur_framenum,curtime,xprime,yprime);
  var route   = '/experiments/' + gon.experiment_id + '/particles/' + current_particle_id + '/add_datum/';
  $.post(route,
    { datum: { 
        frame: cur_framenum,
        time: curtime,
        x: xprime,
        y: yprime }
    },
    function(data) {
      console.log('submitted route: ' + route);
      console.log('submitted datum: ' + data);
    }
  );
  // should always be true since click handler for this is only called if true...
  if (current_particle_id) {
    particles[current_particle_id].points.push(new DataPoint(cur_framenum, curtime, xprime, yprime));
  }
  if (has_next_frame()) {
    load_next_frame_skip();
  } else {
    alert('no more frames to track');
  }
}

// TODO - work with objects, first load object ids and then load data for each object
function ajax_load_data() {
  function make_particle_loader(particle_id) {
    return function(data) {
      console.log("received existing data points, n = " + data.length + " for particle_id = " + particle_id);
      particles[particle_id].points = Array();
      particles[particle_id].color  = gon.particle_colors[particle_id];
      $.each(data, function() {
        console.log("loading datum: " + this.frame + ", " + this.time + ", " + this.x + ", " + this.y);
        particles[particle_id].points.push(new DataPoint(this.frame, this.time, this.x, this.y));
      });
    }
  }
  $.each(gon.particle_id, function() {
    particles[this] = {}
    $.ajax( {
      type: "GET",
      dataType: "json",
      url: "/experiments/" + gon.experiment_id + "/particles/" + this + "/data.json",
      success: make_particle_loader(this),
      complete: function() { render(); }
    });
  });
}

function ajax_load_scale() {
  $.ajax( {
    type: "GET",
    dataType: "json",
    url: "/experiments/" + gon.experiment_id + "/scales.json",
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
    complete: function() { render(); }
  });
}

$(document).ready(function() {

  c   = document.getElementById("imgbox"); 
  ctx = c.getContext("2d");

  scale_start_point = null;
  scale_end_point   = null;

  scale = {
    x0: null,
    y0: null,
    x1: null,
    y1: null,
    length_known: null,
    units: null
  };

  cur_framenum = gon.framenum_min;

  current_particle_id = undefined;
  is_measuring = false;

  particles = {};
  
  scale_length_px = 1;
  scale_known_distance = 1;
  scale_known_units = "px";

  experiment_clip_path = gon.clip_path;

  $("#edit-particle").click( function(e) {
    if (current_particle_id && $("#edit-particle").hasClass('active')) {
      current_particle_id = undefined; // stop recording for current particle
      $("#edit-particle").removeClass('active'); // unpress
      $("[id^=particle-data]").attr("disabled",true); // enable
      $("select#particle_particle_id").attr("disabled",false); 
    } else {
      current_particle_id = $("#particle_particle_id").val();
      $("#edit-particle").addClass('active'); // make it depressed
      $("[id^=particle-data]").attr("disabled",false);
      $("select#particle_particle_id").attr("disabled",true);
    }
  });

  // do something smarter here like attaching the route into the object and look up dynamically?
  $("#particle-data").click( function() {
    window.location = '/experiments/' + gon.experiment_id + '/particles/' + current_particle_id + "/data";
  });
  $("#particle-data-csv").click( function() {
    window.location = '/experiments/' + gon.experiment_id + '/particles/' + current_particle_id + "/data.csv";
  });
  $("#particle-data-plot").click( function() {
    window.location = '/experiments/' + gon.experiment_id + '/particles/' + current_particle_id + "/plot";
  });

  $("[id^=particle-data]").attr("disabled",true); // disabled initially

  // HACK
  $("input").addClass("input-mini");
  $("select").addClass("input-small");

  $(window).resize(function() {
    fit_canvas_to_window();
  });

  $("#imgbox").click(function(e) {
    click_handler(e); 
  });
  
  ajax_load_data();
  ajax_load_scale();
  fit_canvas_to_window(); // this also loads the initial frame
});

