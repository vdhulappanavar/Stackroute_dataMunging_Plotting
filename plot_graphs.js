function plot_age_map_graph(){
    var margin = {top: 20, right: 20, bottom: 70, left: 80},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


    // set the ranges
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    // define the axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")


    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5);


    // add the SVG element
    var svg = d3.select("#age_map_graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");
    

    // load the data
    d3.json("age_map.json", function(error, data) {
        console.log(error)
        console.log(data)
        data.forEach(function(d) {
            d.age_group = d.age_group;
            d.number = +d.number;
        });
        
    // scale the range of the data
    x.domain(data.map(function(d) { return d.age_group; }));
    console.log(x.domain)
    y.domain([0, d3.max(data, function(d) { return d.number; })]);

    // add axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("numberuency");


    // Add bar chart
    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.age_group); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.number); })
        .attr("height", function(d) { return height - y(d.number); });

    });
}

function plot_education_category_graph(){
    var margin = {top: 20, right: 20, bottom: 70, left: 80},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


    // set the ranges
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    // define the axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")


    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);


    // add the SVG element
    var svg = d3.select("#education_category_graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");
    

    // load the data
    d3.json("education_category.json", function(error, data) {
        console.log(error)
        console.log(data)
        data.forEach(function(d) {
            d.Education_Category = d.Education_Category;
            d.number = +d.number;
        });
        
    // scale the range of the data
    x.domain(data.map(function(d) { return d.Education_Category; }));
    console.log(x.domain)
    y.domain([0, d3.max(data, function(d) { return d.number; })]);

    // add axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("numberuency");


    // Add bar chart
    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.Education_Category); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.number); })
        .attr("height", function(d) { return height - y(d.number); });

    });
}

function plot_graphs()
{
    plot_age_map_graph();
    plot_education_category_graph();
}

window.onload = plot_graphs;