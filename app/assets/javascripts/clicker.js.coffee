# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

# put DataPoint in the global scope in order to make it accessible to clicker/index.html
@DataPoint = class DataPoint

  constructor: (@frame, @time, @x, @y) ->

  px_x: (imgwidth) -> @x * imgwidth

  px_y: (imgheight) -> @y * imgheight

  px_toHtml: (imgwidth, imgheight) ->
    "T (s) = " + @time.toFixed(2) + ", x = " + Math.floor(@px_x(imgwidth)) + ", y = " + Math.floor(@px_y(imgheight))

  px_toTableRow: () -> @toTableRow(1,1)

  toTableRow: (known_dx_scaled, known_dx_image) ->
    s = known_dx_scaled / known_dx_image
    "<tr><td>" + @time.toFixed(2) + "</td><td>" + (@x * s).toFixed(2) + "</td><td>" + (@y * s).toFixed(2) + "</td></tr>"

  toTuple: (known_dx_scaled, known_dx_image) ->
    s = known_dx_scaled / known_dx_image
    [@t, @x * s, @y * s]

  distance_to: (B) ->
    dx = @x - B.x
    dy = @y - B.y
    Math.sqrt(dx*dx + dy*dy)

