// Step 1: Set up our chart
//= ================================

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 100,
    bottom: 100,
    left: 120
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "date";
var chosenYAxis  = "year1";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 1,
            d3.max(data, d => d[chosenXAxis]) * 1])
        .range([0, width]);
    // console.log("X:",d3.min(data, d => d[chosenXAxis]));

    return xLinearScale;
  
}
// function used for updating y-scale var upon click on axis label

function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()

        .domain([0,
        d3.max(data, d => d['year1']) * 1 ])
        .range([height, 0]);
    // console.log("Y:",d3.min(data, d => d[chosenYAxis]));
    return yLinearScale;
  
}
// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis  = d3.axisLeft(newYScale);

    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

// function used for updating circles group with a transition to new circles

function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
}
// function used for updating the State labels
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
      .duration(2000)
      .attr('x', d => newXScale(d[chosenXAxis]))
      .attr('y', d => newYScale(d[chosenYAxis]));

    return textGroup
}

// function used for styling XAxis
function styleXAxis(value, chosenXAxis) {

    if (chosenXAxis === 'date') {
        return `${value}`;
    }
    
  
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenYAxis, circlesGroup) {
// updating XAxis labels
     // date
    if (chosenXAxis === "date") {
        var xLabel = "Day of the month:";
    }
    
// updating YAxis labels

     // year 2019 total pedestrians
    if (chosenYAxis === "year1") {
    var yLabel = "No pedestrians:";
    }
    
    else  {
            var yLabel = "year2:";
        }

    var toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([80,-60])
        .html(function(d) {
            return (`${xLabel} ${styleXAxis(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}`);
     });

  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", toolTip.show)
    // onmouseout event
        .on("mouseout",toolTip.hide)
        
        return circlesGroup;
}

  // Retrieve data from the CSV file and execute everything below

  d3.csv("assets/data/data.csv").then(function (data, err) {
     if (err) throw err;

    // parse data
    data.forEach(function(data) {
        data.date = +data.date;
        data.year1 = +data.year1;
        data.year2 = +data.year2;
            });
    
    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);
    // console.log("1")
    
    // Create initial axis functions
    var tickValues = data.map(function(d){return d.date;});
    var bottomAxis = d3.axisBottom(xLinearScale).tickValues(tickValues);
    var leftAxis = d3.axisLeft(yLinearScale);
   
    
   // Step 7: Append the axes to the chartGroup
   // ==============================================
    // Add bottomAxis

    // var xAxis = chartGroup.append("g")
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    
    // Add leftAxis to the left side of the display
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
        .call(leftAxis);
    //  console.log("4")
       
    // Step 8: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .classed("dataCircle", true)
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", "14")
            
    
    var textGroup = chartGroup.selectAll('.stateText')
        .data(data)
        .enter()
        .append('text')
        .classed('stateText', true)
        .attr('x', d => xLinearScale(d[chosenXAxis]))
        .attr('y', d => yLinearScale(d[chosenYAxis]))
        .attr('dy', 4)
        .attr('dx', -1)
        .attr('font-size', '10px')
        .text(function(d){return d.date})

     // Create group for the Xaxis labels
    
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20 })`);
        

    var yearLabel = xLabelsGroup.append("text")
        .classed('aText', true)
        .classed("active", true)
        .attr("x", -1)
        .attr("y", 20)
        .attr("value", "date") // value to grab for event listener
        
        // .classed('aText', true)
        .text("Day of the Month");

    // Create group for the Y axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr('transform', `translate(${0 - margin.left/2}, ${height/2})`);

 // append Y axis

    var year1Label = yLabelsGroup.append('text')
        .classed('aText', true)
        .classed("active", true) 
        .attr("x", 0)
        .attr("y", 0 - 20)
        .attr("value", "year1") // value to grab for event listener
        .attr('dy', '1em')
        .attr('transform', 'rotate(-90)')
        .text("Pedestrians Aug (2019)");
    
    var year2Label  = yLabelsGroup.append('text')
        .classed('aText', true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 -40)
        .attr("value", "year2") // value to grab for event listener
        .attr('dy', '1em')
        .attr('transform', 'rotate(-90)')
        .text("Pedestrians Aug (2020)");

        
// updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    // console.log("5")
    // x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(data, chosenXAxis);

            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

             // updates circles with new  values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);

            //update text 
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // changes classes to change bold text
    if (chosenXAxis === "Day of the Month") {
        dateLabel
            .classed("active", true)
            .classed("inactive", false);
    }
     }
    
    });

    // Y axis labels event listener

    yLabelsGroup.selectAll("text")
        .on("click", function() {
       
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

            // replaces chosenXAxis with value
            chosenYAxis = value;
            
            // functions here found above csv import
            // updates y scale for new data
            yLinearScale = yScale(data, chosenYAxis);

            // updates y axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

             // updates circles with new  values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //update text 
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

             // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenYAxis === "year1") {
                
                year2Label
                    .classed("active", false)
                    .classed("inactive", true);
                year1Label
                    .classed("active", false)
                    .classed("inactive", true);
    }
     
     }
    
    });

    })
