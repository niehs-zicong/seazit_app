import _ from 'lodash';
import * as d3 from 'd3';
import React from 'react';
import PropTypes from 'prop-types';

import Plotly from 'Plotly';

import { NO_COLLAPSE, COLLAPSE_BY_READOUT, COLLAPSE_BY_CHEMICAL, printFloat } from '../shared';

const NO_COLLAPSE_COLORS = {
    responses1: '#1451a5',
    responses2: '#A52D29',
    curvep1: '#1451a5',
    curvep2: '#A52D29',
    hill1: '#1451a5',
    hill2: '#A52D29',
};
class DoseResponseParallelPlot extends React.Component {
    constructor(props) {
        super(props);
        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        this.state = {
            data: [],
            scale: _.noop,
            collapsedData: [],
            error: null,
            plotData: [],
            layout: [],
            annotations: [],
            responsesmarker: 0,
            hillmarker: 0,
            curvepmarker: 0,
        };
    }

    collapseData(data, collapse) {
        let keys = _.chain(data.dose_response)
                .map('key')
                .uniq()
                .value(),
            groupKeys = _.chain(data.dose_response)
                .map('groupKey')
                .uniq()
                .value(),
            collapsedData = _.chain(keys)
                .map((k) => {
                    return {
                        key: k,
                        groupKeys,
                        dose_response: _.filter(data.dose_response, {
                            key: k,
                        }),
                        curvep: _.filter(data.curvep, { key: k }),
                        hill: _.filter(data.hill, { key: k }),
                    };
                })
                .each((d, k) => {
                    let dr = d.dose_response[0];
                    (d.title = this.getPlotTitle(dr, collapse)),
                        (d.chemical_name = dr.chemical_name);
                    d.endpoint_name = dr.endpoint_name;
                })
                .sortBy('endpoint_name')
                .sortBy('chemical_name')
                .value(),
            responses,
            yrange,
            offset;

        // set constant y-range for all charts. ensure 0 is within the
        // domain of values.

        responses = _.map(data.dose_response, 'normalized_response');
        responses.push(0);
        yrange = d3.extent(responses);
        offset = (yrange[1] - yrange[0]) * 0.15 * 0.5;
        yrange = [yrange[0] - offset, yrange[1] + offset];
        return {
            data,
            collapsedData,
            yrange,
            error: null,
        };
    }

    fetchDoseResponseData(url) {
        d3.json(url, (error, data) => {
            if (error) {
                let err = error.target.responseText.replace('["', '').replace('"]', '');
                this.setState({
                    data: [],
                    error: err,
                });
                return;
            }
            this.updateData(data, this.props.collapse);
        });
    }

    getColorScale(data, collapse) {
        if (_.isEmpty(data)) {
            return _.noop;
        }
        switch (collapse) {
            case COLLAPSE_BY_READOUT:
                return this.colorScale.domain(_.map(data[0].hill, 'casrn'));
            case COLLAPSE_BY_CHEMICAL:
                return this.colorScale.domain(_.map(data[0].hill, 'readout_id'));
            case NO_COLLAPSE:
                return _.noop;
            default:
                throw 'Unknown collapse type.';
        }
    }

    getMarkerColor(d, marker = null) {
        if (this.props.collapse === NO_COLLAPSE) {
            return NO_COLLAPSE_COLORS[marker];
        } else {
            return this.state.scale(d);
        }
    }

    getPlotTitle(data, collapse) {
        switch (collapse) {
            case COLLAPSE_BY_READOUT:
                return data.endpoint_name;
            case COLLAPSE_BY_CHEMICAL:
                return `${data.chemical_name} (${data.casrn})`;
            case NO_COLLAPSE:
                return `${data.chemical_name} (${data.casrn}):<br>${data.endpoint_name}`;
            default:
                throw 'Unknown collapse type.';
        }
    }

    getResponseLabels(data, collapse) {
        if (_.isEmpty(data)) {
            return '';
        }

        switch (collapse) {
            case COLLAPSE_BY_READOUT:
                return `${data[0].chemical_name} (${data[0].casrn})`;
            case COLLAPSE_BY_CHEMICAL:
                return data[0].endpoint_name;
            case NO_COLLAPSE:
                return data[0].endpoint_name;
            default:
                throw 'Unknown collapse type.';
        }
    }

    setDatasetKey(data, collapse) {
        switch (collapse) {
            case COLLAPSE_BY_READOUT:
                data.key = data.readout_id;
                data.groupKey = data.casrn;
                break;
            case COLLAPSE_BY_CHEMICAL:
                data.key = data.casrn;
                data.groupKey = data.readout_id;
                break;
            case NO_COLLAPSE:
                data.key = `${data.readout_id}|${data.casrn}`;
                data.groupKey = null;
                break;
            default:
                throw 'Unknown collapse type.';
        }
    }

