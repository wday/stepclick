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
    is_measuring      = true;
    scale_start_point = null;
    scale_end_point   = null;
    load_frame(cur_framenum);
    alert('Click two points ' + $("#scale-distance-known").val() + " " + $("#scale-distance-units").val() + " apart");
  }
}

function validate_fps() {
  if ($("#fps").val() <= 0) {
    alert("FPS May not have been read correctly!");
  } else {
    ; // do nothing, would be nice to highlight on error and unhighlight when fixed
      // but most obvious way to do that is to put in bootstrap control group...
  }
}

function fps() {
  return gon.fps;
}

function reset_view() {
  load_frame(cur_framenum);
  render();
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
  if (!$("#edit-particle").hasClass('active')) {
    console.log("rendering all particles");
    render_points(c,ctx, Object.keys(particles), "circles");
    render_scale(c,ctx);
  } else {
    console.log("rendering edit particle");
    render_points(c, ctx, [$("#particle_particle_id").val()], "points");    
  }
}

function render_points(c, ctx, particle_ids, style) {
  // Render all particle points using their colors
  $.each( particle_ids, function(i,id) {
    console.log('rendering particle: ' + id + ' of ' + particle_ids);
    if (particles[id].points && particles[id].points.length > 0) {
      $.each( particles[id].points, function(j,point) {
        if (style === "circles") {
          draw_circle(ctx, particles[id].color, point.px_x(imgwidth), imgheight - point.px_y(imgheight), 7);
        } else if (style === "points") {
          draw_point (ctx, particles[id].color, point.px_x(imgwidth), imgheight - point.px_y(imgheight));
        }
      });
    }
  });
}

function draw_circle(ctx, color, x, y, r)  {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2*Math.PI);
  //ctx.fillStyle = color;
  //ctx.fill();
  ctx.lineWidth   = 2;
  ctx.strokeStyle = color;
  ctx.closePath();
  ctx.stroke();
}

function draw_point(ctx, color, x, y)  {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.rect(x,y,1,1);
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
  } else if ($("#edit-particle").hasClass("active")) {
    click_handle_particle_point(x,y,xprime,yprime);
  } else {
    console.log('no click actions to take in this state');
  }
  render();
}

function click_handle_particle_point(x,y,xprime,yprime) {
  var curtime = (cur_framenum-1)/fps();
  var pt      = new DataPoint(cur_framenum,curtime,xprime,yprime);
  var route   = '/experiments/' + gon.experiment_id + '/particles/' + $("#particle_particle_id").val() + '/add_datum/';
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
  // NOTE consider if it really is selected since this function was invoked?
  particles[$("#particle_particle_id").val()].points.push(new DataPoint(cur_framenum, curtime, xprime, yprime));
  if (has_next_frame()) {
    load_next_frame_skip();
  } else {
    //alert('no more frames to track');
    $("#edit-particle").removeClass("active");
    $("select#particle_particle_id").attr("disabled",false); 
    load_start_frame();
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