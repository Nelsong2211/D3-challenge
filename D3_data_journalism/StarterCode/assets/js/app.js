// @TODO: YOUR CODE HERE!

// Pre-Data Setup
// ===========================
// Before we code any data visualizations,
// we need to at least set up the width, height and margins of the graph.

// Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width - width / 3;

// Margin spacing for graph
var margin = 20;

// Create the actual canvas for the graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Set the radius for each dot that will appear in the graph.
var circRadius = 10;

//  X Axis
// ==============
//  Poverty
svg.append("g")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x");

// Y Axis
// ============
//  Healthcare
svg.append("g")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y");

// Import our .csv file.
// ========================
d3.csv("assets/data/data.csv").then(function(data) {
  // Visualize the data
  visualise(data);
});

// Create our visualization function
// ====================================
// This function handles the visual manipulation of all elements dependent on the data.
function visualise(theData) {
  // curX and curY determine what data is represented in each axis.
  // the headings name is in their matching .csv data file.
  var curX = "poverty";
  var curY = "healthcare";

  // We also save the min and max values of x and y.
  var xMin = d3.min(theData, function(d) {
    return parseFloat(d[curX]) * 0.90;
  });;
  var xMax = d3.max(theData, function(d) {
    return parseFloat(d[curX]) * 1.10;
  });;
  var yMin = d3.min(theData, function(d) {
    return parseFloat(d[curY]) * 0.90;
  });;
  var yMax = d3.max(theData, function(d) {
    return parseFloat(d[curY]) * 1.10;
  });;


  // With the min and max values now defined, we can create our scales.
  // Notice in the range method how we include the margin.
  // This tells d3 to place our circles in an area starting after the margin.
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    // Height is inverses due to how d3 calc's y-axis placement
    .range([height - margin , margin]);

  // We pass the scales into the axis methods to create the axes.
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // This function allows us to set up tooltip rules.
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      // Grab the state name.
      var theState =  d.state + " ";
      // Snatch the y value's key and value.
      var theY = curY + " : " + d[curY];
      // Display what we capture.
      return theState + theY;
    });
  // Call the toolTip function.
  svg.call(toolTip);

  // We append the axes in group elements. By calling them, we include
  // all of the numbers, borders and ticks.
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin ) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin ) + ", 0)");

  // Now let's make a grouping for our dots and their labels.
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  // We append the circles for each row of data (or each state, in this case).
  theCircles
    .append("circle")
    // These attr's specify location, size and class.
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    // Hover rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove the tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });

  
}