    setKeys(data, collapse) {
        _.each(data.dose_response, (d) => this.setDatasetKey(d, collapse));
        _.each(data.curvep, (d) => this.setDatasetKey(d, collapse));
        _.each(data.hill, (d) => this.setDatasetKey(d, collapse));
    }

    updateData(data, collapse) {
        this.setKeys(data, collapse);
        let update = this.collapseData(data, collapse);
        let scale = this.getColorScale(update.collapsedData, collapse);
        this.setState({
            ...update,
            scale,
        });
    }

    _renderPlot(d, yrange) {
        // plot configure to add one more svg download button.
        let svgConfig = {
            // modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
            modeBarButtonsToAdd: [
                {
                    name: 'Download plot as a SVG',
                    icon: Plotly.Icons.camera,
                    click: function(gd) {
                        Plotly.downloadImage(gd, { format: 'svg' });
                    },
                },
            ],
        };

        Plotly.newPlot(
            this.refs[this.state.collapsedData[0].key],
            this.state.plotData,
            this.state.layout,
            svgConfig
        );
    }

    _renderLoadData(d, yrange) {
        if (this.refs[d.key] === undefined) {
            return;
        }
        let data = [],
            dose_range = d3.extent(_.map(d.dose_response, 'conc')),
            bmr = null,
            annotations = [];
        // console.log('d');
        // console.log(d);
        // console.log(d.endpoint_name)

        this.state.layout = {
            grid: { rows: 2, columns: 1, pattern: 'independent' },
            // title: `${this.getResponseLabels(drs, this.props.collapse)}`,
            title: 'Top: Hill plot <br>Bottom: CurveP plot ',
            titlefont: {
                size: 14,
            },
            shapes: [],
            xaxis: {
                type: 'log',
                autorange: true,
                title: 'Concentration (µM)',
                dtick: 1,
                // x axix domain is the problem for overlaying.
                domain: [0, 1],
                anchor: 'y1',
            },
            yaxis: {
                type: 'linear',
                // autorange: false,
                // range: yrange,
                autorange: true,
                title: 'Response (normalized)',
                domain: [0.6, 1],

                anchor: 'x1',
            },
            xaxis2: {
                type: 'log',
                autorange: true,
                title: 'Concentration (µM)',
                dtick: 1,
                domain: [0, 1],
                anchor: 'y2',
            },
            yaxis2: {
                type: 'linear',
                // autorange: false,
                // range: yrange,
                autorange: true,
                title: 'Response (normalized)',
                domain: [0, 0.4],
                anchor: 'x2',
            },
            legend: {
                x: 1,
                y: 0.5,
            },
            // height: this.props.height + d.groupKeys.length * 19 + 20,
            height:
                (this.props.height + this.state.collapsedData[0].groupKeys.length * 19 + 20) * 2,
        };

        d.groupKeys.map((gk) => {
            // add raw data
            this.state.responsesmarker += 1;
            let drs = d.dose_response.filter((r) => r.groupKey == gk);
            //
            // console.log('drs');
            // console.log(drs);
            this.state.plotData.push({
                x: _.map(drs, 'conc'),
                y: _.map(drs, 'normalized_response'),
                legendgroup: 'plot',
                mode: 'markers',
                type: 'scatter',
                name: 'responses ' + this.getResponseLabels(drs, this.props.collapse),
                showlegend: true,
                marker: {
                    color: this.getMarkerColor(gk, `responses${this.state.responsesmarker}`),
                },
                opacity: 0.8,
            });
            this.state.plotData.push({
                x: _.map(drs, 'conc'),
                y: _.map(drs, 'normalized_response'),
                legendgroup: 'plot2',
                mode: 'markers',
                type: 'scatter',
                xaxis: 'x2',
                yaxis: 'y2',
                name: 'responses ' + this.getResponseLabels(drs, this.props.collapse),
                // showlegend: false,
                showlegend: true,
                marker: {
                    color: this.getMarkerColor(gk, `responses${this.state.responsesmarker}`),
                },
                opacity: 0.8,
            });
            // add curvep if exists
            if (d.curvep.length > 0) {
                this.state.curvepmarker += 1;
                d.curvep
                    .filter((r) => r.groupKey == gk)
                    .forEach((el) => {
                        if (el.bmd === null || el.bmd <= 0) {
                            return;
                        }

                        bmr = el.bmr;
                        let dash = gk ? { dash: 'dot' } : null;
                        this.state.plotData.push({
                            x: el.doses,
                            y: el.responses,
                            legendgroup: 'plot2',
                            mode: 'line',
                            name: 'curvep ' + this.getResponseLabels(drs, this.props.collapse),
                            xaxis: 'x2',
                            yaxis: 'y2',
                            showlegend: !gk,
                            line: {
                                color: this.getMarkerColor(gk, `curvep${this.state.curvepmarker}`),
                                // width: 2,
                                width: 4,
                                ...dash,
                            },
                            opacity: 0.8,
                        });
                        if (this.props.collapse === NO_COLLAPSE) {
                            this.state.annotations.push(
                                `CurveP ${drs[0].endpoint_name}: ${printFloat(el.bmd)} µM`
                            );
                        }
                    });
            }

            // add hill if exists
            if (d.hill.length > 0) {
                this.state.hillmarker += 1;
                d.hill
                    .filter((r) => r.groupKey == gk)
                    .forEach((el) => {
                        if (el.bmd === null || el.bmd <= 0) {
                            return;
                        }

                        let linspace = function(start, stop, nsteps) {
                                let delta = (stop - start) / (nsteps - 1);
                                return d3.range(start, stop + delta, delta).slice(0, nsteps);
                            },
                            hill = function(x0) {
                                return (
                                    1 +
                                    (el.param_vmax * Math.pow(x0, el.param_n)) /
                                        (Math.pow(el.param_k, el.param_n) +
                                            Math.pow(x0, el.param_n))
                                );
                            },
                            x = linspace(dose_range[0], dose_range[1], 100),
                            y = x.map(hill);

                        bmr = el.bmr;
                        this.state.plotData.push({
                            x,
                            y,
                            legendgroup: 'plot',
                            mode: 'line',
                            name: 'hill ' + this.getResponseLabels(drs, this.props.collapse),
                            showlegend: !gk,
                            line: {
                                color: this.getMarkerColor(gk, `hill${this.state.hillmarker}`),
                                width: 4,
                            },
                            opacity: 0.8,
                        });
                        if (this.props.collapse === NO_COLLAPSE) {
                            this.state.annotations.push(
                                `Hill ${drs[0].endpoint_name}: ${printFloat(el.bmd)} µM`
                            );
                        }
                    });
            }
        });
        if (this.state.annotations.length > 0) {
            this.state.layout.annotations = [
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 1,
                    y: 0,
                    xanchor: 'left',
                    yanchor: 'bottom',
                    align: 'left',
                    text: '<b>BMCs</b><br>' + this.state.annotations.join('<br>'),
                    showarrow: false,
                },
            ];
        }

