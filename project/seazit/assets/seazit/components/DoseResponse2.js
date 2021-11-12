import _ from 'lodash';
import * as d3 from 'd3';
import React from 'react';
import PropTypes from 'prop-types';

import Plotly from 'Plotly';

import { NO_COLLAPSE, COLLAPSE_BY_READOUT, COLLAPSE_BY_CHEMICAL, printFloat } from '../shared';

const NO_COLLAPSE_COLORS = {
    responses: '#76B425',
    bmcoutput: '#1451a5',
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
        console.log('data zw1 ');
        console.log(data);

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
                        dose_response: _.filter(data.dose_response, { key: k }),
                        bmcoutput: _.filter(data.bmcoutput),
                    };
                })
                .each((d, k) => {
                    let dr = d.dose_response[0];
                    (d.title = this.getPlotTitle(dr, collapse)),
                        (d.input_ids = _.chain(d.dose_response)
                            .map('input_id')
                            .uniq()
                            .value()),
                        // filter with input_ids to filter bmcout into different case
                        (d.bmcoutput = d.bmcoutput.filter((i) => d.input_ids.includes(i.input_id))),
                        (d.endpoint_name = dr.endpoint_name);
                })
                .sortBy('endpoint_name')
                .value(),
            responses,
            yrange,
            offset;

        // set constant y-range for all charts. ensure 0 is within the
        // domain of values.
        // console.log(keys)
        // console.log("collapsedData")
        // console.log(collapsedData)

        yrange = [0, 100];
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
            // console.log("this.state");
            // console.log(this.state);
        });
    }

    getColorScale(data, collapse) {
        if (_.isEmpty(data)) {
            return _.noop;
        }
        switch (collapse) {
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
        // console.log(data)
        switch (collapse) {
            case NO_COLLAPSE:
                return `${data.preferred_name}<br>${data.casrn}|${data.dtxsid}`;
            default:
                throw 'Unknown collapse type.';
        }
    }

    getResponseLabels(data, collapse) {
        if (_.isEmpty(data)) {
            return '';
        }
        switch (collapse) {
            case NO_COLLAPSE:
                return 'responses';
            default:
                throw 'Unknown collapse type.';
        }
    }

    setDatasetKey(data, collapse) {
        // console.log("setDatasetKey")
        switch (collapse) {
            case NO_COLLAPSE:
                data.key = `${data.endpoint_name}|${data.casrn}`;
                // data.key = `${data.endpoint_name}|${data.casrn}|${data.substance_code}`;
                data.groupKey = null;
                data.substance_code_input_id = `${data.substance_code}@${data.input_id}`;
                break;
            default:
                throw 'Unknown collapse type.';
        }
    }
    setKeys(data, collapse) {
        // console.log(data)
        _.each(data.dose_response, (d) => this.setDatasetKey(d, collapse));
        _.each(data.bmcoutput, (d) => this.setDatasetKey(d, collapse));
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
        //
        console.log(' _renderPlot');
        console.log(d);

        if (this.refs[d.key] === undefined) {
            return;
        }

        let data = [],
            dose_range = [0, 1],
            // dose_range = d3.extent(_.map(d.dose_response, 'n')),
            trsh = null,
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
                // type: 'linear',
                autorange: true,
                title: 'Concentration (µM)',
                dtick: 1,
            },
            yaxis: {
                type: 'linear',
                // autorange: true,
                title: 'Response (normalized)',
                // range should be [0, 100]
                range: [-10, 110],
            },
            // add room for collapsed plot legends
            height: this.props.height + d.groupKeys.length * 19 + 20,
        };

        d.groupKeys.map((gk) => {
            // add raw data
            let drs = d.dose_response.filter((r) => r.groupKey == gk);
            data.push({
                x: _.map(drs, 'dose'),
                y: drs.map((obj) => {
                    return (obj.n_in / obj.n) * 100;
                }),
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
            // add bmcoutput if exists`````````
            console.log(d.bmcoutput);
            if (d.bmcoutput.length > 0) {
                d.bmcoutput
                    .filter((r) => r.groupKey == gk)
                    .forEach((el) => {
                        if (el.hit_confidence >= 0.5) {
                            annotations.push(`BMC:${Math.pow(10, el.pod_med) * 1000000} µM`);
                            trsh = el.trsh;
                            let dash = gk ? { dash: 'dot' } : null;
                            data.push({
                                x: el.pod_cil,
                                y: el.pod_med,
                                legendgroup: 'plot',
                                mode: 'line',
                                name: 'bmcoutput',
                                showlegend: !gk,
                                line: {
                                    color: this.getMarkerColor(gk, 'bmcoutput'),
                                    width: 2,
                                    ...dash,
                                },
                                opacity: 0.8,
                            });
                        }
                    });
            }
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

        if (this.props.collapse === NO_COLLAPSE && trsh) {
            // console.log("trsh")
            // console.log(trsh)
            layout.shapes.push({
                type: 'line',
                xref: 'paper',
                x0: 0,
                y0: trsh,
                x1: 1,
                y1: trsh,
                line: {
                    color: 'grey',
                    width: 2,
                    dash: 'dot',
                },
            });
        }

        // add grouped hill and bmcoutput legends if plot is collapsed
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
                    name: 'bmcoutput',
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
