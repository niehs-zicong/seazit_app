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
     xasix= d3.map(data, function(d){return (d.protocol_name_plot + d.use_category1 );}).keys(),

    //, yasix is row
       yasix = d3.map(data, function(d){return (d.preferred_name);}).keys(),

    width = xasix.length * cellSize + margin.axisLeft + margin.left + margin.right + margin.legend,
    height = yasix.length * cellSize + margin.axisTop + margin.top + margin.bottom,



      // List of all variables and number of them
       domain = d3.set(data.map(function(d) { return d.mean_selectivity })).values(),
       num = Math.sqrt(data.length),

        chartHeight = height - (margin.top + margin.bottom + margin.axisTop),
        chartWidth = width - (margin.left + margin.right + margin.axisLeft + margin.legend),

          // Build color scale
     selectivityColor = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([-1,1]),


        square = d3
            .symbol()
            .type(d3.symbolSquare)
            .size(900),

        // cor = svg.selectAll(".cor")
        //         .data(data)
        //         .enter()
        //         .append("g")
        //           .attr("class", "cor")
        //           .attr("transform", function(d) {
        //             return "translate(" + x(d.x) + "," + y(d.y) + ")";
        //           }),


        // Create the svg area
         svg = d3
             .select(el)
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg = d3
            .select(el)
            .append('svg')
            .attr('width', Math.max(800, width))
            .attr('height', Math.max(800, height));

              // Build X scales and axis:
      //  var x = d3.scaleBand()
      //   .range([ 0, width ])
      //   .domain(xasix)
      //   .padding(0.05);
      // svg.append("g")
      //   .style("font-size", 15)
      //   .attr("transform", "translate(0," + height + ")")
      //   .call(d3.axisBottom(x).tickSize(0))
      //   .select(".domain").remove()
      //
      // // Build Y scales and axis:
      // var y = d3.scaleBand()
      //   .range([ height, 0 ])
      //   .domain(yasix)
      //   .padding(0.05);
      // svg.append("g")
      //   .style("font-size", 15)
      //   .call(d3.axisLeft(y).tickSize(0))
      //   .select(".domain").remove()


      // Create a color scale
      var color = d3.scaleLinear()
        .domain([-1, 0, 1])
        .range(["#B22222", "#fff", "#000080"]);

      // Create a size scale for bubbles on top right. Watch out: must be a rootscale!
      var size = d3.scaleSqrt()
        .domain([-1, 1])
        .range([0, 9]);
      // X scale
      // var x = d3.scalePoint()
      //   .range([0, width])
      //   .domain(domain)
      //
      // // Y scale
      // var y = d3.scalePoint()
      //   .range([0, height])
      //   .domain(domain)


     let axisLayer = svg
        .append('g')
        .classed('axisLayer', true)
        .attr('width', width)
        .attr('height', height);

            console.log(xasix)
          console.log(yasix)
          console.log(domain)

    // draw y-axis
    let yScale = d3
        .scaleBand()
        .domain(yasix)
        .range([0, chartHeight]);

    let yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

    axisLayer
        .append('g')
        .attr(
            'transform',
            `translate(${margin.left + margin.axisLeft}, ${margin.top + margin.axisTop})`
        )
        .attr('class', 'axis y')
        .call(yAxis)
        .selectAll('text')
        .style('cursor', 'pointer')
        // .on('click', handleYLabelClick)
        ;

    // draw x-axis

    let xScale = d3
        .scaleBand()
        .domain(xasix)
        .range([0, chartWidth]);

    let xAxis = d3.axisTop(xScale).tickSizeOuter(0);

    axisLayer
        .append('g')
        .attr(
            'transform',
            `translate(${margin.left + margin.axisLeft}, ${margin.top + margin.axisTop})`
        )
        .attr('class', 'axis x')
        .call(xAxis)
        .selectAll('text')
        .attr('dx', '.8em')
        .attr('dy', '.55em')
        .attr('transform', 'rotate(-65)')
        .style('text-anchor', 'start')
        .style('cursor', 'pointer')
        // .on('click', handleXLabelClick)
        ;

    let chartLayer = svg
        .append('g')
        .classed('chartLayer', true)
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr(
            'transform',
            `translate(${margin.left + margin.axisLeft}, ${margin.top + margin.axisTop})`
        );

        // plot bounding box
    // chartLayer
    //     .append('rect')
    //     .attr('x', xScale.range()[0])
    //     .attr('y', yScale.range()[0])
    //     .attr('width', xScale.range()[1])
    //     .attr('height', yScale.range()[1])
    //     .attr('mask', 'url(#stripeMask)')
    //     .attr('fill', '#ccc');

    chartLayer
        .append('rect')
        .attr('x', xScale.range()[0])
        .attr('y', yScale.range()[0])
        .attr('width', xScale.range()[1])
        .attr('height', yScale.range()[1])
        .attr('fill', 'transparent')
        .style('stroke', 'black')
        .style('stroke-width', 2);



    // chartLayer
    //     .selectAll('.square')
    //     .data(data)
    //     .enter()
    //     .append('path')
    //     .attr('class', 'square')
    //     .attr('d', square)
    //     // .attr('fill', (d) => d.fill)
    //     // .attr('fill', (d) =>  selectivityColor(d.mean_selectivity))
    //     .style('fill', (d) =>  selectivityColor(d.mean_selectivity))
    //     .attr(
    //         'transform',
    //         (d) =>
    //             `translate(${xScale(d.protocol_name_plot + d.use_category1 ) + xScale.bandwidth() / 2}, ${yScale(d.preferred_name) +
    //                 yScale.bandwidth() / 2})`
    //         )
    //     .style('stroke', 'black')
    //     .style('stroke-width', '0.8')
    //     .style('cursor', 'pointer')
    //         ;
    //

      chartLayer = svg
        .append('g')
        .classed('chartLayer', true)
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr(
            'transform',
            `translate(${margin.left + margin.axisLeft}, ${margin.top + margin.axisTop})`
        );


};

class Heatmap extends Component {
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

Heatmap.propTypes = {
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

export default Heatmap;
