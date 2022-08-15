import $ from '$';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import BootstrapModal from 'utils/BootstrapModal';
import {Header, SingleCurveBody, MultipleCurveBody} from './DoseResponseModal';

import styles from './graph.css';
// import styles from './ResponseFigure.css';

import {getLog10AxisFunction} from 'utils/d3';
import Heatmap from "./Heatmap";
import {printFloat} from "../shared";

let addStripMask = function (svg) {
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

let renderPlot = function (el, data, legendData) {
    $(el).empty();
    // let margin = {top: 80, right: 25, bottom: 30, left: 40},
    let
        margin = {
            top: 10,
            left: 10,
            bottom: 40,
            right: 10,
            axisLeft: 290,
            axisTop: 290,
            legend: 150,
        },
        cellSize = 30,
        handleCellClick = function (d) {
            // console.log("handleCellClick")
            // console.log(d)

            if (d.endPointList && d.endPointList.length > 1) {
                new BootstrapModal(Header, MultipleCurveBody, {
                    title: d.title,
                    protocol_id: d.protocol_id,
                    readout_ids: _.map(d.endPointList, function (x) {
                        return x + '_' + d.protocol_id;
                    }),
                    casrns: [d.casrn],
                });
            } else {
                new BootstrapModal(Header, SingleCurveBody, {
                    title: d.title,
                    protocol_id: d.protocol_id,
                    readout_id: d.endpoint_name + '_' + d.protocol_id,
                    casrn: d.casrn,
                });
            }
            ;
        },


        handleMouseOver = function (d) {
                console.log(d)

            tooltip
                // .html(d.mean_selectivity ? d.mean_selectivity : 0)
                .html(`Potency: ${printFloat(Math.pow(10, d.mean_pod) * 1000000)} μM  \n
                 Potency: ${printFloat(d.mean_selectivity)} μM `)
                 // Potency: ${printFloat(d.mean_selectivity ? d.mean_selectivity : 0)} μM `)
                .style('left', d3.event.pageX + 'px')
                .style('top', d3.event.pageY + 20 + 'px')
                .style('opacity', 1.0);
        },
        handleMouseOut = function (d) {
            tooltip.style('opacity', 0.0);
        },
        // xasix is column, yasix is row
        xasix = d3.map(data, function (d) {
            return d.x;
        }).keys()
            .sort(),


        yasix = d3.map(data, function (d) {
            return d.y;
        }).keys()
            .sort(),


        width = xasix.length * cellSize + margin.axisLeft + margin.left + margin.right + margin.legend,
        height = yasix.length * cellSize + margin.axisTop + margin.top + margin.bottom,

        chartHeight = height - (margin.top + margin.bottom + margin.axisTop),
        chartWidth = width - (margin.left + margin.right + margin.axisLeft + margin.legend),
        // Create a color scale

        // colorDomain = [-8, -4],
        //  sizeDomain = [0, 3.15],

        // [-0.20605, 3.1549] is min and max for allset data from table.
        // var colorRange = [0, 3.1549];

        // Create a size scale for bubbles on top right. Watch out: must be a rootscale!
        // The scaleSqrt scale is useful for sizing circles by area (rather than radius).
        // domain is domain between all data
        // range is between 0 to half of cellsize,   which is radius.

        //   make radius linear scale.  TODO
        // sizeDomain = d3.extent(_.map(data, 'mean_selectivity')),

        // sizeDomain = [0, 3.1549],
        sizeDomain = [0, 2],
        // sizeDomain = [0, 3],

        size = d3.scaleSqrt()
            .domain(sizeDomain)
            .range([0, cellSize / 2]),

        svg = d3
            .select(el)
            .append('svg')
            .attr('width', Math.max(1000, width + margin.left + margin.right))
            .attr('height', Math.max(1000, width + margin.left + margin.right))
                    .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),


        // add a tooltip
        tooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0.0);

    console.log(sizeDomain)
    // console.log(width)
    // console.log(height)

    // draw xy-axis
    let axisLayer = svg
        .append('g')
        .attr("class", "axisLayer")
        // .classed('axisLayer', true)
        .attr('width', width)
        .attr('height', height);


    let xScale = d3
        .scaleBand()
        .domain(xasix)
        .range([0, chartWidth]);
    let yScale = d3
        .scaleBand()
        .domain(yasix)
        .range([0, chartHeight]);

    let xAxis = d3.axisTop(xScale).tickSizeOuter(0);
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
    ;
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
    ;


    // .select(".domain").remove()


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
        .selectAll(".cor")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "cor")
        .attr("transform", function (d) {
            return (
                `translate(${xScale(d.x) + xScale.bandwidth() / 2}, ${yScale(d.y) +
                yScale.bandwidth() / 2})`
            )
        })
        .append("circle")
        .attr("r", (d) => {
            switch (d.final_dev_call) {
                case 'dev tox':
                    return size(Math.abs(d.mean_selectivity));
                    break;
                case null:
                    // return size(0);
                    break;
                // others 'general tox', 'inconclusive', 'inactive'
                default:
                    return size(Math.abs(sizeDomain[1] / 20));
            }
        })
        .attr('fill', (d) => d.fill)
        .style("opacity", 0.8)
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .on('click', handleCellClick);


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
            break;
        }
        case 'continuous': {
            let {colorScaleFunction, legendScale} = legendData,
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
                .text('Not dev tox');

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
                .attr('fill', 'black')
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
                .text('No data');
            break;
        }

        default:
            break;
    }


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
        return <div id="IA_heatmap02" className="row-fluid" ref="svg"/>;
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
