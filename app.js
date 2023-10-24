


function assignment9(){
  
    var filePath="data_cleaned.csv";
    question0(filePath);
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);


}

var question0=function(filePath){
 
    d3.csv(filePath).then(function(data){
        console.log(data)
    });
}

var question1=function(filePath){
  d3.csv(filePath).then(function(data){
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 2000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;
    console.log(data)

// append the svg object to the body of the page
var svg = d3.select("#plot_1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
   .call(d3.zoom().on("zoom", function () { svg.attr("transform", d3.zoomTransform(this))}))
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
    
    a = d3.group(data, d => d.listed_in )
    year = []
    kind= []
    for (let i of data) {
       year.push(i.release_year)
       kind.push(i.listed_in)
      }
      console.log(year)
      console.log(kind)
      let y = [...new Set(year)];
      let k = [...new Set(kind)];
      console.log(k);
      var tooltip = d3.select("#plot_1").append("div").style("opacity", 0).attr("class", "tooltip1").style("position", "absolute")
      .style("border", "solid");

      var xScale = d3.scaleBand()
      .domain(k)
      .range([margin.left, width - margin.right])
      .padding(0.1);
      var yScale = d3.scaleBand()
      .domain(y)
      .range([height - margin.bottom,margin.top]);
      var mouseover = function(d) {
        tooltip.style("opacity", 1)
    
      };
      var mouseleave = function(d) {
        tooltip.style("opacity", 0)
      };
      svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return xScale(d.listed_in) } )
        .attr("cy", function(d) { return yScale(d.release_year) } )
        .attr("r", 2.5)
        .attr("fill", "#69b3a2")
        .on("mouseover", mouseover )
        .on("mousemove", function(e,d){  
          tooltip.html(d.title).style("top", d3.pointer(e)[1]+250+"px").style("left",d3.pointer(e)[0]+1000+"px")
        })
        .on("mouseleave", mouseleave);
     
      svg.append("g")
      .attr("class", "x_axis")
      .call(d3.axisBottom(xScale))
      .attr("transform", "translate(-10," + 930 + ")")
      .style('font-size', '8px')
      .selectAll('text')
      .attr('transform', 'rotate(-25)');

      svg.append("g")
      .attr("class", "y_axis")
      .call(d3.axisLeft(yScale))
      .attr("transform", "translate(50," + -5 + ")")
      .style('font-size', '5px')
      .selectAll('text')
      .attr('transform', 'rotate(-15)'); 
      for (let i=0; i<1; i++) {
        svg.append("circle")
          .attr("cx",1850)
          .attr("cy", 130 + i * 30)
          .attr("r", 5)
          .style("fill", '#69b3a2')
        svg.append("text")
        .attr("x", 1900)
        .attr("y", 130 + i * 30)
        .text('Movie/Show')
        .style("font-size", "15px")
        .attr("alignment-baseline","middle")

      svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", 1950)
      .attr("y", 950)
      .text("Types");
      svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", -250)
          .attr("y", 5)
          .attr("transform", "rotate(-90)")
          .text("Year");
      svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", 900)
          .attr("y", 50)

          .text("Scatter Plot");
      }

});

}
    
