var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("D3_data_journalism/assets/data/data.csv").then(function(sourceData) {

    //Parse Data/Cast as numbers
    sourceData.forEach(function(data) {
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });

    //Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(sourceData, d => d.smokes)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(sourceData, d => d.obesity)])
      .range([height, 0]);

    //Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    //Create Circle Labels
    sourceData.forEach(d =>
        chartGroup.selectAll("text")
        .data(sourceData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.smokes))
        .attr("y", d => yLinearScale(d.obesity))
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
    );

    //Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(sourceData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.smokes))
    .attr("cy", d => yLinearScale(d.obesity)-3)
    .attr("r", "10")
    .attr("fill", "blue")
    .attr("opacity", ".25")

    // Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([100, 40])
      .html(function(d) {
        return (`State: ${d.state}<br>Smokes ${d.smokes}%<br>Obesity: ${d.obesity}%`);
      });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listener to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity %");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Smokes %");
  }).catch(function(error) {
    console.log(error);
  });
