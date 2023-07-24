import $ from '$';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import BootstrapModal from 'utils/BootstrapModal';
import { Header, SingleCurveBody, MultipleCurveBody } from './BootstrapBodyPart';

import styles from './graph.css';

import { getLog10AxisFunction } from 'utils/d3';
import Heatmap from './Heatmap';
import { integrativeHandleCellClick, printFloat, pod_med_processed } from '../shared';

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
    let margin = {
            top: 40,
            left: 10,
            bottom: 40,
            right: 40,
            axisLeft: 290,
            axisTop: 390,
            legend: 300,
        },
        // cellSize = 30,
        cellSize = 50,
        mouseover = function(d) {
            tooltip.style('opacity', 1);
        },
        mousemove = function(d) {
            tooltip
                .html(
                    `Potency: ${printFloat(pod_med_processed(d.mean_pod))} μM  \n
                 Specificity: ${printFloat(d.mean_selectivity)}`
                )
                .style('left', d3.event.pageX - 400 + 'px')
                .style('top', d3.event.pageY - 300 + 'px')
                .style('opacity', 1.0);
        },
        mouseleave = function(d) {
            tooltip.style('opacity', 0);
        },
        // xasix is column, yasix is row
        xasix = d3
            .map(data, function(d) {
                return d.x;
            })
            .keys()
            .sort(),
        yasix = d3
            .map(data, function(d) {
                return d.y;
            })
            .keys()
            .sort(),
        width =
            xasix.length * cellSize + margin.axisLeft + margin.left + margin.right + margin.legend,
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

        size = d3
            .scaleSqrt()
            .domain(sizeDomain)
            .range([0, cellSize / 2]),
        svg = d3
            .select(el)
            .append('svg')
            .attr('width', Math.max(1000, width + margin.left + margin.right))
            .attr('height', Math.max(1000, height + margin.left + margin.right))
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'),
        star = d3
            .symbol()
            .type(d3.symbolStar)
            .size(size(cellSize / 5)),
        tooltip = d3
            .select(el)
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0.0);

    // addStripMask(svg);

    // draw xy-axis
    let axisLayer = svg
        .append('g')
        .attr('class', 'axisLayer')
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
        .style('font-size', 15)

        .selectAll('text')
        .style('cursor', 'pointer');
    axisLayer
        .append('g')
        .attr(
            'transform',
            `translate(${margin.left + margin.axisLeft}, ${margin.top + margin.axisTop})`
        )
        .attr('class', 'axis x')
        .call(xAxis)
        .style('font-size', 15)
        .selectAll('text')
        .attr('dx', '.8em')
        .attr('dy', '.55em')
        .attr('transform', 'rotate(-65)')
        .style('text-anchor', 'start')
        .style('cursor', 'pointer');

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
        .selectAll('path')
        .data(data.filter((d) => d.final_dev_call === 'dev tox'))
        .enter()
        .append('g')
        .attr('class', 'cor')
        .attr('transform', function(d) {
            return `translate(${xScale(d.x) +
                xScale.bandwidth() / 2}, ${yScale(d.y) + yScale.bandwidth() / 2})`;
        })
        .append('circle')
        .attr('r', (d) => {
            return size(Math.abs(d.mean_selectivity));
        })
        .attr('fill', (d) => d.fill)
        .style('opacity', 0.8)
        .style('cursor', 'pointer')
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)
        .on('click', integrativeHandleCellClick);

    chartLayer
        .selectAll('path')
        .data(data.filter((d) => d.final_dev_call !== 'dev tox' && d.final_dev_call !== null))
        .enter()
        .append('path')
        .attr('class', 'star')
        .attr('d', star)
        .attr('fill', (d) => d.fill)
        .attr('transform', function(d) {
            return `translate(${xScale(d.x) +
                xScale.bandwidth() / 2}, ${yScale(d.y) + yScale.bandwidth() / 2})`;
        })
        .style('opacity', 0.8);

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
            let { colorScaleFunction, legendScale } = legendData,
                // legendHeight = 200,
                legendHeight = 300,
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
                .attr('width', cellSize - 20)
                .attr('height', legendHeight)
                .style('fill', 'url(#gradient)')
                .style('stroke', 'black')
                .attr('transform', `translate(20,${margin.top + margin.axisTop})`);

            legendLayer
                .append('g')
                .attr('class', 'axis y')
                .attr(
                    'transform',
                    `translate(${20 + cellSize - 20},${margin.top + margin.axisTop})`
                )
                .call(
                    getLog10AxisFunction(d3.axisRight, legendScale.copy().range([legendHeight, 0]))
                );

            legendLayer
                .append('text')
                .attr('class', styles.legendText)
                .attr('x', 0)
                .attr('y', 0)
                .attr('transform', `translate(20, ${margin.axisTop + (cellSize - 20) / 2})`)
                .text('BMC (µM) of specific developmental toxicity')
                .style('font-size', 20);

            legendLayer
                .append('path')
                .attr('class', 'star')
                .attr('d', star)
                .attr(
                    'transform',
                    `translate(${20 + 25 / 2},${margin.top +
                        margin.axisTop +
                        legendHeight +
                        10 +
                        25 / 2})`
                )
                .attr('fill', 'black')
                .style('stroke', '#000000')
                .style('stroke-width', '1');

            legendLayer
                .append('text')
                .attr('class', styles.legendText)
                .attr('x', 0)
                .attr('y', 0)
                .attr(
                    'transform',
                    `translate(${15 + cellSize},${margin.top +
                        margin.axisTop +
                        legendHeight +
                        10 +
                        25 / 2 +
                        5})`
                )
                .text('non-specific, non-toxic, inconclusive');

            // the reason I put 25/2 into this position transform, because square size is (25, 25),
            // make sure star is in center, make is position to be 25/2, 25/2

            legendLayer
                .append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', cellSize - 20)
                .attr('height', cellSize - 20)
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
                .attr('width', cellSize - 20)
                .attr('height', cellSize - 20)
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
                    `translate(${15 + cellSize},${margin.top +
                        margin.axisTop +
                        legendHeight +
                        40 +
                        (cellSize - 20) / 2 +
                        5})`
                )
                .text('not evaluated');
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
        return <div id="IA_heatmap02" className="row-fluid" ref="svg" />;
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