var question2=function(filePath){
  d3.csv(filePath).then(function(data){
    
    var svgheight = 800;
			var svgwidth = 1500;
			var padding = 30;
      a =d3.rollup(data, v => Object.keys(v).length, d => d.listed_in)
      kind = Array.from(a.keys())
      ar = []
      for (const i of a) {
        d = {}
        d['type'] = i[0]
        d['count'] = i[1]
       ar.push(d)
      }
      console.log(ar)
			var xScale = d3.scaleBand()
      .domain(kind)
      .padding(0.2)
      .range([50,svgwidth-padding]);

			var yScale = d3.scaleLinear().domain([d3.min(ar, function(d){return d.count}),
        d3.max(ar, function(d){return d.count})
       ]).range([ svgheight-padding,padding]);

			var svg = d3.select("#plot_2").append("svg")
							.attr("width", svgwidth)
							.attr("height", svgheight);
      svg.selectAll("mybar")
      .data(ar)
      .enter()
      .append("rect")
        .attr("x", function(d) { return xScale(d.type); })
        .attr("y", function(d) { return yScale(d.count); })
        .attr("height", function(d) { return 770-yScale(d.count); }) // always equal to 0
        .attr("width", xScale.bandwidth())
        .attr("fill", "#69b3a2")
      // x轴
      svg.append("g")
      .attr('class','q2x')
        .attr("transform", "translate(0," + 770+ ")")
        .call(d3.axisBottom(xScale))
        .style('font-size', '8px')
        .selectAll('text')
        .attr('transform', 'rotate(-15)')
      svg.append("g")
       .attr('class','q2y')
        .call(d3.axisLeft(yScale))
        .attr("transform", "translate(50," + 0+ ")")
        .style('font-size', '10px')
        .selectAll('text')
        .attr('transform', 'rotate(-15)');


        var isDescending = false
        const sortBars = function(){
        isDescending = !isDescending
        svg.selectAll('.bar')
            .sort(function(a, b){if (isDescending){return d3.ascending(b.count,a.count)}else{return d3.ascending(a.count,b.count)}}) 
            .transition("sorting")
            .duration(1000)
            .attr('y', (d, i) => {
                return yScale(i)
            })
        }
        console.log(ar)
// select the "Sort me" button and define the interaction
  d3.select('#sort_button')
  .on('click', function(){ 
    isDescending = !isDescending
    if(isDescending){
      newd = ar.sort(function(a, b){return d3.ascending(b.count,a.count)})
    }else{
      newd = ar.sort(function(a, b){return d3.ascending(a.count,b.count)})
    }
    var xScale = d3.scaleBand()
    .domain(newd.map(d=>d.type))
    .padding(0.2)
    .range([50,svgwidth-padding]);
    svg.select('.q2x')
    .transition()
    .call(d3.axisBottom(xScale))
    .attr("transform", "translate(0," + 770+ ")")
    .style('font-size', '8px')
    .selectAll('text')
    .attr('transform', 'rotate(-15)');
    svg.selectAll('rect').data(newd)
    .transition()
    .duration(1000)
    .attr('x', (d, i) => {
      return xScale(d.type)
  })
    .attr('y', (d, i) => {
        return yScale(d.count)
    })
    .attr("height", function(d) { return 770-yScale(d.count); }) // always equal to 0
    .attr("width", xScale.bandwidth())
  



  });
  svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", 1500)
      .attr("y", 760)
      .text("Types");
      svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", -30)
          .attr("y", 30)
          .attr("transform", "rotate(-90)")
          .text("Total");
      svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", 900)
          .attr("y", 50)

          .text("Bar Chart");
         
      
       
    
								
  })}

  var question3=function(filePath){
    d3.csv(filePath).then(function(data){
      var svgheight = 800;
			var svgwidth = 2000;
      var padding =25;
			var svg = d3.select("#plot_3").append("svg")
      .attr("width", svgwidth)
      .attr("height", svgheight);
  
    var colors = ["red", "orange"]
    // s = ['listed_in', 'director', 'total']
    dr = []
    var a = d3.rollups(data, v => Object.keys(v).length, d => d.country, d => d.type
    )
    final = []
    console.log(a)
    for (const i in a) {
      d = {}
      if(a[i][0] !== 'unknown'){
      d['country']=a[i][0]
      dr.push(a[i][0])
      if (a[i][1].includes('TV Show') == false){
        d['TV Show'] = 0
      }
      if (a[i][1].includes('Movie') == false){
        d['Movie'] = 0
      }

     for (const j of a[i][1]) {
      d[j[0]] = j[1]
     }
     final.push(d)
    } }
    console.log(final)
    var stacked = d3.stack().keys(['TV Show','Movie'])(final)
    var xScale = d3.scaleBand()
    .domain(dr) //notice how the domain is set
    .range([50,svgwidth])
    .padding([0.1]);
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(final,d=>  (d.Movie) + (d['TV Show']))])
    .range([ svgheight-padding, padding]);
console.log(yScale(0))
    var groups = svg.selectAll(".gbars")
    .data(stacked).enter().append("g")
    .attr("class","gbars")
    .attr('fill',function(d,i){return colors[i]})
    var rects = groups.selectAll("rect")
    .data(function(d){
      return d;
  }).enter().append("rect")
    .attr('x',function(d,i){return xScale(d.data.country)})
    .attr('y',function(d){return  yScale(d[1])})
    .attr('width',xScale.bandwidth())
    .attr('height',d => yScale(d[0])-yScale(d[1]));
          // x轴
    svg.append("g")
    .attr("transform", "translate(0," + (svgheight-padding)+ ")")
    .call(d3.axisBottom(xScale))
    .style('font-size', '8px')
    .selectAll('text')
    .attr('transform', 'rotate(-15)')
  svg.append("g")
    .call(d3.axisLeft(yScale))
    .attr("transform", "translate(50," + 0+ ")")
    .style('font-size', '10px')
    .selectAll('text')
    .attr('transform', 'rotate(-15)')   

    svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 2000)
    .attr("y", 760)
    .text("Countries");
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", -30)
        .attr("y", 30)
        .attr("transform", "rotate(-90)")
        .text("Total");
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 900)
        .attr("y", 50)
        .text(" Stacked Bar Chart");
    
  for (let i=0; i<2; i++) {
  svg.append("circle")
    .attr("cx",650)
    .attr("cy", 130 + i * 30)
    .attr("r", 3)
    .style("fill", colors[i]);
  svg.append("text")
  .attr("x", 700)
  .attr("y", 130 + i * 30)
  .text(["Movie","TV Show"][i])
  .style("font-size", "10px");
  }
  
  })}

  var question4 = function(filePath){
    d3.csv(filePath).then(function(data){
      var svgheight = 800;
			var svgwidth = 2000;
      var padding =25;
			var svg = d3.select("#plot_4").append("svg")
      .attr("width", svgwidth)
      .attr("height", svgheight)
      .attr('fill','lightgrey');
      
      var a = d3.rollups(data, v => Object.keys(v).length, d => d.country)
      console.log(a)
      const projection1  = d3.geoNaturalEarth1()
      .scale(200)
      .translate([svgwidth/2,svgheight/2]);
      //chain translate and scale
      const pathgeo1 = d3.geoPath().projection(projection1)
      const world = d3.json("world.json");
      console.log(d3.min(a,d=>d[1]))
      var cScale = d3.scaleSequential(d3.interpolatePurples).domain([0,d3.max(a,d=>d[1])])
      var tooltip = d3.select("#plot_4").append("div").style("opacity", 0.5).attr("class", "tooltip").style("position", "absolute").style("background-color", "pink")
      
      world.then(function(map){
        d = {}
        for (let i=0; i<a.length; i++) {
          if(a[i][0]=='United States'){
            d['USA'] = a[i][1]
          }else{
          d[a[i][0]] = a[i][1]
          }
        } 
        console.log(d)
        svg.selectAll('path').data(map.features)
        .enter()
        .append('path')
        .attr('d',pathgeo1)
        .attr("fill", function(x) {
          return cScale(d[x.properties.name])})
        .on("mouseover", function(e,x){  
          tooltip.style("opacity", 0)
          d3.select(this)
				  			.attr("fill", "orange")
        })
        .on("mousemove", function(e,x){ 
          tooltip.html(x.properties.name).style("left",d3.pointer(e)[0]+800+"px").style("top",d3.pointer(e)[1]+4000+"px")
   
        })
        .on("mouseout",function (e, x) {
         tooltip.style("opacity", 1)
         d3.select(this)
         .transition()
         .duration(2000)
           .attr("fill", function(x) {
            return cScale(d[x.properties.name])})

     

      });
      minmax=[]
      svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 900)
      .attr("y", 50)
      .text("Geomap")
      .style("font-size", "16px")
      .style("fill", "black");
      for (const i in d) {
       minmax.push(d[i])
      }
    for (let i = 300; i < 3000; i++) {
     minmax.push(i)
        
    }
      minmax =  minmax.sort((a, b) => a - b);;
      console.log(minmax)
    let l_width = 20;
    let l_height = 20;
    let y_hei = 200
   var neww = svgwidth / 5
  var newh = svgheight / 10
    var yScale = d3.scaleLinear().domain([d3.min(minmax),d3.max(minmax)]).range([ y_hei,50]);
    svg.selectAll('rect').data(minmax).enter()
    .append("rect")
    .attr('x','20')
    .attr('y',d=>yScale(d))
    .attr("width", 20)
    .attr("height", 20)
    .attr("class", "legend")
    .attr("fill",function(d){return cScale(d)});
    var y = d3.scaleLinear().range([y_hei, 50]).domain([d3.min(minmax),d3.max(minmax)]);
    var yAxis = d3.axisRight(y);
    svg.append("g").attr("class", "y axis").attr("transform", "translate(40,10)").call(yAxis);


   
    })

    })}
    var question5 = function(filePath){
      d3.csv(filePath).then(function(data){
      

        var svgheight = 800;
        var svgwidth = 2000;
        var padding =25;
        var svg = d3.select("#plot_5").append("svg")
        .attr("width", svgwidth)
        .attr("height", svgheight)
        .attr('fill','lightgrey');
        console.log()

        var a = d3.rollup(data,  (function(d) {
          q1 = d3.quantile(d.map(function(g) { return parseFloat(g.release_year)}).sort(d3.ascending),.25)
          median = d3.quantile(d.map(function(g) { return parseFloat(g.release_year)}).sort(d3.ascending),.5)
          q3 = d3.quantile(d.map(function(g) { return parseFloat(g.release_year)}).sort(d3.ascending),.75)
          interQuantileRange = q3 - q1
          min = q1 - 1.5 * interQuantileRange
          max = q3 + 1.5 * interQuantileRange
          return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        }), d=>d.type)
        console.log(a)
        kind = ['Movie','TV Show']
        var x = d3.scaleBand()
        .range([ 0, svgwidth ])
        .domain(["Movie", "TV Show"])
        .paddingInner(1)
        .paddingOuter(.5)
 
        var y = d3.scaleLinear()
        .domain([2003, d3.max(a, d=>d[1].max)])
        .range([svgheight-50, 50]);
        console.log( d3.max(a, d=>d[1].min))
        svg
        .selectAll("vertLines")
        .data(a)
        .enter()
        .append("line")
          .attr("x1", function(d){return x(d[0])})
          .attr("x2", function(d){return(x(d[0]))})
          .attr("y1", function(d){return(y(d[1].min))})
          .attr("y2", function(d){return(y(d[1].max))})
          .attr("stroke", "black")
          .style("width", 100);
        var boxWidth = 100
        svg
          .selectAll("boxes")
          .data(a)
          .enter()
          .append("rect")
              .attr("x", function(d){return(x(d[0])-boxWidth/2)})
              .attr("y", function(d){return(y(d[1].q3))})
              .attr("height", function(d){return(y(d[1].q1)-y(d[1].q3))})
              .attr("width", boxWidth )
              .attr("stroke", "black")
              .style("fill", "#69b3a2");
        svg
        .selectAll("medianLines")
        .data(a)
        .enter()
        .append("line")
          .attr("x1", function(d){return(x(d[0])-boxWidth/2) })
          .attr("x2", function(d){return(x(d[0])+boxWidth/2) })
          .attr("y1", function(d){return(y(d[1].median))})
          .attr("y2", function(d){return(y(d[1].median))})
          .attr("stroke", "black")
          .style("width", 80)
        svg.append("g")
          .attr("transform", "translate(0," + 750 + ")")
          .call(d3.axisBottom(x))
          .style('font-size', '30px');
        svg.append("g").call(d3.axisLeft(y))
        .attr("transform", "translate(70," + 0 + ")")
        .style('font-size', '15px');
        svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", 2000)
        .attr("y", 740)
        .style("fill", "black")
        .text("Type");
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", -30)
            .attr("y", 30)
            .attr("transform", "rotate(-90)")
            .style("fill", "black")
            .text("Year");
        svg.append("text")
        .style("font-size", "16px")
        .style("fill", "black")
            .attr("x", 900)
            .attr("y", 50)
            .text("Box Plot");

          
        
      
      })   
}
  
    
