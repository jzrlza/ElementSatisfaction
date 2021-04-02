import define1 from "./450051d7f1174df8@252.js";

export default function define(runtime, observer) {
  const main = runtime.module();

  const root_url = "https://nervous-payne-f830e5.netlify.app/";
  //const root_url = "http://localhost/visual_d3_elementals/";

  const fileAttachments = new Map([["income_feedbacks.json",
    new URL(root_url+"income_feedbacks.json",import.meta.url)]]);

  main.builtin("FileAttachment", runtime.fileAttachments(element => fileAttachments.get(element)));

  main.variable(observer()).define(["md"], function(md){return(
    md`# Elementals Spendings and Satisfaction of Our Service 

    Our Service satisfaction and spending in average of the group element type of people (aka personality type if you assume) for year 3021 to 3025.`
  )});

  main.variable(observer("viewof year")).define("viewof year", ["Scrubber","d3"], function(Scrubber,d3){return(
    Scrubber(d3.range(3021, 3025.1, 0.1), {format: Math.floor, loop: false})
  )});

  main.variable(observer("year")).define("year", ["Generators", "viewof year"], (G, _) => G.input(_));

  main.variable(observer("legend")).define("legend", ["DOM","html","margin","color"], function(DOM,html,margin,color)
  {
    const id = DOM.uid().id;
    return html`<style>

    .${id} {
      display: inline-flex;
      align-items: center;
      margin-right: 1em;
    }

    .${id}::before {
      content: "";
      width: 1em;
      height: 1em;
      margin-right: 0.5em;
      background: var(--color);
    }

    </style><div style="display: flex; align-items: center; min-height: 33px; font: 10px sans-serif; margin-left: ${margin.left}px;"><div>${color.domain().map(element => html`<span class="${id}" style="--color: ${color(element)}">${document.createTextNode(element)}</span>`)}`;
  });

  main.variable(observer("chart")).define("chart", ["d3","width","height","xAxis","yAxis","grid","dataAt","x","y","radius","color"], function(d3,width,height,xAxis,yAxis,grid,dataAt,x,y,radius,color)
  {
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.append("g")
        .call(grid);

    const circle = svg.append("g")
        .attr("stroke", "black")
      .selectAll("circle")
      .data(dataAt(3021), d => d.element)
      .join("circle")
        .sort((a, b) => d3.descending(a.population, b.population))
        .attr("cx", d => x(d.spending))
        .attr("cy", d => y(d.satisfaction))
        .attr("r", d => radius(d.population))
        .attr("fill", d => color(d.element))
        .call(circle => circle.append("title")
          .text(d => [d.element, d.element].join("\n")));

    return Object.assign(svg.node(), {
      update(data) {
        circle.data(data, d => d.element)
            .sort((a, b) => d3.descending(a.population, b.population))
            .attr("cx", d => x(d.spending))
            .attr("cy", d => y(d.satisfaction))
            .attr("r", d => radius(d.population));
      }
    });
  });

  main.variable(observer("update")).define("update", ["chart","currentData"], function(chart,currentData){return(
    chart.update(currentData)
  )});

  main.variable(observer("currentData")).define("currentData", ["dataAt","year"], function(dataAt,year){return(
    dataAt(year)
  )});

  main.variable(observer("x")).define("x", ["d3","margin","width"], function(d3,margin,width){return(
    d3.scaleLog([100, 1e5], [margin.left, width - margin.right])
  )});

  main.variable(observer("y")).define("y", ["d3","height","margin"], function(d3,height,margin){return(
    d3.scaleLinear([0, 100], [height - margin.bottom, margin.top])
  )});

  main.variable(observer("radius")).define("radius", ["d3","width"], function(d3,width){return(
    d3.scaleSqrt([0, 5e4], [0, width / 24])
  )});

  main.variable(observer("color")).define("color", ["d3","data"], function(d3,data){return(
    d3.scaleOrdinal(data.map(d => d.element), [`#593300`, `#000959`, `#bd0d00`, `#4fa7ff`])
    //d3.scaleOrdinal(["a", "b", "c", "d", "e", "f", "g", "h"],[`#383867`, `#584c77`, `#33431e`, `#a36629`, `#92462f`, `#b63e36`, `#b74a70`, `#946943`])
    //d3.scaleOrdinal(data.map(d => d.region), d3.schemeCategory10).unknown("black")
  )});

  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width"], function(height,margin,d3,x,width){return(
    g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80, ","))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", width)
        .attr("y", margin.bottom - 4)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text("Average Spending (THB) →"))
  )});

  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y"], function(margin,d3,y){return(
    g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ Average Satisfaction (%)"))
  )});

  main.variable(observer("grid")).define("grid", ["x","margin","height","y","width"], function(x,margin,height,y,width){return(
    g => g
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.1)
    .call(g => g.append("g")
      .selectAll("line")
      .data(x.ticks())
      .join("line")
        .attr("x1", d => 0.5 + x(d))
        .attr("x2", d => 0.5 + x(d))
        .attr("y1", margin.top)
        .attr("y2", height - margin.bottom))
    .call(g => g.append("g")
      .selectAll("line")
      .data(y.ticks())
      .join("line")
        .attr("y1", d => 0.5 + y(d))
        .attr("y2", d => 0.5 + y(d))
        .attr("x1", margin.left)
        .attr("x2", width - margin.right))
  )});

  main.variable(observer("dataAt")).define("dataAt", ["data","valueAt"], function(data,valueAt){return(
  function dataAt(year) {
    return data.map(d => ({
      element: d.element,
      spending: valueAt(d.spending, year),
      population: valueAt(d.population, year),
      satisfaction: valueAt(d.satisfaction, year)
    }));
  }
  )});

  main.variable(observer("valueAt")).define("valueAt", ["bisectYear"], function(bisectYear){return(
  function valueAt(values, year) {
    const i = bisectYear(values, year, 0, values.length - 1);
    const a = values[i];
    if (i > 0) {
      const b = values[i - 1];
      const t = (year - a[0]) / (b[0] - a[0]);
      return a[1] * (1 - t) + b[1] * t;
    }
    return a[1];
  }
  )});

  main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
    FileAttachment("income_feedbacks.json").json()
  )});

  main.variable(observer("bisectYear")).define("bisectYear", ["d3"], function(d3){return(
    d3.bisector(([year]) => year).left
  )});

  main.variable(observer("margin")).define("margin", function(){return(
    {top: 20, right: 20, bottom: 35, left: 40}
  )});

  main.variable(observer("height")).define("height", function(){return(
    560
  )});

  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
    require("d3@6")
  )});

  const child1 = runtime.module(define1);

  main.import("Scrubber", child1);

  return main;
}
