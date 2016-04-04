var data = []

var margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom

var x = d3.scale.linear()
    .domain([0, 255])
    .range([0, width])

var y = d3.scale.linear()
    .domain([0, 255])
    .range([height, 0])

var line = d3.svg.line()
    .x(function(d, i) { return x(d.x) })
    .y(function(d, i) { return y(d.y) })

var svg = d3.select('#chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + y(0) + ')')
    .call(d3.svg.axis().scale(x).orient('bottom'))

svg.append('g')
    .attr('class', 'y axis')
    .call(d3.svg.axis().scale(y).orient('left'))


var path = svg.append('path')
var drawn = false
function draw() {
  drawn = true
  data = [{x:0,y:0},{x:64, y:64,},{x:192,y:192},{x:255,y:255}]
  path.datum(data)
  path.attr('class', 'line')
    .attr('d', line)
}

function update() {
  if(!drawn){
    draw()
  }
  data[1] = {x:64, y:255}
  data[2] = {x:192, y:0}
  path.transition()
      .duration(500)
      .ease('linear')
      .attr('d', line)
}


window.addEventListener('draw', draw)
window.addEventListener('update', update)