        if (this.props.collapse === NO_COLLAPSE && bmr) {
            this.state.layout.shapes.push({
                type: 'line',
                x0: dose_range[0],
                y0: 1 + bmr,
                x1: dose_range[1],
                y1: 1 + bmr,
                line: {
                    color: 'grey',
                    width: 4,
                    dash: 'dot',
                },
            });
        }

        if (this.props.collapse !== NO_COLLAPSE) {
            this.state.layout.legend = { orientation: 'h', y: -0.5 };
            this.state.plotData.push(
                {
                    x: [null],
                    y: [null],
                    legendgroup: 'collapsed',
                    mode: 'markers',
                    name: 'responses',
                    showlegend: true,
                    marker: {
                        color: 'grey',
                    },
                },
                {
                    x: [null],
                    y: [null],
                    legendgroup: 'collapsed',
                    mode: 'line',
                    name: 'hill',
                    showlegend: true,
                    line: {
                        color: 'grey',
                        width: 4,
                    },
                },
                {
                    x: [null],
                    y: [null],
                    legendgroup: 'collapsed',
                    mode: 'line',
                    name: 'curvep',
                    showlegend: true,
                    line: {
                        color: 'grey',
                        width: 4,
                        dash: 'dot',
                    },
                }
            );
        }
        // add grouped hill and curvep legends if plot is collapsed
    }

    loadDoseResponse() {
        this.state.collapsedData.map((d) => this._renderLoadData(d, this.state.yrange));
    }

    componentWillMount() {
        this.fetchDoseResponseData(this.props.url);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.url !== this.props.url) {
            this.fetchDoseResponseData(nextProps.url);
        }
        if (nextProps.collapse !== this.props.collapse) {
            this.updateData(this.state.data, nextProps.collapse);
        }
    }

    componentDidMount() {
        this.loadDoseResponse();
    }

    componentDidUpdate() {
        this.loadDoseResponse();

        this._renderPlot(this.state.plotData, this.state.yrange);
    }

    render() {
        if (this.state.error) {
            return (
                <div className="alert alert-warning">
                    <p>
                        <b>{this.state.error}</b>
                    </p>
                </div>
            );
        }

        let colNum = Math.ceil(12 / this.props.cols);
        return (
            <div>
                {this.state.collapsedData.map((item) => (
                    <div className={`col-xs-${colNum}`} key={item.key} ref={item.key} />
                ))}
            </div>
        );
    }
}

DoseResponseParallelPlot.propTypes = {
    cols: PropTypes.number.isRequired,
    collapse: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
};

export default DoseResponseParallelPlot;
