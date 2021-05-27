import $ from '$';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';

import BootstrapModal from 'utils/BootstrapModal';
import { Header, SingleCurveBody, MultipleCurveBody } from './DoseResponseModal';

import styles from './graph.css';
//import styles from './ResponseFigure.css';

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
    // stateless; outside react component
    // //ZW 10-24
    console.log(data);
    console.log(legendData);

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
        xData = _.chain(data)
            .map('x')
            .uniq()
            .sort()
            .value(),
        yData = _.chain(data)
            .map('y')
            .uniq()
            .sort()
            .value(),
        xMap = _.groupBy(data, 'x'),
        yMap = _.groupBy(data, 'y'),
        width =
            xData.length * cellSize + margin.axisLeft + margin.left + margin.right + margin.legend,
        height = yData.length * cellSize + margin.axisTop + margin.top + margin.bottom,
        svg = d3
            .select(el)
            .append('svg')
            .attr('width', Math.max(800, width))
            .attr('height', Math.max(800, height)),
        chartHeight = height - (margin.top + margin.bottom + margin.axisTop),
        chartWidth = width - (margin.left + margin.right + margin.axisLeft + margin.legend),
        square = d3
            .symbol()
            .type(d3.symbolSquare)
            .size(900);

    console.log('d3  with color name is fill data');
    //    console.log(data)
    //    console.log(xData)
    //    console.log(xMap)

    // add strip mask pattern
    addStripMask(svg);
    // draw layers
    let axisLayer = svg
        .append('g')
        .classed('axisLayer', true)
        .attr('width', width)
        .attr('height', height);

    // draw y-axis
    let handleYLabelClick = function(label) {
        let cells = yMap[label],
            casrns = [cells[0].y_key],
            readout_ids = _.map(cells, 'x_key');

        new BootstrapModal(Header, MultipleCurveBody, {
            title: label,
            readout_ids,
            casrns,
        });
    };

    let yScale = d3
        .scaleBand()
        .domain(yData)
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
        .on('click', handleYLabelClick);

    // draw x-axis
    let handleXLabelClick = function(label) {
        let cells = xMap[label],
            casrns = _.map(cells, 'y_key'),
            readout_ids = [cells[0].x_key];

        new BootstrapModal(Header, MultipleCurveBody, {
            title: label,
            readout_ids,
            casrns,
        });
    };

    let xScale = d3
        .scaleBand()
        .domain(xData)
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
        .on('click', handleXLabelClick);

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

    // border around bounding box
    chartLayer
        .append('rect')
        .attr('x', xScale.range()[0])
        .attr('y', yScale.range()[0])
        .attr('width', xScale.range()[1])
        .attr('height', yScale.range()[1])
        .attr('fill', 'transparent')
        .style('stroke', 'black')
        .style('stroke-width', 2);

    // setup event for cell-click
    // zicong:  BootstrapModal when cell is clicked.
    let handleCellClick = function(d) {
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
    };

    var handleMouseOver = function(d) {
        tooltip
            .html(d.bmd ? d.bmd : 0)
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY + 20 + 'px')
            .style('opacity', 1.0);
    };
    var handleMouseOut = function(d) {
        tooltip.style('opacity', 0.0);
    };
    // add a tooltip
    var tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0.0);

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
        // ZW 10-23
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .on('click', handleCellClick);

    //    console.log("chartLayer")
    //
    //    console.log(chartLayer)

    // draw legend, this legend length, size is fixed.
    // 2 cases, discrete = activity,  continuous = BMC, different legned form.
    let legendLayer = svg
        .append('g')
        .classed('legendLayer', true)
        .attr('transform', `translate(${width - margin.legend},${margin.top})`);
    //
    //    console.log("legendLayer ")
    //    console.log(legendLayer)

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
            legendLayer.append(() => ds._groups[0][2].cloneNode()).attr('fill', 'transparent');

            d3.select(ds._groups[0][2])
                .attr('mask', 'url(#stripeMask)')
                .attr('fill', '#ccc');

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

            // hard code values [todo: fix]
            // Zicong:  this below is the scale value bar from 1000 to 0.00001

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
        this.handleResize = this.handleResize.bind(this);
    }

    unrenderPlot() {
        //        console.log("plot svg")
        //        console.log(this.refs.svg)
        if (this.refs.svg === undefined) {
            return;
        }
        window.removeEventListener('resize', this.handleResize);
        this.refs.svg.innerHTML = '';
    }

    renderPlot() {
        console.log('plot svg');
        console.log(this.refs.svg);
        console.log('this.props.data');
        console.log(this.props.data);
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
        //        console.log(<div className="row-fluid" ref="svg" />)
        return <div className="row-fluid" ref="svg" />;
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
