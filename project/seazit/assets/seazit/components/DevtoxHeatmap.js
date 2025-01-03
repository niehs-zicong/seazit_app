import $ from '$';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import Tooltip from '@material-ui/core/Tooltip';

import BootstrapModal from 'utils/BootstrapModal';
import {
    Header,
    SingleCurveBody,
    MultipleCurveBody,
    sankeyPlotGraphBody,
    molecularGraphBody,
} from './BootstrapBodyPart';

import { getLog10AxisFunction } from 'utils/d3';
import { integrativeHandleCellClick, printFloat, pod_med_processed } from '../shared';
import DoseResponseGridWidget from '../widgets/DoseResponseGridWidget';

class DevtoxHeatmap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        };
        this.handleResize = this.handleResize.bind(this);
    }

    renderPlot = function(el, data, legendData) {
        $(el).empty();

        let margin = {
                top: 40,
                left: 10,
                bottom: 40,
                right: 40,
                axisLeft: 290,
                axisTop: 300,
                legend: 900,
            },
            { colorScaleFunction, legendScale } = legendData,
            legendCirclesSizes = [0.5, 1.0, 1.5, 2.0, 2.5],
            cellSize = 50,
            legendCellSize = cellSize - 20,
            xMap = _.groupBy(data, 'x'),
            yMap = _.groupBy(data, 'y'),
            ontologyType = this.props.ontologyType,
            handleXLabelClick = function(label) {
                let cells = xMap[label];
                let cell = {
                    developmental_defect_grouping_general:
                        cells[0].developmental_defect_grouping_general,
                    ontologyGroupName: cells[0].ontologyGroupName,
                    protocol_source: cells[0].protocol_source,
                    ontologyType: ontologyType,
                };

                if (cell.developmental_defect_grouping_general && cell.protocol_source) {
                    new BootstrapModal(Header, sankeyPlotGraphBody, {
                        title: label.replace(/:/g, ' +'),
                        cells: cell,
                    });
                }
            },
            // draw y-axis
            handleYLabelClick = function(label) {
                let cells = yMap[label],
                    casrns = [...new Set(cells.map((item) => item.casrn))],
                    dtxsids = [...new Set(cells.map((item) => item.dtxsid))];

                new BootstrapModal(Header, molecularGraphBody, {
                    title: `${dtxsids[0]} // ${label} //  molecularGraph  ZWTBD`,
                    dtxsid: dtxsids[0],
                });
            },
            mouseover = function(d) {
                tooltip.style('opacity', 1);
            },
            mousemove = function(d) {
                tooltip
                    .html(
                        `<span style="font-size: 15px; font-weight: bold;">
                Potency: ${printFloat(pod_med_processed(d.mean_pod))} μM \n
                Specificity: ${printFloat(d.mean_selectivity)}
            </span>`
                    )
                    .style('left', d3.event.pageX - 200 + 'px')
                    .style('top', d3.event.pageY - 30 + 'px')
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
                xasix.length * cellSize +
                margin.axisLeft +
                margin.left +
                margin.right +
                margin.legend,
            height = yasix.length * cellSize + margin.axisTop + margin.top + margin.bottom,
            chartHeight = height - (margin.top + margin.bottom + margin.axisTop),
            chartWidth = width - (margin.left + margin.right + margin.axisLeft + margin.legend),
            // Create a color scale

            // [-0.20605, 3.1549] is min and max for allset data from table.
            // var colorRange = [0, 3.1549];

            // Create a size scale for bubbles on top right. Watch out: must be a rootscale!
            // The scaleSqrt scale is useful for sizing circles by area (rather than radius).
            // domain is domain between all data
            // range is between 0 to half of cellsize,   which is radius.

            //   make radius linear scale.  TODO
            // sizeDomain = d3.extent(_.map(data, 'mean_selectivity')),
            sizeDomain = [0, 2],
            size = d3
                .scaleSqrt()
                .domain(sizeDomain)
                .range([0, cellSize / 2]),
            square = d3
                .symbol()
                .type(d3.symbolSquare)
                .size(cellSize * cellSize),
            svg = d3
                .select(el)
                .append('svg')
                .attr('width', Math.max(1000, width + margin.left + margin.right))
                .attr('height', Math.max(1500, height + margin.left + margin.right))
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'),
            tooltip = d3
                .select(el)
                .append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0.0);

        // this.addStripMask(svg);
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

        // //console.log(colorScaleFunction)
        // //console.log(legendScale)
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
        // .on('click', handleYLabelClick)
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
            // .data(data.filter((d) => d.final_dev_call !== 'dev tox'))
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
            .style('stroke-width', '0.8');

        const filteredData = data.filter((d) => d.final_dev_call === 'dev tox');

        const circles = chartLayer
            .selectAll('.circle')
            .data(filteredData)
            .enter()
            .append('g')
            .attr('class', 'cor')
            .attr(
                'transform',
                (d) =>
                    `translate(${xScale(d.x) + xScale.bandwidth() / 2}, ${yScale(d.y) +
                        yScale.bandwidth() / 2})`
            );

        circles
            .append('circle')
            .attr('class', 'circle')
            .attr('r', (d) => {
                return size(Math.abs(d.mean_selectivity));
            })
            .attr('fill', (d) => colorScaleFunction(pod_med_processed(d.mean_pod)))
            .style('opacity', 0.8)
            .style('cursor', 'pointer')
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave)
            .on('click', integrativeHandleCellClick);

        let legendLayer = svg
            .append('g')
            .classed('legendLayer', true)
            .attr('transform', `translate(${width - margin.legend},${margin.top})`);

        let legendCirclesWidth = 6 * cellSize,
            legend = legendLayer
                .append('defs')
                .append('linearGradient')
                .attr('id', 'gradient')
                .attr('x1', '0%')
                .attr('y1', '100%')
                .attr('x2', '0%')
                .attr('y2', '0%')
                .attr('spreadMethod', 'pad'),
            legendHeight = 6 * cellSize;
        //console.log(legendScale);
        let ticks = legendScale.ticks();
        let maxIndex = ticks.length - 1; // Maximum index of ticks array

        //console.log(legendScale, ticks, maxIndex);
        legendScale.ticks().map((d, i) => {
            let offset = (i / maxIndex) * 100; // Calculate offset as a percentage

            legend
                .append('stop')
                // .attr('offset', `${i}%`)
                .attr('offset', `${offset}%`) // Set offset based on index
                .attr('stop-color', colorScaleFunction(d))
                .attr('stop-opacity', 1);
        });
        // Append rectangle to display gradient
        //         legend
        legendLayer
            .append('rect')
            .attr('width', legendCellSize)
            .attr('height', legendHeight)
            .style('fill', 'url(#gradient)')
            // .style('fill', 'url(#legend-gradient)')
            .style('stroke', 'black')
            .attr('transform', `translate(20,${margin.top + margin.axisTop})`);

        legendLayer
            .append('g')
            .attr('class', 'axis y')
            .attr('transform', `translate(${20 + legendCellSize},${margin.top + margin.axisTop})`)
            .call(getLog10AxisFunction(d3.axisRight, legendScale.copy().range([legendHeight, 0])));

        legendLayer
            .append('text')
            .attr('class', 'legend-text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('transform', `translate(20, ${margin.axisTop + legendCellSize / 2})`)
            .text('BMC (µM)')
            .style('font-size', 20);

        // this is white square part.
        legendLayer
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', legendCellSize)
            .attr('height', legendCellSize)
            .attr(
                'transform',
                `translate(${20},
                ${margin.top + margin.axisTop + legendHeight + legendCellSize * 1})`
            )
            .attr('fill', 'transparent')
            .style('stroke', 'black')
            .style('stroke-width', '1');

        legendLayer
            .append('text')
            .attr('class', 'legend-text')
            .attr('x', 0)
            .attr('y', 0)
            .attr(
                'transform',
                `translate(${20 + cellSize},
                ${margin.top +
                    margin.axisTop +
                    legendHeight +
                    legendCellSize +
                    legendCellSize / 2})`
            )
            .text('non-specific, non-toxic, inconclusive');

        // the reason I put 25/2 into this position transform, because square size is (25, 25),
        // make sure star is in center, make is position to be 25/2, 25/2

        // this is grey square part.
        legendLayer
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', legendCellSize)
            .attr('height', legendCellSize)
            .attr(
                'transform',
                `translate(${20},
                ${margin.top +
                    margin.axisTop +
                    legendHeight +
                    legendCellSize * 2 +
                    legendCellSize / 2})`
            )
            .attr('mask', 'url(#stripeMask)')
            .attr('fill', '#ccc');

        legendLayer
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', legendCellSize)
            .attr('height', legendCellSize)
            .attr(
                'transform',
                `translate(${20},
                ${margin.top +
                    margin.axisTop +
                    legendHeight +
                    legendCellSize * 2 +
                    legendCellSize / 2})`
            )
            .attr('fill', 'transparent')
            .style('stroke', 'black')
            .style('stroke-width', '1');

        legendLayer
            .append('text')
            .attr('class', 'legend-text')
            .attr('x', 0)
            .attr('y', 0)
            .attr(
                'transform',
                `translate(${20 + cellSize},
                ${margin.top +
                    margin.axisTop +
                    legendHeight +
                    legendCellSize * 2 +
                    legendCellSize})`
            )
            .text('not evaluated');
        //
        legendLayer
            .append('text')
            .attr('class', 'legend-text')
            .attr('x', 0)
            .attr('y', 0)
            .attr(
                'transform',
                `translate(20,
                ${margin.top + margin.axisTop + legendHeight + legendCellSize * 5})`
            )
            .text('specificity')
            .style('font-size', 20);

        let legendCircles = legendLayer.append('g').classed('legendCircles', true);
        let spaceBetweenCircles = 10;
        legendCircles
            .selectAll('circle')
            .data(legendCirclesSizes)
            .enter()
            .append('circle')
            .attr('r', (d) => {
                return size(Math.abs(d));
            })
            .attr('fill', 'none')
            .attr('cx', (d, i) => i * (cellSize + spaceBetweenCircles) + 30)
            .attr('cy', margin.top + margin.axisTop + legendHeight + legendCellSize * 6)
            .style('stroke', 'black')
            .style('stroke-width', '1');

        legendCircles
            .selectAll('text')
            .data(legendCirclesSizes)
            .enter()
            .append('text')
            .attr('class', 'legend-text')
            .attr('x', (d, i) => i * (cellSize + spaceBetweenCircles) + 20)
            .attr('y', margin.top + margin.axisTop + legendHeight + legendCellSize * 8) // Adjusted y-coordinate
            // .attr('text-anchor', 'middle') // Center the text horizontally
            .attr('dominant-baseline', 'middle') // Center the text vertically
            .text((d) => d.toFixed(1));
    };

    _unrenderPlot() {
        if (this.refs.svg === undefined) {
            return;
        }
        window.removeEventListener('resize', this.handleResize);
        this.refs.svg.innerHTML = '';
    }

    _renderPlot() {
        if (this.refs.svg === undefined) {
            return;
        }
        this._unrenderPlot();
        // this is bootstrap plot svg

        this.renderPlot(this.refs.svg, this.props.data, this.props.legendData);

        window.addEventListener('resize', this.handleResize);
    }

    handleResize() {
        this._renderPlot();
    }

    componentDidMount() {
        this._renderPlot();
    }

    componentDidUpdate() {
        this._renderPlot();
    }

    componentWillUnmount() {
        this._unrenderPlot();
    }

    render() {
        return <div id="IA_heatmap02" ref="svg" />;
    }
}

DevtoxHeatmap.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            x: PropTypes.string,
            y: PropTypes.string,
            fill: PropTypes.string,
        })
    ).isRequired,
    legendData: PropTypes.shape({
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
    ontologyType: PropTypes.number.isRequired,
};

export default DevtoxHeatmap;
