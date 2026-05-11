import React from 'react';
import { useCallback, useRef } from 'react';

import _ from 'lodash';
import $ from '$';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import DoseResponse from './DoseResponse';
import {
    getBmdsUrl,
    getDoseResponsesUrl,
    integrativeHandleCellClick,
    NO_COLLAPSE,
    svg_download_form,
} from '../shared';
import BootstrapModal from 'utils/BootstrapModal';
import RankedBarchartHandler from './RankedBarchartHandler';

import {
    AXIS_LINEAR,
    AXIS_LOG10,
    AXIS_SQRT,
    CATEGORY_COLORS,
    BMDVIZ_SELECTIVITY,
    printFloat,
    pod_med_processed,
    BMCHandleCellClick,
} from '../shared';

import { getLog10AxisFunction } from 'utils/d3';
import { merge } from 'lodash/object';

let renderPlot = function(el, data, opts) {
    // stateless; outside react component
    // clear div if non-empty
    $(el).empty();
    //
    if (data.length === 0) {
        $(el).append('<div class="alert alert-info"><p>No BMC data are available.</p></div>');
        return;
    }
    let nonviabilityData, viabilityData;

    nonviabilityData = _.chain(data)
        .map('minimimumNonViability')
        .filter((d) => d.med_pod_med !== null)
        .compact()
        .value();

    viabilityData = _.chain(data)
        .map('minimimumViability')
        .filter((d) => d.mort_med_pod_med !== null)
        .compact()
        .value();

    // console.log("data", data)
    // console.log("nonviabilityData", nonviabilityData)
    // console.log("viabilityData", viabilityData)

    // viabilityData is black dot, NonviabilityData is colored dots.
    //console.log('data2', data, nonviabilityData, viabilityData);
    // set dimensions and margins
    let elWidth = Math.max(Math.floor($(el).innerWidth()), 800),
        margin = { top: 40, right: 100, bottom: 50, left: 300, footnote: 200 },
        width = elWidth - margin.left - margin.right,
        height = data.length * 20 - margin.top - margin.bottom + margin.footnote,
        footnoteHeight = 50,
        categoryWidth = 150,
        categoryPadding = 5,
        barStart = categoryWidth + categoryPadding * 2;
    // console.log(height)
    // console.log( height + margin.top + margin.bottom)
    //
    // console.log(height + margin.top - margin.bottom)

    let xScaleFunction = d3.scaleLog;

    //set the ranges
    let extent = d3.extent(
            _.compact(
                _.flattenDeep([
                    _.map(nonviabilityData, (d) => [
                        pod_med_processed(d.med_pod_med),
                        pod_med_processed(d.min_pod_med),
                        pod_med_processed(d.max_pod_med),
                    ]),
                    _.map(viabilityData, (d) => [
                        pod_med_processed(d.mort_med_pod_med),
                        pod_med_processed(d.mort_min_pod_med),
                        pod_med_processed(d.mort_max_pod_med),
                    ]),
                ])
            )
        ),
        x = xScaleFunction()
            .range([1, width - barStart]) // use 1 instead of 0 so there's a bar to click on
            .domain(extent)
            .clamp(true),
        y = d3
            .scaleBand()
            .range([0, height])
            .padding(0.1)
            .domain(data.map((d) => d.preferred_name));

    //
    // append plot
    let svg = d3
        .select(el)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    let barG = svg.append('g').attr('transform', `translate(${barStart},0)`);

    if (opts.isSelective) {
        // add mort_pod_med circle, color bar and dot.
        // console.log(nonviabilityData)
        barG.selectAll('.pod-circle')
            .data(nonviabilityData)
            .enter()
            .append('circle')
            .attr('class', 'pod-circle')
            // .attr('cx', (d) => x(pod_med_processed(d.med_pod_med)))
            .attr('cx', (d) => x(pod_med_processed(d.mean_pod)))
            .attr('cy', (d) => y(d.preferred_name) + y.bandwidth() / 2)
            .attr('r', 10)
            .style('fill', (d) => CATEGORY_COLORS[d.use_category1])
            .style('cursor', 'pointer')
            .on('click', function(d) {
                BMCHandleCellClick(d, 'nonviabilityData');
            });
    } else {
        barG.selectAll('.pod-errorbar')
            .data(nonviabilityData)
            .enter()
            .append('line')
            .attr('class', 'pod-errorbar')
            .attr('x1', (d) =>
                x(d3.min([pod_med_processed(d.min_pod_med), pod_med_processed(d.med_pod_med)]))
            )
            .attr('x2', (d) =>
                x(d3.max([pod_med_processed(d.med_pod_med), pod_med_processed(d.max_pod_med)]))
            )
            .attr('y1', (d) => y(d.preferred_name) + y.bandwidth() / 2)
            .attr('y2', (d) => y(d.preferred_name) + y.bandwidth() / 2)
            .style('stroke', (d) => CATEGORY_COLORS[d.use_category1])
            .style('stroke-width', 8)
            .style('pointer-events', 'none');

        // add mort_pod_med circle, color bar and dot.

        barG.selectAll('.pod-circle')
            .data(nonviabilityData)
            .enter()
            .append('circle')
            .attr('class', 'pod-circle')
            .attr('cx', (d) => x(pod_med_processed(d.med_pod_med)))
            .attr('cy', (d) => y(d.preferred_name) + y.bandwidth() / 2)
            .attr('r', 10)
            .style('fill', (d) => CATEGORY_COLORS[d.use_category1])
            .style('cursor', 'pointer')
            .on('click', function(d) {
                BMCHandleCellClick(d, 'nonviabilityData');
            });
    }
    // add pod_med error bars

    // add viabilityData error bars
    barG.selectAll('.mort_pod-errorbar')
        .data(viabilityData)
        .enter()
        .append('line')
        .attr('class', 'mort_pod-errorbar')
        .attr('x1', (d) =>
            x(
                d3.min([
                    pod_med_processed(d.mort_min_pod_med),
                    pod_med_processed(d.mort_med_pod_med),
                ])
            )
        )
        .attr('x2', (d) =>
            x(
                d3.max([
                    pod_med_processed(d.mort_med_pod_med),
                    pod_med_processed(d.mort_max_pod_med),
                ])
            )
        )
        .attr('y1', (d) => y(d.preferred_name) + y.bandwidth() / 2)
        .attr('y2', (d) => y(d.preferred_name) + y.bandwidth() / 2)
        .style('stroke', 'black')
        .style('stroke-width', 4)
        .style('stroke-dasharray', '4, 2')
        .style('pointer-events', 'none')
        .style('opacity', 0.8);

    // add viabilityData circle
    barG.selectAll('.mort_pod-circle')
        .data(viabilityData)
        .enter()
        .append('circle')
        .attr('class', 'mort_pod-circle')
        .attr('cx', (d) => x(pod_med_processed(d.mort_med_pod_med)))
        .attr('cy', (d) => y(d.preferred_name) + y.bandwidth() / 2)
        .attr('r', 7)
        .style('fill', 'black')
        .style('opacity', 0.8)
        .style('cursor', 'pointer')
        .on('click', function(d) {
            BMCHandleCellClick(d, 'viabilityData');
        });

    // add selectivity-ratio text
    if (opts.isSelective) {
        // axis label
        svg.append('text')
            .attr('x', elWidth - margin.right - margin.left + 10)
            .attr('y', -8)
            .style('font-weight', 'bold')
            .style('font-family', 'sans-serif')
            .text('Specificity');

        svg.selectAll('.selectivity-text')
            .data(nonviabilityData)
            .enter()
            .append('text')
            .attr('x', elWidth - margin.right - margin.left + 24)
            .attr('y', (d) => y(d.preferred_name) + y.bandwidth() / 2)
            .attr('dy', '0.35em')
            .style('font-family', 'sans-serif')
            .text((d) => {
                return d.med_mort_hit_confidence < 0.5
                    ? `≥ ${printFloat(d.mean_selectivity)}`
                    : printFloat(d.mean_selectivity);
            })
            .each(function(d) {
                if (d.med_mort_hit_confidence < 0.5) {
                    // add footnote; adjust text so that numbers are aligned
                    d3.select(this)
                        .attr('x', elWidth - margin.right - margin.left + 10)
                        .append('tspan')
                        .text('†')
                        .attr('baseline-shift', 'super')
                        .attr('font-size', '0.7em');
                }
            });
        let SELECTIVITY_FOOTNOTE =
            'Specificity is estimated and true value may be higher; mortality BMC could not be calculated and was therefore estimated to equal the maximum tested dose.';
        // add footnote
        svg.append('text')
            .attr('x', -margin.left + 10)
            .attr('y', height + margin.top - margin.bottom + footnoteHeight)
            // .attr('y', height + margin.top - margin.bottom + 10)
            .attr('font-size', '1.3em')
            .style('font-family', 'sans-serif')
            .text(`† ${SELECTIVITY_FOOTNOTE}`);
    }

    // append category ids
    svg.selectAll('.category')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'category')
        .attr('x', categoryPadding)
        .attr('width', categoryWidth)
        .attr('y', (d) => y(d.preferred_name))
        .attr('height', y.bandwidth())
        .style('fill', (d) => CATEGORY_COLORS[d.use_category1]);

    // append category label
    svg.selectAll('.category-text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', categoryPadding + 2)
        .attr('y', (d) => y(d.preferred_name) + y.bandwidth() / 2)
        .attr('dy', '0.35em')
        // .attr('dy', '0.5em')
        .text((d) => d.use_category1)
        .style('fill', 'white');

    // add axes
    // svg.append('g').call(d3.axisLeft(y));
    // add axes
    svg.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text') // Select all text elements within the y-axis
        .style('font-size', '16px'); // Adjust the font size as needed

    let axisFn =
        opts.selectedAxis === AXIS_LOG10 ? getLog10AxisFunction(d3.axisTop, x) : d3.axisTop(x);

    barG.append('g').call(axisFn);

    // axis label
    barG.append('text')
        .attr('transform', `translate(${(width - barStart) / 2}, -25)`)
        .style('text-anchor', 'middle')
        .text('Benchmark concentration value (BMC) (µM)');

    // add legend
    let barLegend = svg
        .append('g')
        .data([{ x: 10, y: -23 }])
        .attr('transform', 'translate(10, -23)')
        .call(
            d3.drag().on('drag', function(d) {
                d.x += d3.event.dx;
                d.y += d3.event.dy;
                d3.select(this).attr('transform', `translate(${d.x},${d.y})`);
            })
        );

    barLegend
        .append('rect')
        .attr('x', 0)
        .attr('width', 140)
        .attr('y', -15)
        .attr('height', 35)
        .style('fill', 'white')
        .style('stroke', 'black')
        .style('stroke-width', '2px')
        .style('cursor', 'pointer')
        .attr('title', 'Drag to reposition');

    let colors = _.values(CATEGORY_COLORS);

    barLegend
        .selectAll('.__')
        .data([
            { y: -8, sw: 4, da: '10, 0', color: colors[0] },
            { y: -2, sw: 4, da: '10, 0', color: colors[9] },
            { y: 10, sw: 3, da: '4, 2', color: 'black' },
        ])
        .enter()
        .append('line')
        .attr('x1', 2)
        .attr('x2', 36)
        .attr('y1', (d) => d.y)
        .attr('y2', (d) => d.y)
        .style('stroke', (d) => d.color)
        .style('stroke-width', (d) => d.sw)
        .style('stroke-dasharray', (d) => d.da)
        .style('opacity', 0.75);

    barLegend
        .selectAll('.__')
        .data([
            { x: 12, r: 7, y: -8, color: colors[0] },
            { x: 25, r: 7, y: -2, color: colors[9] },
            { x: 20, r: 5, y: 10, color: 'black' },
        ])
        .enter()
        .append('circle')
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('r', (d) => d.r)
        .style('fill', (d) => d.color)
        .style('opacity', 0.75);

    barLegend
        .append('text')
        .attr('x', 38)
        .attr('y', 0)
        .text('non-mortality');

    barLegend
        .append('text')
        .attr('x', 38)
        .attr('y', 15)
        .text('mortality');
};

class RankedBarChart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._renderPlot(this.props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        this._renderPlot(nextProps);
        return false;
    }

    _renderPlot(props) {
        renderPlot(this.refs.bmd_svg, props.data, {
            isSelective: props.visualization === BMDVIZ_SELECTIVITY,
            selectedAxis: props.selectedAxis,
            selectivityList: props.selectivityList === BMDVIZ_SELECTIVITY,
        });
    }

    render() {
        return <div id="BMC_heatmap01" ref="bmd_svg" />;
    }
}

export default RankedBarChart;
