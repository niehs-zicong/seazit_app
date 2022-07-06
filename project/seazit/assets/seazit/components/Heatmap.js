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
    console.log("HEATMAP")
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
        console.log("handleCellClick")

        // console.log(d)
         // new BootstrapModal(Header, SingleCurveBody, {
         //        // title: `${d.preferred_name} (${d.chemical_casrn}): ${d.readout_endpoint}`,
         //        title: d.preferred_name + `: ` + d.endpoint_name,
         //        protocol_id: d.protocol_id,
         //        readout_id: d.endpoint_name + '_' + d.protocol_id,
         //        casrn: d.casrn,
         //    });
            new BootstrapModal(Header, MultipleCurveBody, {
                title: d.x,
                readout_ids: _.map(d.readouts, 'readout_id'),
                casrns: [d.chemical_casrn],
            });


        // if (d.readouts && d.readouts.length > 1) {
        //     new BootstrapModal(Header, MultipleCurveBody, {
        //         title: d.x,
        //         readout_ids: _.map(d.readouts, 'readout_id'),
        //         casrns: [d.chemical_casrn],
        //     });
        // } else {
        //      new BootstrapModal(Header, SingleCurveBody, {
        //         title: d.preferred_name + `: ` + d.endpoint_name,
        //         protocol_id: d.protocol_id,
        //         readout_id: d.endpoint_name + '_' + d.protocol_id,
        //         casrn: d.casrn,
        //     });
        // }
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

    handleXLabelClick = function(label) {
        let cells = xMap[label],
            casrns = _.map(cells, 'y_key'),
            readout_ids = [cells[0].x_key];

        new BootstrapModal(Header, MultipleCurveBody, {
            title: label,
            readout_ids,
            casrns,
        });
    },
            // draw y-axis
     handleYLabelClick = function(label) {
        let cells = yMap[label],
            casrns = [cells[0].y_key],
            readout_ids = _.map(cells, 'x_key');

        new BootstrapModal(Header, MultipleCurveBody, {
            title: label,
            readout_ids,
            casrns,
        });
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


      // width = 450 - margin.left - margin.right,
      // height = 450 - margin.top - margin.bottom,
    // xasix is column, yasix is row
     xasix= d3.map(data, function(d){return (d.x);}).keys(),

    //, yasix is row
       yasix = d3.map(data, function(d){return (d.y);}).keys(),

    width = xasix.length * cellSize + margin.axisLeft + margin.left + margin.right + margin.legend,
    height = yasix.length * cellSize + margin.axisTop + margin.top + margin.bottom,



      // List of all variables and number of them
       domain = d3.set(data.map(function(d) { return d.mean_selectivity })).values(),
       num = Math.sqrt(data.length),

        chartHeight = height - (margin.top + margin.bottom + margin.axisTop),
        chartWidth = width - (margin.left + margin.right + margin.axisLeft + margin.legend),

        // how we get this 900,  check cellSize = 30.  30*30 = 900.
        square = d3
            .symbol()
            .type(d3.symbolSquare)
            .size(900),
            // .size(1600),


        // Create the svg area
         svg = d3
             .select(el)
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


     let axisLayer = svg
        .append('g')
        .classed('axisLayer', true)
        .attr('width', width)
        .attr('height', height);

          //   console.log(xasix)
          // console.log(yasix)
          // console.log(domain)


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
        .on('click', handleYLabelClick)
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
        .on('click', handleXLabelClick)
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
    chartLayer
        .append('rect')
        .attr('x', xScale.range()[0])
        .attr('y', yScale.range()[0])
        .attr('width', xScale.range()[1])
        .attr('height', yScale.range()[1])
        .attr('mask', 'url(#stripeMask)')
        .attr('fill', '#ccc');

    chartLayer
        .append('rect')
        .attr('x', xScale.range()[0])
        .attr('y', yScale.range()[0])
        .attr('width', xScale.range()[1])
        .attr('height', yScale.range()[1])
        .attr('fill', 'transparent')
        .style('stroke', 'black')
        .style('stroke-width', 2);



    chartLayer
        .selectAll('.square')
        .data(data)
        .enter()
        .append('path')
        .attr('class', 'square')
        .attr('d', square)
        .attr('fill', (d) => d.fill)
        .attr(
            'transform',
            (d) =>
                `translate(${xScale(d.x) + xScale.bandwidth() / 2}, ${yScale(d.y) +
                    yScale.bandwidth() / 2})`
            )
        .style('stroke', 'black')
        .style('stroke-width', '0.8')
        .style('cursor', 'pointer')
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .on('click', handleCellClick);

    console.log("legendData")

    console.log(legendData)
    // draw legend, this legend length, size is fixed.
    // 2 cases, discrete = activity,  continuous = BMC, different legned form.
    let legendLayer = svg
        .append('g')
        .classed('legendLayer', true)
        .attr('transform', `translate(${width - margin.legend},${margin.top})`);

    switch (legendData.type) {
        case 'discrete': {
            legendLayer
                .selectAll('text')
                .data(legendData.values)
                .enter()
                .append('text')
                .attr('class', styles.legendText)
                .attr('x', 35)
                .attr('y', (d, i) => i * 20 + margin.axisTop + 10)
                .text((d) => d.label);

            let ds = legendLayer
                .selectAll('path')
                .data(legendData.values)
                .enter()
                .append('rect')
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', (d) => d.fill)
                .attr('transform', (d, i) => `translate(15, ${i * 20 + margin.axisTop})`)
                .style('stroke', 'black')
                .style('stroke-width', '1');

            // hard-coded - todo: fix
            // legendLayer.append(() => ds._groups[0][2].cloneNode()).attr('fill', 'transparent');

            // d3.select(ds._groups[0][2])
            //     .attr('mask', 'url(#stripeMask)')
            //     .attr('fill', '#ccc');
            break;
        }
        case 'continuous': {
            let { colorScaleFunction, legendScale } = legendData,
                legendHeight = 200,
                legend = legendLayer
                    .append('defs')
                    .append('linearGradient')
                    .attr('id', 'gradient')
                    .attr('x1', '0%')
                    .attr('y1', '100%')
                    .attr('x2', '0%')
                    .attr('y2', '0%')
                    .attr('spreadMethod', 'pad');

            legendScale.ticks().map((d, i) => {
                legend
                    .append('stop')
                    .attr('offset', `${i}%`)
                    .attr('stop-color', colorScaleFunction(d))
                    .attr('stop-opacity', 1);
            });

            legendLayer
                .append('rect')
                .attr('width', 30)
                .attr('height', legendHeight)
                .style('fill', 'url(#gradient)')
                .style('stroke', 'black')
                .attr('transform', `translate(20,${margin.top + margin.axisTop})`);

            legendLayer
                .append('g')
                .attr('class', 'axis y')
                .attr('transform', `translate(50,${margin.top + margin.axisTop})`)
                .call(
                    getLog10AxisFunction(d3.axisRight, legendScale.copy().range([legendHeight, 0]))
                );

            legendLayer
                .append('text')
                .attr('class', styles.legendText)
                .attr('x', 0)
                .attr('y', 0)
                .attr('transform', `translate(15, ${margin.top + margin.axisTop - 10})`)
                .text('BMC (µM)');
            legendLayer
                .append('text')
                .attr('class', styles.legendText)
                .attr('x', 0)
                .attr('y', 0)
                .attr(
                    'transform',
                    `translate(50,${margin.top + margin.axisTop + legendHeight + 25})`
                )
                .text('Not active (no BMC)');

            legendLayer
                .append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 25)
                .attr('height', 25)
                .attr(
                    'transform',
                    `translate(20,${margin.top + margin.axisTop + legendHeight + 10})`
                )
                .attr('fill', 'white')
                .style('stroke', 'black')
                .style('stroke-width', '1');

            legendLayer
                .append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 25)
                .attr('height', 25)
                .attr(
                    'transform',
                    `translate(20,${margin.top + margin.axisTop + legendHeight + 40})`
                )
                .attr('mask', 'url(#stripeMask)')
                .attr('fill', '#ccc');

            legendLayer
                .append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 25)
                .attr('height', 25)
                .attr(
                    'transform',
                    `translate(20,${margin.top + margin.axisTop + legendHeight + 40})`
                )
                .attr('fill', 'transparent')
                .style('stroke', 'black')
                .style('stroke-width', '1');

            legendLayer
                .append('text')
                .attr('class', styles.legendText)
                .attr('x', 0)
                .attr('y', 0)
                .attr(
                    'transform',
                    `translate(50,${margin.top + margin.axisTop + legendHeight + 55})`
                )
                .text('Not tested');
            break;
        }

        default:
            break;
    }
};

class Heatmap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        };
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
