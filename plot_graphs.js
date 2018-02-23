function plotAgeMapGraph() {
  let margin = {
      top: 20, right: 20, bottom: 70, left: 80,
    },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


  // set the ranges
  const x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);

  const y = d3.scale.linear().range([height, 0]);

  // define the axis
  const xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');


  const yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(5);


  // add the SVG element
  const svg = d3.select('#age_map_graph').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left},${margin.top})`,
    );


  // load the data
  d3.json('age_map.json', (error, data) => {
    console.log(error);
    console.log(data);
    data.forEach((d) => {
      d.age_group = d.age_group;
      d.number = +d.number;
    });

    // scale the range of the data
    x.domain(data.map(d => d.age_group));
    console.log(x.domain);
    y.domain([0, d3.max(data, d => d.number)]);

    // add axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '-.55em')
      .attr('transform', 'rotate(-90)');

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 5)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('numberuency');


    // Add bar chart
    svg.selectAll('bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.age_group))
      .attr('width', x.rangeBand())
      .attr('y', d => y(d.number))
      .attr('height', d => height - y(d.number));
  });
}

function ploEducationCategoryGraph() {
  let margin = {
      top: 20, right: 20, bottom: 70, left: 80,
    },
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


  // set the ranges
  const x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);

  const y = d3.scale.linear().range([height, 0]);

  // define the axis
  const xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');


  const yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(10);


  // add the SVG element
  const svg = d3.select('#education_category_graph').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left},${margin.top})`,
    );


  // load the data
  d3.json('education_category.json', (error, data) => {
    console.log(error);
    console.log(data);
    data.forEach((d) => {
      d.Education_Category = d.Education_Category;
      d.number = +d.number;
    });

    // scale the range of the data
    x.domain(data.map(d => d.Education_Category));
    console.log(x.domain);
    y.domain([0, d3.max(data, d => d.number)]);

    // add axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '-.55em')
      .attr('transform', 'rotate(-90)');

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 5)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('numberuency');


    // Add bar chart
    svg.selectAll('bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.Education_Category))
      .attr('width', x.rangeBand())
      .attr('y', d => y(d.number))
      .attr('height', d => height - y(d.number));
  });
}
function lineGraph() {
  let svg = d3.select('#lineGraph'),
    margin = {
      top: 20, right: 20, bottom: 30, left: 50,
    },
    width = +svg.attr('width') - margin.left - margin.right,
    height = +svg.attr('height') - margin.top - margin.bottom,
    g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const parseTime = d3.timeParse('%d-%b-%y');

  const x = d3.scaleTime()
    .rangeRound([0, width]);

  const y = d3.scaleLinear()
    .rangeRound([height, 0]);

  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.close));

  d3.tsv('data.tsv', (d) => {
    d.date = parseTime(d.date);
    d.close = +d.close;
    return d;
  }, (error, data) => {
    if (error) throw error;

    x.domain(d3.extent(data, d => d.date));
    y.domain(d3.extent(data, d => d.close));

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .select('.domain')
      .remove();

    g.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Price ($)');

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  });
}

function plotGraphs() {
  plotAgeMapGraph();
  ploEducationCategoryGraph();
}

window.onload = plotGraphs;
