import _ from 'lodash';
import * as d3 from 'd3';
import React from 'react';
import PropTypes from 'prop-types';

import Plotly from 'Plotly';

import { NO_COLLAPSE, COLLAPSE_BY_READOUT, COLLAPSE_BY_CHEMICAL, printFloat } from '../shared';

const NO_COLLAPSE_COLORS = {
    responses: '#76B425',
    curvep: '#1451a5',
    hill: '#A52D29',
};

class DoseResponse extends React.Component {
    constructor(props) {
        super(props);
        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        this.state = {
            data: [],
            scale: _.noop,
            collapsedData: [],
            error: null,
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
                        bmcoutput: _.filter(data.bmcoutput, { key: k }),
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
            console.log('data');
            console.log(url);
            console.log(data);
            // console.log(this.state);
            // console.log(this.props.collapse);
            this.updateData(data, this.props.collapse);
            console.log(this.props.collapse);

            console.log(this.state);
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
                return `(${data.casrn}):<br>${data.endpoint_name}`;
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
                return 'responses';
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
                data.key = `${data.endpoint_name}|${data.casrn}`;
                // data.key = `${data.protocol_id}|${data.endpoint_name}|${data.casrn}`;
                data.groupKey = null;
                break;
            default:
                throw 'Unknown collapse type.';
        }
    }
    setKeys(data, collapse) {
        _.each(data.dose_response, (d) => this.setDatasetKey(d, collapse));
        _.each(data.bmcoutput, (d) => this.setDatasetKey(d, collapse));
        // _.each(data.hill, (d) => this.setDatasetKey(d, collapse));
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
        console.log('start _renderPlot');
        console.log(d);
        console.log(this.refs);
        console.log(d.key);

        if (this.refs[d.key] === undefined) {
            return;
        }

        let data = [],
            dose_range = d3.extent(_.map(d.dose_response, 'conc')),
            bmr = null,
            annotations = [];

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

        let layout = {
            title: d.title,
            titlefont: {
                size: 14,
            },
            shapes: [],
            xaxis: {
                type: 'log',
                autorange: true,
                title: 'Concentration (µM)',
                dtick: 1,
            },
            yaxis: {
                type: 'linear',
                autorange: false,
                title: 'Response (normalized)',
                range: yrange,
            },
            // add room for collapsed plot legends
            height: this.props.height + d.groupKeys.length * 19 + 20,
        };

        d.groupKeys.map((gk) => {
            // add raw data
            let drs = d.dose_response.filter((r) => r.groupKey == gk);
            data.push({
                x: _.map(drs, 'conc'),
                y: _.map(drs, 'normalized_response'),
                legendgroup: 'plot',
                mode: 'markers',
                type: 'scatter',
                name: this.getResponseLabels(drs, this.props.collapse),
                showlegend: true,
                marker: {
                    color: this.getMarkerColor(gk, 'responses'),
                },
                opacity: 0.8,
            });

            // add curvep if exists
            // if (d.curvep.length > 0) {
            //     d.curvep
            //         .filter((r) => r.groupKey == gk)
            //         .forEach((el) => {
            //             if (el.bmd === null || el.bmd <= 0) {
            //                 return;
            //             }
            //
            //             bmr = el.bmr;
            //             let dash = gk ? { dash: 'dot' } : null;
            //             // console.log('dash')
            //             // console.log(dash)
            //
            //             data.push({
            //                 x: el.doses,
            //                 y: el.responses,
            //                 legendgroup: 'plot',
            //                 mode: 'line',
            //                 name: 'curvep',
            //                 showlegend: !gk,
            //                 line: {
            //                     color: this.getMarkerColor(gk, 'curvep'),
            //                     width: 2,
            //                     ...dash,
            //                 },
            //                 opacity: 0.8,
            //             });
            //             if (this.props.collapse === NO_COLLAPSE) {
            //                 annotations.push(`CurveP: ${printFloat(el.bmd)} µM`);
            //             }
            //         });
            // }

            // add hill if exists
        });
        if (annotations.length > 0) {
            layout.annotations = [
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 1,
                    y: 0,
                    xanchor: 'left',
                    yanchor: 'bottom',
                    align: 'left',
                    text: '<b>BMCs</b><br>' + annotations.join('<br>'),
                    showarrow: false,
                },
            ];
        }

        if (this.props.collapse === NO_COLLAPSE && bmr) {
            layout.shapes.push({
                type: 'line',
                x0: dose_range[0],
                y0: 1 + bmr,
                x1: dose_range[1],
                y1: 1 + bmr,
                line: {
                    color: 'grey',
                    width: 2,
                    dash: 'dot',
                },
            });
        }

        // add grouped hill and curvep legends if plot is collapsed
        if (this.props.collapse !== NO_COLLAPSE) {
            // move legend to bottom of plot
            layout.legend = { orientation: 'h', y: -0.3 };
            data.push(
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
                        width: 2,
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
                        width: 2,
                        dash: 'dot',
                    },
                }
            );
        }

        Plotly.newPlot(this.refs[d.key], data, layout, svgConfig);
    }

    loadDoseResponse() {
        // console.log(d)
        console.log(this.state);

        this.state.collapsedData.map((d) => this._renderPlot(d, this.state.yrange));
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
                <p>DoseResponse part zw1</p>
            </div>
        );
    }
}

DoseResponse.propTypes = {
    cols: PropTypes.number.isRequired,
    collapse: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
};

export default DoseResponse;
