import $ from '$';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import {
    extent,
    select,
    scaleLog,
    scalePoint,
    axisLeft,
    axisBottom,
    randomNormal,
    format,
    symbol,
    symbolCircle,
    symbolTriangle,
} from 'd3';
import BootstrapModal from 'utils/BootstrapModal';
import { Header, SingleCurveBody, MultipleCurveBody } from './DoseResponseModal';

import styles from './ResponseFigure.css';

import { getLog10AxisFunction } from 'utils/d3';
import { CATEGORY_COLORS } from '../shared';

let renderPlot = function(el, data, legendData) {
    // stateless; outside react component
    // //ZW 10-24
    // rmb,  el is ref.svg.
    console.log(el);
    console.log('data in responseFigure');
    console.log(data);

    //   data prepare
    // filter data by bmd, if bmd is not null.
    ////  xMap and yMap is used to handle click function.
    // setup margin and prepare data
    var xData = _.chain(data)
            .map('x')
            .uniq()
            .sort()
            .value(),
        yData = _.chain(data)
            .map('y')
            .uniq()
            .sort()
            .value(),
        allDoses = _.chain(data)
            .map((d) => [d.bmd, d.seem3_cmean, d.seem3_l95, d.seem3_u95])
            //            .map((d) => [d.bmd, d.seem3_cmean])
            .flattenDeep()
            .filter((d) => d > 0)
            .value(),
        svgSize = el.getBoundingClientRect(),
        svg = d3.select(el),
        // I must mention,  seem3_l95 and seem3_u95 number are too small, which
        // makes the x scale too big. The dots are overlaping.

        chartMargin = { top: 10, left: 50, bottom: 40, right: 30 },
        chartHeight = svgSize.height - (chartMargin.top + chartMargin.bottom);
    // draw layers
    var axisLayer = svg
        .append('g')
        .classed('axisLayer', true)
        .attr('width', svgSize.width)
        .attr('height', svgSize.height);

    // draw y-axis
    var yScale = d3
        .scalePoint()
        .domain(yData)
        .range([0, chartHeight])
        .padding(0.5);

    var yAxis = axisLeft(yScale);
    axisLayer
        .append('g')
        .attr('class', 'axis y')
        .call(yAxis);

    // reset y-axis margin to actual size
    var width = axisLayer
        .select('.y')
        .node(0)
        .getBoundingClientRect().width;

    chartMargin.left = Math.round(width) + 25;

    axisLayer.select('.y').attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`);

    var chartWidth = svgSize.width - (chartMargin.left + chartMargin.right);

    // extent(allDoses) means the min and max value of allDoses, [min, max]

    //  draw x-axis
    var xScale = d3
        .scaleLog()
        .domain(extent(allDoses))
        .range([0, chartWidth])
        .nice();
    axisLayer
        .append('g')
        .attr('transform', `translate(${chartMargin.left}, ${chartMargin.top + chartHeight})`)
        .attr('class', 'axis x')
        .call(getLog10AxisFunction(axisBottom, xScale));
    //  draw x-axis end

    var chartLayer = svg
        .append('g')
        .classed('chartLayer', true)
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`);

    // draw background lines
    chartLayer
        .selectAll(styles.refLine)
        .data(yScale.domain())
        .enter()
        .append('line')
        .attr('class', styles.refLine)
        .attr('x1', xScale.range()[0] + 2)
        .attr('x2', xScale.range()[1])
        .attr('y1', (d) => yScale(d))
        .attr('y2', (d) => yScale(d));

    chartLayer
        .append('rect')
        .attr('class', styles.rectBox)
        .attr('x', xScale.range()[0])
        .attr('y', yScale.range()[0])
        .attr('width', xScale.range()[1])
        .attr('height', yScale.range()[1]);

    // draw color

    var handleCellClick = function(d) {
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
    var tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0.0);

    // draw data
    let jitter = randomNormal(0, 0.5);
    let getPopoverContent = function(d) {
        let lis = d.map((d2) => `<li>${d2[3]}: ${d2[1].toCustomString()}</li>`).join('');
        return `<ul>${lis}</ul>`;
    };
    let gs = chartLayer
        .selectAll(styles.assayDot)
        .data(data)
        .enter()
        .append('g');

    let circle = symbol()
        .type(symbolCircle)
        .size(100);
    gs.selectAll(styles.assayDot)
        // filter the bmd value is null dataset.
        .data(
            data.filter(function(d) {
                return d.bmd !== null;
            })
        )
        .enter()
        .append('path')
        .attr('class', styles.assayDot)
        .attr('d', circle)
        .attr('transform', (d) => `translate(${xScale(d.bmd)}, ${yScale(d.y) + jitter()})`)
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .on('click', handleCellClick);

    let triangle = symbol()
        .type(symbolTriangle)
        .size(100);

    let g2 = chartLayer
        .append('g')
        .attr('class', 'seem3_cmean')
        .selectAll('path')
        .data(
            data.filter(function(d) {
                return d.seem3_cmean !== null;
            })
        )
        .enter()
        .append('path')
        .attr('d', triangle)
        .attr('class', styles.seem3Triangle)
        .attr('transform', (d) => `translate(${xScale(d.seem3_cmean)}, ${yScale(d.y) + jitter()})`)
        .on('mouseover', function(d) {
            tooltip
                .html(
                    `seem3_cmean = <br/> ${d.seem3_cmean} <br/>seem3_l95 = <br/> ${d.seem3_l95} <br/> seem3_u95 = <br/> ${d.seem3_u95}`
                )
                //                .html(d.seem3_cmean)
                .style('left', d3.event.pageX + 'px')
                .style('top', d3.event.pageY + 50 + 'px')
                .style('opacity', 1.0);
        })
        .on('mouseout', function(d) {
            tooltip.style('opacity', 0.0);
        })
        .append('title')
        .text((d) => `seem3_cmean ${d} mg/kg/day`);
    chartLayer
        .selectAll('seem3_l95_u95_bar')
        .data(
            data.filter(function(d) {
                return d.seem3_cmean !== null;
            })
        )
        .enter()
        .append('line')
        .attr('class', 'seem3_l95_u95_bar')
        //        .attr('x1',  (d) => xScale(d.seem3_l95))
        .attr('x1', (d) => xScale(d.seem3_cmean))
        .attr('x2', (d) => xScale(d.seem3_u95))
        .attr('y1', (d) => yScale(d.y))
        .attr('y2', (d) => yScale(d.y))
        .style('stroke', '#bd0008')
        .style('stroke-width', 10)
        .style('opacity', 0.1)
        .style('pointer-events', 'none');

    // zw 10-6  color bar plot =, idea from RankedBarchart.js
    // setup d3plot yCategoryColor
    // setup input data colorData, actually use Data is fine.
    let categoryPadding = 5,
        categoryWidth = 130,
        margin = { top: 40, right: 100, bottom: 25, left: 300 },
        height = data.length * 20 + 100 - margin.top - margin.bottom,
        colors = _.values(CATEGORY_COLORS);

    let colorData = _.uniqBy(data, 'y');

    let yCategoryColor = d3
        .scaleBand()
        .range([0, chartHeight])
        .padding(0.05)
        .domain(data.map((d) => d.chemical_name));
    //        .domain(colorData.map((d) => d.chemical_name));

    chartLayer
        .selectAll('.category')
        .data(data)
        //        .data(colorData)
        .enter()
        .append('rect')
        .attr('class', 'category')
        .attr('x', categoryPadding)
        .attr('width', categoryWidth)
        .attr('y', (d) => yScale(d.y) - yCategoryColor.bandwidth() / 2)
        //        .attr('y', (d) => yCategoryColor(d.y))
        .attr('height', yCategoryColor.bandwidth())
        .style('fill', (d) => CATEGORY_COLORS[d.chemical_category]);

    // append category label
    chartLayer
        .selectAll('.category-text')
        .data(data)
        //        .data(colorData)
        .enter()
        .append('text')
        .attr('x', categoryPadding + 2)
        .attr('y', (d) => yScale(d.y))
        .attr('dy', '0.35em')
        .text((d) => d.chemical_category)
        .style('fill', 'white');

    // draw g2 is for seem3_cmean data, which is red triangle in origin IVIVE .no need.

    // draw legend rect box.
    let legend_g = chartLayer
        .append('g')
        .attr('transform', `translate(${xScale.range()[1] - 50},${yScale.range()[0] + 35} )`);
    //        .attr('transform', `translate(${xScale.range()[1] - 115},${15})`);

    legend_g
        .append('rect')
        .attr('class', styles.legendBox)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 65)
        .attr('height', 35);

    legend_g
        .selectAll('text')
        .data(['BMD', 'seem3'])
        .enter()
        .append('text')
        .attr('class', styles.legendText)
        .attr('x', 18)
        .attr('y', (d, i) => (i + 1) * 15)
        .text((d) => d);

    legend_g
        .append('path')
        .attr('d', circle)
        .attr('class', styles.assayDot)
        .attr('transform', 'translate(11, 11)');

    legend_g
        .append('path')
        .attr('d', triangle)
        .attr('class', styles.seem3Triangle)
        .attr('transform', 'translate(11, 27)');

    // draw labels
    axisLayer
        .append('text')
        .attr('class', `xLabel ${styles.label}`)
        .attr('x', chartMargin.left + chartWidth / 2)
        .attr('y', chartMargin.top + chartHeight + chartMargin.bottom * 0.75)
        .text('BMC');

    axisLayer
        .append('text')
        .attr('class', `yLabel ${styles.label}`)
        .attr('x', 15)
        .attr('y', chartMargin.top + chartHeight / 2)
        .attr('transform', `rotate(${270}, ${15}, ${chartMargin.top + chartHeight / 2})`)
        .text('Chemicals');
};

class ResponseFigure extends Component {
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
        //        let svg = this.refs.svg;
        this.renderPlot();
    }

    componentDidUpdate() {
        this.renderPlot();
    }

    componentWillUnmount() {
        this.unrenderPlot();
    }

    render() {
        //        return (<div className="row-fluid" ref="svg" />);
        //   validData is unquie chemical name number, height is the big chart height
        // depends on chemical number.
        // I added another var validataLength to get unique chemicals.
        let validData = this.props.data.filter(function(e) {
                return e.y !== null;
            }),
            validDataLength = [...new Set(validData.map((x) => x.y))].length,
            //            height = validData.length * 10 + 100;
            height = validDataLength * 50 + 100;

        return (
            <div id="figure" className="row-fluid">
                <svg ref="svg" style={{ width: '100%', height: `${height}px` }} />
            </div>
        );
    }
}

ResponseFigure.propTypes = {
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

export default ResponseFigure;
