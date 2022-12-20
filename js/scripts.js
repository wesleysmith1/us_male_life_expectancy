var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 760 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
            
var x = d3.scaleLinear()
  .domain([1960, 2020])
  .range([ 0, width ])
  
  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).tickFormat(x => x));

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 100])
  .range([ height, 0 ]);
svg.append("g")
  .call(d3.axisLeft(y));

var line = svg.append("path")
  .datum({})
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(function(d) { return x(d.x) })
    .y(function(d) { return y(d.y) })
    )

var upperRange = 2020
var countryIndex = 0
var csvData = null

function createSelect() {

  for (d in csvData) {
    let selectList = document.getElementById("countries")
    let option = document.createElement("option");
    option.value = d;
    option.text = csvData[d]['Country Name'];
    selectList.appendChild(option);
  }

}

function buildChart() {

    unitedStates = csvData[countryIndex]

    let lineData = []

    for (let i  = 1960; i <= upperRange; i++) {
      lineData.push({x: i, y: +unitedStates[i]})
    }

    // update the line
    line.datum(lineData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.x) })
        .y(function(d) { return y(d.y) })
        )
}

d3.csv("http://127.0.0.1:5500/data/life_expectancy_male.csv",

  function(data) {

    csvData = data

    unitedStates = data[countryIndex]

    let lineData = []

    for (let i  = 1960; i <= upperRange; i++) {
      lineData.push({x: i, y: +unitedStates[i]})
    }

    buildChart()
    createSelect()
})

document.getElementById("myRange").addEventListener("input", function() {
  upperRange = this.value
  document.getElementById("year").innerText = this.value;
  buildChart()
});

document.getElementById("countries").addEventListener("change", function() {
  countryIndex = this.value;
  document.getElementById("title").innerText = csvData[this.value]['Country Name'];
  buildChart()
});

document.getElementById("animationBtn").addEventListener("click", function() {
  upperRange = 1960
  let interval = setInterval(() => {
    buildChart()
    
    upperRange++
    if (upperRange == 2020) clearInterval(interval)
  }, 100)
});