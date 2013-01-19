function start_measuring(){is_measuring=1,scale_start_point=null,scale_end_point=null,$("#btn-measure-scale").html("click two points")}function stop_measuring(){$("#btn-measure-scale").html("start measuring"),is_measuring=0}function fps(){return $("#txt-fps").val()}function fit_canvas_to_window(){var a=document.getElementById("imgbox"),b=a.getContext("2d"),c=$(window).height()-$("#clicker").offset().top;console.log("clicker height: "+c),$("#clicker").height(c),b.canvas.width=$("#clicker").width(),b.canvas.height=$("#clicker").height(),load_frame(cur_framenum)}function load_frame(a){var b="../../../data/video/"+experiment_clip_path,d="frame/"+zeroFill(a,4)+".jpg",e=b+"/"+d,f=new Image;f.onload=function(){var a=this.height/this.width,b=c.height/c.width;a<b?(imgwidth=c.width,imgheight=c.height*a/b):(imgwidth=c.width*b/a,imgheight=c.height),ctx.drawImage(this,0,0,imgwidth,imgheight);var d=$("#display-time"),d=$("#display-time"),e=(cur_framenum-1)/fps();$("#display-time").html(e.toFixed(3)+" (s)"),$("#display-frame").html(cur_framenum-1),render_points()},cur_framenum=a,f.src=e}function render_points(){var a=document.getElementById("imgbox"),b=a.getContext("2d"),c=[];b.fillStyle="yellow",$(points).each(function(){b.fillRect(this.px_x(imgwidth)-1,this.px_y(imgheight)-1,3,3),c.push(this.toTuple(scale_known_distance,scale_length_px))}),b.fillStyle="red",scale_start_point&&b.fillRect(scale_start_point.px_x(imgwidth)-1,scale_start_point.px_y(imgheight)-1,3,3),scale_end_point&&b.fillRect(scale_end_point.px_x(imgwidth)-1,scale_end_point.px_y(imgheight)-1,3,3),scale_start_point&&scale_end_point&&(b.strokeStyle="green",b.lineWidth=2,b.beginPath(),b.moveTo(scale_start_point.px_x(imgwidth),scale_start_point.px_y(imgheight)),b.lineTo(scale_end_point.px_x(imgwidth),scale_end_point.px_y(imgheight)),b.stroke())}function load_start_frame(){load_frame(framenum_min)}function load_previous_frame(){var a=Number($("#skip-distance").val());cur_framenum-a>=framenum_min&&load_frame(cur_framenum-a)}function has_previous_frame(){var a=Number($("#skip-distance").val());return cur_framenum-a>=framenum_min}function load_next_frame(){console.log("loading next frame");var a=Number($("#skip-distance").val());cur_framenum+a<=framenum_max&&load_frame(cur_framenum+a)}function has_next_frame(){var a=Number($("#skip-distance").val());return cur_framenum+a<=framenum_max}function set_scale_length(a){scale_length_px=a}function set_scale(){scale_length_px=scale_end_point.distance_to(scale_start_point),scale_known_distance=Number($("#scale-distance-known").val()),scale_known_units=$("#scale-distance-units").val(),$.post("/experiments/"+experiment_id+"/set_scale/",{scale:{x0:scale_start_point.x,y0:scale_start_point.y,x1:scale_end_point.x,y1:scale_end_point.y,measured_length:scale_known_distance,measured_units:scale_known_units}},function(a){console.log("posted scale")})}function start_recording(){is_recording=1}function click_handler(a){var b=1*(a.pageX-$("#imgbox").offset().left),c=1*(a.pageY-$("#imgbox").offset().top),d=b/imgwidth,e=c/imgheight;if(is_measuring)scale_start_point==null?(scale_start_point=new DataPoint(0,0,d,e),render_points()):scale_end_point==null&&(scale_end_point=new DataPoint(0,0,d,e),render_points(),set_scale_length(scale_end_point.distance_to(scale_start_point)),stop_measuring());else if(is_recording){var f=(cur_framenum-1)/fps(),g=new DataPoint(cur_framenum,f,d,e);$.post("/experiments/"+experiment_id+"/add_datum/",{datum:{frame:cur_framenum,time:f,x:d,y:e}},function(a){console.log("submitted datum: "+a)}),points.push(g),has_next_frame()?load_next_frame():(is_recording=0,render_points())}else console.log("unexpected click event state")}function ajax_load_data(){$.ajax({type:"GET",dataType:"json",url:"/experiments/"+experiment_id+"/data.json",success:function(a){console.log("received existing data points, n = "+a.length),$.each(a,function(){console.log("loading datum: "+this.frame+", "+this.time+", "+this.x+", "+this.y),points.push(new DataPoint(this.frame,this.time,this.x,this.y))})},complete:function(){ajax_load_scale()}})}function ajax_load_scale(){$.ajax({type:"GET",dataType:"json",url:"/experiments/"+experiment_id+"/scales.json",success:function(a){console.log("received existing scale, n = "+a.length),a.length>0&&(s=a[0],scale_start_point=new DataPoint(0,0,s.x0,s.y0),scale_end_point=new DataPoint(0,0,s.x1,s.y1),scale_length_px=s.measured_length,scale_known_units=s.measured_units,$("#scale-distance-known").val(s.measured_length),$("#scale-distance-units").val(s.measured_units))},complete:function(){finish_init()}})}function finish_init(){start_recording(),fit_canvas_to_window()}var c,ctx,framenum_min,framenum_max,initial_fps,is_measuring,scale_start_point,scale_end_point,scale,cur_framenum,points,imgwidth,imgheight,scale_length_px,scale_known_distance,scale_known_units,is_recording,experiment_id,experiment_clip_path;