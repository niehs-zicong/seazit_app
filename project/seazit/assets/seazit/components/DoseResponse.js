import _ from 'lodash';
import * as d3 from 'd3';
import React from 'react';
import PropTypes from 'prop-types';

import Plotly from 'Plotly';

import { NO_COLLAPSE, COLLAPSE_BY_READOUT, COLLAPSE_BY_CHEMICAL, printFloat } from '../shared';

const NO_COLLAPSE_COLORS = {
    responses: '#76B425',
    bmcoutput: '#1451a5',
    // hill: '#A52D29',
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
            labelsDict: {},
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
                        dose_response: _.filter(data.dose_response, { key: k }),
                        bmcoutput: _.filter(data.bmcoutput, { key: k }),
                    };
                })
                .each((d, k) => {
                    let dr = d.dose_response[0];
                    (d.title = this.getPlotTitle(dr, collapse)),
                        (d.casrn = dr.casrn),
                        (d.endpoint_name = dr.endpoint_name),
                        (d.input_ids = _.chain(d.bmcoutput)
                            .map('input_id')
                            .uniq()
                            .value()),
                        // filter with input_ids to filter bmcout into different case
                        (d.bmcoutput = d.bmcoutput.filter((i) => d.input_ids.includes(i.input_id))),
                        (d.substance_code_input_ids = _.chain(
                            d.dose_response.filter((i) => d.input_ids.includes(i.input_id))
                        )
                            .map('substance_code_input_id')
                            .uniq()
                            .value());
                })
                .sortBy('endpoint_name')
                .sortBy('casrn')
                .value(),
            responses,
            yrange,
            offset;
        console.log(keys)

        console.log(collapsedData)

        // set constant y-range for all charts. ensure 0 is within the
        // domain of values.

        yrange = [0, 100];
        // console.log('collapsedData');
        console.log(collapsedData);
        //
        return {
            data,
            collapsedData,
            yrange,
            error: null,
        };
    }

    fetchDoseResponseData(url) {
        // //console.log('bmc url ');
        // //console.log(url);

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
                return this.colorScale.domain(_.map(data[0].dose_response, 'casrn'));
            case COLLAPSE_BY_CHEMICAL:
                return this.colorScale.domain(_.map(data[0].dose_response, 'endpoint_name'));
            case NO_COLLAPSE:
                return _.noop;
            default:
                throw 'Unknown collapse type.';
        }
    }

    getMarkerColor(d, marker = null) {
        // console.log("color")
        // console.log(d)
        return this.state.scale(d);
    }

    getPlotTitle(data, collapse) {
        switch (collapse) {
            case COLLAPSE_BY_READOUT:
                return `${data.protocol_name_plot}<br>${data.endpoint_name}`;
            case COLLAPSE_BY_CHEMICAL:
                return `${data.preferred_name}|${data.casrn}`;
            case NO_COLLAPSE:
                return `${data.protocol_name_plot}<br>${data.preferred_name}<br>${data.casrn}|${data.dtxsid}:<br>${data.endpoint_name}`;
            default:
                throw 'Unknown collapse type.';
        }
    }

    getResponseLabels(data, collapse, labelCase) {
        if (_.isEmpty(data)) {
            return '';
        }
        let index1 = data.substance_code,
            index2 = data.input_id;
        if (!this.state.labelsDict[index1]) {
            this.state.labelsDict[index1] = [];
            this.state.labelsDict[index1].push(index2);
        } else {
            if (!this.state.labelsDict[index1].includes(index2)) {
                this.state.labelsDict[index1].push(index2);
            }
        }
        switch (collapse) {
            case COLLAPSE_BY_READOUT:
                return `${data.preferred_name}|${data.casrn}|${data.dtxsid}`;
            case COLLAPSE_BY_CHEMICAL:
                return `${data.protocol_name_plot}|${data.endpoint_name}`;
            case NO_COLLAPSE:
                if (labelCase == 'PC') {
                    return `PC| ${Object.values(this.state.labelsDict[index1]).length}`;
                } else if (labelCase.length == 1) {
                    return `plate| ${Object.values(this.state.labelsDict[index1]).length}`;
                } else {
                    return `dup ${Object.keys(this.state.labelsDict).length}| plate ${
                        Object.values(this.state.labelsDict[index1]).length
                    }`;
                }
            default:
                throw 'Unknown collapse type.';
        }
    }

    getTextLabels(drs_split, d) {
        if (drs_split.length > 0) {
            let bmcData = d.bmcoutput.filter((r) => r.input_id == drs_split[0].input_id);
            bmcData = bmcData[0];
            if (bmcData.hit_confidence < 0.5) {
                return ' ';
            } else {
                return `BMC:${printFloat(Math.pow(10, bmcData.pod_med) * 1000000)} µM`;
            }
        }
    }

    getBMCLabels(data, collapse) {
        if (_.isEmpty(data)) {
            return '';
        }
        switch (collapse) {
            case COLLAPSE_BY_READOUT:
                return `${data.endpoint_name}@${data.substance_code}@${data.input_id}`;
            case COLLAPSE_BY_CHEMICAL:
                return `${data.endpoint_name}@${data.substance_code}@${data.input_id}`;
            case NO_COLLAPSE:
                return data.input_id;
            default:
                throw 'Unknown collapse type.';
        }
    }

    setDatasetKey(data, collapse) {
        switch (collapse) {
            case COLLAPSE_BY_READOUT:
                data.key = `${data.protocol_id}|${data.endpoint_name}`;
                // data.key =data.endpoint_name;
                data.groupKey = data.casrn;
                data.substance_code_input_id = `${data.substance_code}|${data.input_id}`;

                break;
            case COLLAPSE_BY_CHEMICAL:
                // data.key = `${data.protocol_id}|${data.casrn}`;
                data.key = data.casrn;
                // data.groupKey = data.endpoint_name;
                data.groupKey = `${data.protocol_id}|${data.endpoint_name}`;
                data.substance_code_input_id = `${data.substance_code}|${data.input_id}`;
                break;

            case NO_COLLAPSE:
                data.key = `${data.protocol_id}|${data.endpoint_name}|${data.casrn}`;
                // data.key = `${data.endpoint_name}|${data.casrn}`;
                data.groupKey = null;
                data.substance_code_input_id = `${data.substance_code}|${data.input_id}`;
                break;
            default:
                throw 'Unknown collapse type.';
        }
    }
    setKeys(data, collapse) {
        // console.log(data)
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
                size: 12,
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
                title: 'response (%)',
                // range should be [0, 100]
                range: [-10, 110],
            },
            showlegend: false,
            // add room for collapsed plot legends
            height: this.props.height + d.groupKeys.length * 19 + 20,
            autosize: true,
        };
        console.log('d');
        console.log(d);

        d.groupKeys.map((gk) => {
            let drs = d.dose_response.filter((r) => r.groupKey == gk),
                substance_codeCase = _.chain(drs)
                    .map('substance_code')
                    .uniq()
                    .value();

            this.state.labelsDict = [];
            d.substance_code_input_ids.map((id_flag, index) => {
                let drs_split = drs.filter((r) => r.substance_code_input_id == id_flag),
                    legendNames = _.chain(data)
                        .map('name')
                        .uniq()
                        .value();
                drs_split = _.sortBy(drs_split, 'dose');
                // //console.log("drs")
                // //console.log(drs)
                data.push({
                    x: _.map(drs_split, 'dose'),
                    y: drs_split.map((obj) => {
                        return (obj.n_in / obj.n) * 100;
                    }),
                    legendgroup: 'plot',
                    mode: 'line',
                    type: 'scatter',
                    // name: this.getResponseLabels(
                    //     drs_split[0],
                    //     this.props.collapse,
                    //     substance_codeCase
                    // ),
                    text: `${this.getResponseLabels(
                        drs_split[0],
                        this.props.collapse,
                        substance_codeCase
                    )}<br>${this.getTextLabels(drs_split, d)}`,
                    marker: {
                        color: this.getMarkerColor(gk, 'responses'),
                        // color: this.getMarkerColor(id_flag, 'responses'),
                    },
                    opacity: 0.8,
                });
            });

            // add trsh if exists
            if (d.bmcoutput.length > 0) {
                d.bmcoutput
                    .filter((r) => r.groupKey == gk)
                    .forEach((el) => {
                        if (el.trsh === null || el.hit_confidence < 0.5) {
                            return;
                        }
                        trsh = el.trsh;
                        let dash = gk ? { dash: 'dot' } : null;
                        // let bmc_name = null;
                        // bmc_name = this.getBMCLabels(el, this.props.collapse);
                        // annotations.push(
                        //     `${bmc_name}:${(Math.pow(10, el.pod_med) * 1000000).toFixed(2)} µM`
                        // );
                    });
            }
        });

        if (this.props.collapse === NO_COLLAPSE && trsh) {
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
        }
        //console.log(data)
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
