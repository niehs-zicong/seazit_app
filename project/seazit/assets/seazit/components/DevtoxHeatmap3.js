import $ from '$';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import BootstrapModal from 'utils/BootstrapModal';
import { Header, SingleCurveBody, MultipleCurveBody } from './DoseResponseModal';

import styles from './graph.css';
// import styles from './ResponseFigure.css';

import { getLog10AxisFunction } from 'utils/d3';

let addStripMask = function(svg) {
    // add strip mask to top of d3-selected svg
    // use url(#stripeMask) to apply

    let defs = svg.append('defs');
    defs.append('pattern')
        .attr('id', 'maskStripePattern')
        .attr('width', 8)
        .attr('height', 8)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('patternTransform', 'rotate(45)')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 4)
        .attr('height', 8)
        .attr('fill', 'white');

    defs.append('mask')
        .attr('id', 'stripeMask')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', '100%')
        .attr('height', '100%')
        .style('fill', 'url(#maskStripePattern)');
};

let renderPlot = function(el, data, legendData) {
    $(el).empty();
    console.log(data)
    // let margin = {top: 80, right: 25, bottom: 30, left: 40},
    let margin = {
            top: 10,
            left: 10,
            bottom: 40,
            right: 10,
            axisLeft: 290,
            axisTop: 150,
            legend: 150,
        },
        cellSize = 30,
     handleCellClick = function(d) {
        if (d.readouts && d.readouts.length > 1) {
            new BootstrapModal(Header, MultipleCurveBody, {
                title: d.x,
                readout_ids: _.map(d.readouts, 'readout_id'),
                casrns: [d.chemical_casrn],
            });
        } else {
            new BootstrapModal(Header, SingleCurveBody, {
                title: d.title,
                readout_id: d.readout_id,
                casrn: d.chemical_casrn,
            });
        }
    },

     handleMouseOver = function(d) {
        tooltip
            .html(d.mean_selectivity ? d.mean_selectivity : 0)
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY + 20 + 'px')
            .style('opacity', 1.0);
    },
     handleMouseOut = function(d) {
        tooltip.style('opacity', 0.0);
    },

         // create a tooltip
   tooltip = d3.select(el)
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px"),

  // Three function that change the tooltip when user hover / move / leave a cell
   mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  },
   mousemove = function(d) {
    tooltip
      .html("The exact value of<br>this cell is: " + d.mean_selectivity)
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  },
   mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  },



      // width = 450 - margin.left - margin.right,
      // height = 450 - margin.top - margin.bottom,
    // xasix is column, yasix is row
     xKeys= d3.map(data, function(d){return (d.protocol_name_plot + d.use_category1 );})
         .keys(),
    //, yasix is row
       yKeys = d3.map(data, function(d){return (d.preferred_name);})
        .keys(),
       domain = d3.set(data.map(function(d) { return d.mean_selectivity })).values(),
       selectivityDomain = d3.extent(_.map(data, 'mean_selectivity')),
       num = Math.sqrt(data.length),

    width = xKeys.length * cellSize + margin.axisLeft + margin.left + margin.right + margin.legend,
    height = yKeys.length * cellSize + margin.axisTop + margin.top + margin.bottom,
      // width = 450 - margin.left - margin.right,
      // height = 450 - margin.top - margin.bottom,

      // List of all variables and number of them

        chartHeight = height - (margin.top + margin.bottom + margin.axisTop),
        chartWidth = width - (margin.left + margin.right + margin.axisLeft + margin.legend),
          // chartHeight = 450 - margin.top - margin.bottom,
          // chartWidth = 450 - margin.left - margin.right,
          // Build color scale
     selectivityColor = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([-1,1]),

        square = d3
            .symbol()
            .type(d3.symbolSquare)
            .size(900),
            // Create the svg area
         svg = d3.select(el)
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        console.log(domain)
        console.log(selectivityDomain)

        // draw y-axis
    let yScale = d3
         .scaleBand()
        .range([chartHeight, 0])
        .domain(yKeys)
        .padding(0.05)
        ;

    let xScale = d3
        .scaleBand()
        .range([0, chartWidth])
        .domain(xKeys)
        .padding(0.05)
        ;


    // let xScale = d3
    //     .scaleBand()
    //     .domain(xKeys)
    //     .range([0, chartWidth]);
    // let yScale = d3.scaleBand()
    //     .domain(yKeys)
    //     .range([0, chartHeight]);


      svg.append("g")
        .style("font-size", 15)
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisTop(xScale).tickSizeOuter(0))
        // .attr('dx', '.8em')
        // .attr('dy', '.55em')
        // .attr('transform', 'rotate(-65)')
        // .select(".domain").remove()

      svg.append("g")
        .style("font-size", 15)
        .call(d3.axisLeft(yScale).tickSizeOuter(0))
        // .select(".domain").remove()

      // Create a color scale
      var colorRange = d3.extent(_.map(data, 'mean_selectivity'));
      // [-0.20605, 3.1549] is min and max for allset data from table.
      // var colorRange = [-0.20605, 3.1549];

      console.log(colorRange)
      var color = d3.scaleLinear()
        // .domain([-1, 0, 1])
        .domain(colorRange)
        // .range(["#B22222", "#fff", "#000080"]);
        .range(['red', 'blue']);

            // Create a size scale for bubbles on top right. Watch out: must be a rootscale!
      var size = d3.scaleSqrt()
        .domain([0, 1])
        .range([0, 9]);

      console.log("data")
      console.log(data)

      // Create one 'g' element for each cell of the correlogram
       var cor = svg.selectAll(".cor")
        .data(data)
        .enter()
        .append("g")
          .attr("class", "cor")
          .attr("transform", function(d) {
            // return "translate(" + ${x(d.protocol_name_plot + d.use_category1)} + "," + ${y(d.preferred_name)} + ")";
            return (
                `translate(${xScale(d.protocol_name_plot + d.use_category1) + xScale.bandwidth() / 2}, ${yScale(d.preferred_name) +
                    yScale.bandwidth() / 2})`
            )
           return (
                `translate(${xScale(d.protocol_name_plot + d.use_category1)}, ${yScale(d.preferred_name) 
                    })`
            )
          })
       ;

      // Up right part: add circles
       cor.append("circle")
          .attr("r", function(d){ return size(Math.abs(d.mean_selectivity)) })
          .style("fill", function(d){
              return color(d.mean_selectivity);
          })
          .style("opacity", 0.8)


};

