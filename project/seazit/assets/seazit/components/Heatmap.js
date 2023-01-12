import $ from '$';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import Tooltip from '@material-ui/core/Tooltip';

import BootstrapModal from 'utils/BootstrapModal';
import { Header, SingleCurveBody, MultipleCurveBody } from './DoseResponseModel';
import { getDoseResponsesUrl, integrativeHandleCellClick, NO_COLLAPSE } from '../shared';

import styles from './graph.css';
// import styles from './ResponseFigure.css';

import { getLog10AxisFunction } from 'utils/d3';
import DoseResponseGridWidget from '../widgets/DoseResponseGridWidget';
import IntegrativeCheckBoxWidget from '../widgets/IntegrativeCheckBoxWidget';
import DoseResponseMort120 from './DoseResponseMort120';

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
let StaticExample = function() {
    return (
        <div className="col-sm-10">
            <iframe
                src="https://comptox.epa.gov/dashboard-api/ccdapp1/chemical-files/image/by-dtxsid/DTXSID6021248"
                width="400"
                height="400"
            ></iframe>
        </div>
    );
};
let renderPlot = function(el, data, legendData) {
    $(el).empty();
    console.log('data');
    console.log(data);

    let margin = {
            top: 40,
            left: 10,
            bottom: 40,
            right: 40,
            axisLeft: 290,
            axisTop: 390,
            legend: 300,
        },
        cellSize = 50,
        xMap = _.groupBy(data, 'x'),
        yMap = _.groupBy(data, 'y'),
        handleXLabelClick = function(label) {
            console.log('label');
            console.log(label);
            console.log(xMap);

            let cells = xMap[label],
                // casrns = _.map(cells, 'y_key'),
                general_ids = [
                    ...new Set(cells.map((item) => item.developmental_defect_grouping_general)),
                ],
                granular_ids = [
                    ...new Set(cells.map((item) => item.developmental_defect_grouping_granular)),
                ],
                protocol_source_ids = [...new Set(cells.map((item) => item.protocol_source))];

            console.log(cells);
            console.log('general_ids');
            console.log(general_ids);

            console.log('granular_ids');
            console.log(granular_ids);

            console.log('protocol_source_ids');
            console.log(protocol_source_ids);

            // new BootstrapModal(Header, MultipleCurveBody, {
            //     title: label,
            //     readout_ids,
            //     casrns,
            // });
        },
        // draw y-axis
        handleYLabelClick = function(label) {
            console.log('label');
            console.log(label);
            console.log(yMap);
            let cells = yMap[label],
                // casrns = [cells[0].y_key],
                // readout_ids = _.map(cells, 'x_key')
                casrns = [...new Set(cells.map((item) => item.casrn))],
                dtxsids = [...new Set(cells.map((item) => item.dtxsid))];
            console.log(cells);
            console.log(casrns);
            console.log(dtxsids);
            console.log('Header');
            console.log(Header);

            // new BootstrapModal(Header, MultipleCurveBody, {
            //     title: label,
            //     readout_ids,
            //     casrns,
            // });
            new BootstrapModal(Header, StaticExample, {
                title: 'ZW Chemical Example label',
                casrns,
            });
        },
        mouseover = function(d) {
            tooltip.style('opacity', 1);
        },
        mousemove = function(d) {
            if (d.endPointList) {
                tooltip
                    .html(
                        `${d.devtoxEndPointList.length} out of ${d.endPointList.length} endpoints are significant`
                    )
                    .style('left', d3.event.pageX - 400 + 'px')
                    .style('top', d3.event.pageY - 300 + 'px')
                    .style('opacity', 1.0);
            }
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
        // how we get this 900,  check cellSize = 30.  30*30 = 900.
        square = d3
            .symbol()
            .type(d3.symbolSquare)
            .size(cellSize * cellSize),
        // Create the svg area

        svg = d3
            .select(el)
            .append('svg')
            .attr('width', Math.max(1000, width + margin.left + margin.right))
            .attr('height', Math.max(1000, height + margin.left + margin.right))
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'),
        tooltip = d3
            .select(el)
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0.0);

    // addStripMask(svg);

    let axisLayer = svg
        .append('g')
        .classed('axisLayer', true)
        .attr('width', width)
        .attr('height', height);

    // draw xy-axis
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
        .style('cursor', 'pointer')
        .on('click', handleYLabelClick);

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
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)
        .on('click', integrativeHandleCellClick);

    // draw legend, this legend length, size is fixed.
    // 2 cases, discrete = activity,  continuous = BMC, different legned form.
    let legendLayer = svg
        .append('g')
        .classed('legendLayer', true)
        .attr('transform', `translate(${width - margin.legend},${margin.top})`);

    switch (legendData.type) {
        case 'discrete': {
            // console.log(legendData.values)
            legendLayer
                .selectAll('text')
                .data(legendData.values)
                .enter()
                .append('text')
                .attr('class', styles.legendText)
                .attr(
                    'transform',
                    (d, i) =>
                        `translate(${15 + cellSize}, ${i * cellSize +
                            margin.axisTop +
                            (cellSize - 20) / 2 +
                            cellSize})`
                )
                .text((d) => d.label);

            legendLayer
                .append('text')
                .attr('class', styles.legendText)
                .attr('x', 0)
                .attr('y', 0)
                .attr(
                    'transform',
                    (d, i) => `translate(25, ${margin.axisTop + (cellSize - 20) / 2})`
                )
                .html('Developmental Toxicity Classification')
                .style('font-size', 20);

            let ds = legendLayer
                .selectAll('path')
                .data(legendData.values)
                .enter()
                .append('rect')
                .attr('width', cellSize - 20)
                .attr('height', cellSize - 20)
                .attr('fill', (d) => d.fill)
                .attr(
                    'transform',
                    (d, i) => `translate(25, ${i * cellSize + margin.axisTop + cellSize})`
                )
                .style('stroke', 'black')
                .style('stroke-width', '1');

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
