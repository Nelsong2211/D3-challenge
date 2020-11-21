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

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Import our .csv file.
// ========================
d3.csv("/assets/data/data.csv").then(function(smokeData) {
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    smokeData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });
      console.log(smokeData);
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(smokeData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(smokeData, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(smokeData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "12")
      .attr("fill", "lightblue")
      .attr("opacity", ".5")
      .attr("stroke", "white");

    //Create text labels with state abbreviation for each circle
    chartGroup.append("text")
    .style("text-anchor", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "8px")
    .selectAll("tspan")
    .data(smokeData)
    .enter()
    .append("tspan")
    .attr("x", function(data) {
      return xLinearScale(data.poverty);
  })
  .attr("y", function(data) {
      return yLinearScale(data.healthcare -.02);
  })
  .text(function(data) {
      return data.abbr
  });

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -70])
        .style("position", "absolute")
        .style("background", "lightsteelblue")
        .style("pointer-events", "none")
      .html(function(d) {
        return (`${d.state}<br>Population inPoverty (%): ${d.poverty}<br>healthcare (%): ${d.healthcare}`)
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });


    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left -5)
      .attr("x", 0 - (height / 1.30))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Healthcare service");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty (%)");

});