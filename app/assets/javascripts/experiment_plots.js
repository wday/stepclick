function update_selected_display(x,xid,y,yid,slope) {
  $('span#select-x').html(""+x.toFixed(3));
  $('span#select-x-id').html(""+xid);
  $('span#select-y').html(""+y.toFixed(3));
  $('span#select-y-id').html(""+yid);
  $('span#select-slope').html(""+slope.toFixed(3));
}

function update_plot() {
  
  var new_colids = {}
  $.each(gon.particles, function(i,p) {
    new_colids[p.id] = [];
    $("input[particle_id=" + p.id  + "]:checked").each( function(j,el) {
      new_colids[p.id].push($(el).attr("id"));
    });
  });

  var params = { 
    type: "PUT",
    url: "/experiments/" + gon.experiment.id,
    data: { experiment: {} } 
  }
  // since plot can be rendered for different contexts, we need to look up
  // where to store the selected colids from the controller provided storage column id
  params.data.experiment[gon.colid_storage_column] = JSON.stringify(new_colids);
  $.ajax(params).done( function (data) {
    gon.colids = new_colids;
    show_selected_plots();
  });
}

function show_selected_plots() {
  $("svg [class^=par]").hide();
  $("svg [class^=par]").hide();

  $.each( gon.colids, function(particle_id,column_ids) {
    $.each(column_ids, function(j,id) {
      $("input[particle_id=" + particle_id + "][id=" + id + "]").attr('checked',true);
      $("svg [class=par" + particle_id + "circle_" + id + "]").show(1000);
      $("svg [class=par" + particle_id + "path_" + id + "]").show(1000);
    });
  });
}
