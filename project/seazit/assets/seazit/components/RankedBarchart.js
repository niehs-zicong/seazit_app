import React from 'react';
import { useCallback, useRef } from 'react';

import _ from 'lodash';
import $ from '$';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import DoseResponse from './DoseResponse';
import { getBmdsUrl, getDoseResponsesUrl, NO_COLLAPSE, svg_download_form } from '../shared';
import BootstrapModal from 'utils/BootstrapModal';
import { Header, SingleCurveBody, ParrallelCurveBody } from './DoseResponseModal';
import RankedBarchartHandler from './RankedBarchartHandler';

import {
    AXIS_LINEAR,
    AXIS_LOG10,
    AXIS_SQRT,
    CATEGORY_COLORS,
    BMDVIZ_SELECTIVITY,
    SELECTIVITY_FOOTNOTE,
    printFloat,
} from '../shared';

import { getLog10AxisFunction } from 'utils/d3';

let renderPlot = function(el, data, opts) {
    // stateless; outside react component
    // clear div if non-empty
    $(el).empty();
    //
    if (data.length === 0) {
        $(el).append('<div class="alert alert-info"><p>No BMC data are available.</p></div>');
        return;
    }
    console.log('rankdedchart data');
    console.log(data);
    console.log(opts);
    console.log(el);
    // let pod_medData, mort_pod_medData ;
    let medData, pod_medData, mort_pod_medData;
    medData = _.sortBy(data.bmc_min_max_result, 'med_pod_med');
    pod_medData = _.filter(medData, (d) => d.med_pod_med !== null);
    mort_pod_medData = _.filter(medData, (d) => d.mort_med_pod_med !== null);

    console.log('rankdedchart data');
    console.log(medData);
    console.log(pod_medData);
    console.log(mort_pod_medData);

    // set dimensions and margins
    let elWidth = Math.max(Math.floor($(el).innerWidth()), 800),
        margin = { top: 40, right: 100, bottom: 25, left: 300 },
        width = elWidth - margin.left - margin.right,
        height = medData.length * 20 + 100 - margin.top - margin.bottom,
        categoryWidth = 150,
        categoryPadding = 5,
        barStart = categoryWidth + categoryPadding * 2;

    let xScaleFunction = d3.scaleLog;
    // if (opts.selectedAxis === AXIS_LOG10) {
    //     xScaleFunction = d3.scaleLog;
    // }

    //set the ranges
    let extent = d3.extent(
            _.compact(
                _.flattenDeep([
                    _.map(pod_medData, (d) => [
                        Math.pow(10, d.med_pod_med) * 1000000,
                        Math.pow(10, d.min_pod_med) * 1000000,
                        Math.pow(10, d.max_pod_med) * 1000000,
                    ]),
                    _.map(mort_pod_medData, (d) => [
                        Math.pow(10, d.mort_med_pod_med) * 1000000,
                        Math.pow(10, d.mort_min_pod_med) * 1000000,
                        Math.pow(10, d.mort_max_pod_med) * 1000000,
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
            .domain(medData.map((d) => d.preferred_name));

    console.log(extent);
    console.log(y);

    let showDoseResponse = function(d) {
        // if there is no second element, readout_id.
        // not quite sure if readout_id 0 is not a certain id.
        // i made this 0 , meaning that not exist.
        var d2 = pod_medData.concat(mort_pod_medData).filter((a) => {
            return a.chemical_casrn == d.chemical_casrn && a.readout_id != d.readout_id;
        });
        if (d2.length == 0) {
            var _ = {};
            _.readout_id = 0;
            d2.push(_);
        }
        // ZW 730
        new BootstrapModal(Header, ParrallelCurveBody, {
            title: `${d.preferred_name} (${d.chemical_casrn}): ${d.readout_endpoint}`,
            readout_id: [d.readout_id, d2[0].readout_id],
            casrn: d.chemical_casrn,
        });
    };

    // append plot
    let svg = d3
        .select(el)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    let barG = svg.append('g').attr('transform', `translate(${barStart},0)`);

    // add pod_med error bars
    barG.selectAll('.nonviability-errorbar')
        .data(pod_medData)
        .enter()
        .append('line')
        .attr('class', 'nonviability-errorbar')
        .attr('x1', (d) =>
            x(
                d3.min([
                    Math.pow(10, d.min_pod_med) * 1000000,
                    Math.pow(10, d.med_pod_med) * 1000000,
                ])
            )
        )
        .attr('x2', (d) =>
            x(
                d3.max([
                    Math.pow(10, d.med_pod_med) * 1000000,
                    Math.pow(10, d.max_pod_med) * 1000000,
                ])
            )
        )
        // .attr('x1', (d) => x(Math.pow(10, d.min_pod_med) * 1000000))
        // .attr('x2', (d) => x(Math.pow(10, d.max_pod_med) * 1000000))
        .attr('y1', (d) => y(d.preferred_name) + y.bandwidth() / 2)
        .attr('y2', (d) => y(d.preferred_name) + y.bandwidth() / 2)
        // .style('stroke', (d) => CATEGORY_COLORS[d.chemical_category])
        .style('stroke-width', 8)
        .style('pointer-events', 'none');

    // add mort_pod_med circle
    barG.selectAll('.nonviability-circle')
        .data(pod_medData)
        .enter()
        .append('circle')
        .attr('class', 'nonviability-circle')
        .attr('cx', (d) => x(Math.pow(10, d.med_pod_med) * 1000000))
        .attr('cy', (d) => y(d.preferred_name) + y.bandwidth() / 2)
        .attr('r', 10)
        // .style('fill', (d) => CATEGORY_COLORS[d.chemical_category])
        .style('cursor', 'pointer')
        .on('click', showDoseResponse);

    // add mort_pod_medData error bars
    barG.selectAll('.viability-errorbar')
        .data(mort_pod_medData)
        .enter()
        .append('line')
        .attr('class', 'viability-errorbar')
        // .attr('x1', (d) => x(Math.pow(10, d.mort_min_pod_med) * 1000000))
        // .attr('x2', (d) => x(Math.pow(10, d.mort_max_pod_med) * 1000000))

        .attr('x1', (d) =>
            x(
                d3.min([
                    Math.pow(10, d.mort_min_pod_med) * 1000000,
                    Math.pow(10, d.mort_med_pod_med) * 1000000,
                ])
            )
        )
        .attr('x2', (d) =>
            x(
                d3.max([
                    Math.pow(10, d.mort_med_pod_med) * 1000000,
                    Math.pow(10, d.mort_max_pod_med) * 1000000,
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

    // add mort_pod_medData circle
    barG.selectAll('.viability-circle')
        .data(mort_pod_medData)
        .enter()
        .append('circle')
        .attr('class', 'viability-circle')
        .attr('cx', (d) => x(Math.pow(10, d.mort_med_pod_med) * 1000000))
        .attr('cy', (d) => y(d.preferred_name) + y.bandwidth() / 2)
        .attr('r', 7)
        .style('fill', 'black')
        .style('opacity', 0.8)
        .style('cursor', 'pointer')
        .on('click', showDoseResponse);

    // add selectivity-ratio text
    if (opts.isSelective) {
        // axis label
        svg.append('text')
            .attr('x', elWidth - margin.right - margin.left + 10)
            .attr('y', -8)
            .style('font-weight', 'bold')
            .style('font-family', 'sans-serif')
            .text('Selectivity');

        svg.selectAll('.selectivity-text')
            .data(pod_medData)
            .enter()
            .append('text')
            .attr('x', elWidth - margin.right - margin.left + 24)
            .attr('y', (d) => y(d.preferred_name) + y.bandwidth() / 2)
            .attr('dy', '0.35em')
            .style('font-family', 'sans-serif')
            .text((d) => {
                return 'zw';
            })
            // .text((d) => {
            //     return d.has_viability_bmd
            //         ? printFloat(d.maximumSelectivity)
            //         : `≥ ${printFloat(d.maximumSelectivity)}`;
            // })
            .each(function(d) {
                if (!d.has_viability_bmd) {
                    // add footnote; adjust text so that numbers are aligned
                    d3.select(this)
                        .attr('x', elWidth - margin.right - margin.left + 10)
                        .append('tspan')
                        .text('†')
                        .attr('baseline-shift', 'super')
                        .attr('font-size', '0.7em');
                }
            });

        // add footnote
        svg.append('text')
            .attr('x', -margin.left + 10)
            .attr('y', height + margin.top - margin.bottom)
            .attr('font-size', '0.7em')
            .style('font-family', 'sans-serif')
            .text(`† ${SELECTIVITY_FOOTNOTE}`);
    }

    // append category ids

    svg.selectAll('.category')
        .data(medData)
        .enter()
        .append('rect')
        .attr('class', 'category')
        .attr('x', categoryPadding)
        .attr('width', categoryWidth)
        .attr('y', (d) => y(d.preferred_name))
        .attr('height', y.bandwidth());
    // .style('fill', (d) => CATEGORY_COLORS[d.preferred_name]);

    // append category label
    svg.selectAll('.category-text')
        .data(medData)
        .enter()
        .append('text')
        .attr('x', categoryPadding + 2)
        .attr('y', (d) => y(d.preferred_name) + y.bandwidth() / 2)
        .attr('dy', '0.35em')
        .text((d) => d.preferred_name)
        .style('fill', 'white');

    // add axes
    svg.append('g').call(d3.axisLeft(y));

    let axisFn =
        opts.selectedAxis === AXIS_LOG10 ? getLog10AxisFunction(d3.axisTop, x) : d3.axisTop(x);

    barG.append('g').call(axisFn);

    // axis label
    barG.append('text')
        .attr('transform', `translate(${(width - barStart) / 2}, -25)`)
        .style('text-anchor', 'middle')
        .text('Benchmark concentration value (µM)');

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
        .text('pod data');

    barLegend
        .append('text')
        .attr('x', 38)
        .attr('y', 15)
        .text('mort pod data');
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
        });
    }

    render() {
        return <div id="BMC_heatmap01" ref="bmd_svg" />;
    }
}

export default RankedBarChart;