class DevtoxHeatmap extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
    }

    unrenderPlot() {
        if (this.refs.svg === undefined) {
            return;
        }
        window.removeEventListener('resize', this.handleResize);
        this.refs.svg.innerHTML = '';
    }

    renderPlot() {
        if (this.refs.svg === undefined) {
            return;
        }
        this.unrenderPlot();
        // this is bootstrap plot svg

        renderPlot(this.refs.svg, this.props.data, this.props.legendData);

        window.addEventListener('resize', this.handleResize);
    }

    handleResize() {
        this.renderPlot();
    }

    componentDidMount() {
        this.renderPlot();
    }

    componentDidUpdate() {
        this.renderPlot();
    }

    componentWillUnmount() {
        this.unrenderPlot();
    }

    render() {
        return <div id="IA_heatmap01" className="row-fluid" ref="svg" />;
    }
}

DevtoxHeatmap.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            x: PropTypes.string,
            y: PropTypes.string,
            fill: PropTypes.string,
            hover_text: PropTypes.string,
        })
    ).isRequired,
    legendData: PropTypes.shape({
        type: PropTypes.oneOf(['discrete', 'continuous']).isRequired,
        values: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                fill: PropTypes.string,
                chemical_casrn: PropTypes.string,
                readout_id: PropTypes.number,
                title: PropTypes.string,
            })
        ),
        colorScaleFunction: PropTypes.func,
        legendScale: PropTypes.func,
    }).isRequired,
};

export default DevtoxHeatmap;
