import _ from 'lodash';
import * as d3 from 'd3';
import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'utils/Loading';

import Plotly from 'Plotly';

import {
    NO_COLLAPSE,
    COLLAPSE_BY_READOUT,
    COLLAPSE_BY_CHEMICAL,
    COLLAPSE_WITH_Mortality120,
    printFloat,
    pod_med_processed,
    INTVIZ_HEATMAP,
} from '../shared';
import HeatmapHandler from './HeatmapHandler';
import Heatmap from './Heatmap';
import DevtoxHeatmap from './DevtoxHeatmap';

// const NO_COLLAPSE_COLORS = {
//     responses: '#76B425',
//     bmcoutput: '#1451a5',
// };

class DoseResponse extends React.Component {
    constructor(props) {
        super(props);
        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        this.state = {
            data: null,
            scale: null,
            collapsedData: null,
            error: null,
            labelsDict: {},
        };
    }

    collapseData(data, collapse) {
        if (_.isEmpty(data)) {
            return '';
        }
        let keys, groupKeys, collapsedData, responses, yrange, offset;
        if (collapse == COLLAPSE_WITH_Mortality120) {
            (keys = _.chain(data.dose_response)
                .reject((r) => r.endpoint_name == 'Mortality@120')
                .map('key')
                .uniq()
                .value()),
                (groupKeys = _.chain(data.dose_response)
                    .map('groupKey')
                    .uniq()
                    .value()),
                (collapsedData = _.chain(keys)
                    .map((k) => {
                        return {
                            key: k,
                            groupKeys,
                            final_dev_call: null,
                            dose_response: _.filter(data.dose_response, { key: k }),
                            bmcoutput: _.filter(data.bmcoutput, { key: k }),
                            mortality120dose_response: _.filter(data.dose_response, {
                                endpoint_name: 'Mortality@120',
                            }),
                            mortality120bmcoutput: _.filter(data.bmcoutput, {
                                endpoint_name: 'Mortality@120',
                            }),
                        };
                    })
                    .each((d, k) => {
                        // console.log(this.props.final_dev_call, this.props.devtoxEndPointList, d.endpoint_name)
                        let dr = d.dose_response[0];
                        (d.title = this.getPlotTitle(dr, collapse)),
                            (d.casrn = dr.casrn),
                            (d.endpoint_name = dr.endpoint_name),
                            (d.outline =
                                (this.props.devtoxEndPointList &&
                                    this.props.devtoxEndPointList.includes(d.endpoint_name)) ||
                                this.props.final_dev_call === 'dev tox'),
                            (d.input_ids = _.chain(d.bmcoutput)
                                .map('input_id')
                                .uniq()
                                .value()),
                            (d.mortality120input_ids = _.chain(d.mortality120bmcoutput)
                                .map('input_id')
                                .uniq()
                                .value()),
                            // filter with input_ids to filter bmcout into different case
                            (d.bmcoutput = d.bmcoutput.filter((i) =>
                                d.input_ids.includes(i.input_id)
                            )),
                            (d.substance_code_input_ids = _.chain(
                                d.dose_response.filter((i) => d.input_ids.includes(i.input_id))
                            )
                                .map('substance_code_input_id')
                                .uniq()
                                .value()),
                            (d.substance_code_input_ids_120 = _.chain(
                                d.mortality120dose_response.filter((i) =>
                                    d.mortality120input_ids.includes(i.input_id)
                                )
                            )
                                .map('substance_code_input_id')
                                .uniq()
                                .value());
                    })
                    .sortBy('endpoint_name')
                    .sortBy('casrn')
                    .sortBy('title')

                    .value());
        } else {
            (keys = _.chain(data.dose_response)
                .map('key')
                .uniq()
                .value()),
                (groupKeys = _.chain(data.dose_response)
                    .map('groupKey')
                    .uniq()
                    .value()),
                (collapsedData = _.chain(keys)
                    .map((k) => {
                        return {
                            key: k,
                            groupKeys,
                            dose_response: _.filter(data.dose_response, { key: k }),
                            bmcoutput: _.filter(data.bmcoutput, { key: k }),
                        };
                    })
                    .each((d, k) => {
                        // console.log(this.props.final_dev_call, this.props.devtoxEndPointList, d.endpoint_name)

                        let dr = d.dose_response[0];
                        (d.title = this.getPlotTitle(dr, collapse)),
                            (d.casrn = dr.casrn),
                            (d.endpoint_name = dr.endpoint_name),
                            (d.input_ids = _.chain(d.bmcoutput)
                                .map('input_id')
                                .uniq()
                                .value()),
                            (d.outline =
                                (this.props.devtoxEndPointList &&
                                    this.props.devtoxEndPointList.includes(d.endpoint_name)) ||
                                this.props.final_dev_call === 'dev tox'),
                            (d.bmcoutput = d.bmcoutput.filter((i) =>
                                d.input_ids.includes(i.input_id)
                            )),
                            (d.substance_code_input_ids = _.chain(
                                d.dose_response.filter((i) => d.input_ids.includes(i.input_id))
                            )
                                .map('substance_code_input_id')
                                .uniq()
                                .value());
                    })
                    .sortBy('endpoint_name')
                    .sortBy('casrn')
                    .sortBy('title')

                    .value());
        }
        // responses = _.map(data.dose_response, 'normalized_response');
        // responses.push(0);
        // yrange = d3.extent(responses);
        // offset = (yrange[1] - yrange[0]) * 0.15 * 0.5;
        // yrange = [yrange[0] - offset, yrange[1] + offset];
        //console.log(collapsedData);
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
            //console.log('zw');
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
            case COLLAPSE_WITH_Mortality120:
                return this.colorScale.domain(
                    _.map(
                        data[0].dose_response.concat(data[0].mortality120dose_response),
                        'endpoint_name'
                    )
                );
            case NO_COLLAPSE:
                return _.noop;
            default:
                throw 'Unknown collapse type.';
        }
    }

    getMarkerColor(d, marker = null) {
        return this.state.scale(d);
    }

    getPlotTitle(data, collapse) {
        switch (collapse) {
            case COLLAPSE_BY_READOUT:
                return `${data.protocol_name_plot}<br>${data.endpoint_name}`;
            case COLLAPSE_BY_CHEMICAL:
                return `${data.preferred_name}|${data.casrn}`;
            case COLLAPSE_WITH_Mortality120:
                return `${data.protocol_name_plot}<br>${data.preferred_name}<br>${data.casrn}|${data.dtxsid}:<br>${data.endpoint_name}`;
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

        switch (collapse) {
            case COLLAPSE_BY_READOUT:
                return `${data.preferred_name}|${data.casrn}|${data.dtxsid}`;
            case COLLAPSE_BY_CHEMICAL:
                return `${data.protocol_name_plot}|${data.endpoint_name}`;
            case COLLAPSE_WITH_Mortality120:
                return `${data.protocol_name_plot}|${data.endpoint_name}`;
            case NO_COLLAPSE:
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
                return `BMC:${printFloat(pod_med_processed(bmcData.pod_med))} µM`;
            }
        }
    }

    setDatasetKey(data, collapse) {
        switch (collapse) {
            case COLLAPSE_BY_READOUT:
                data.key = `${data.protocol_id}|${data.endpoint_name}`;
                data.groupKey = data.casrn;
                data.substance_code_input_id = `${data.substance_code}|${data.input_id}`;

                break;
            case COLLAPSE_BY_CHEMICAL:
                data.key = data.casrn;
                data.groupKey = `${data.protocol_id}|${data.endpoint_name}`;
                data.substance_code_input_id = `${data.substance_code}|${data.input_id}`;
                break;
            case COLLAPSE_WITH_Mortality120:
                data.key = `${data.protocol_id}|${data.endpoint_name}|${data.casrn}`;
                data.groupKey = null;
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
        _.each(data.dose_response, (d) => this.setDatasetKey(d, collapse));
        _.each(data.bmcoutput, (d) => this.setDatasetKey(d, collapse));
        if (collapse === COLLAPSE_WITH_Mortality120) {
            _.each(data.mortality120dose_response, (d) => this.setDatasetKey(d, collapse));
        }
    }

    updateData(data, collapse) {
        //console.log('updateData');
        //console.log(data);
        this.setKeys(data, collapse);
        let update = this.collapseData(data, collapse);
        let scale = this.getColorScale(update.collapsedData, collapse);
        this.setState({
            ...update,
            scale,
        });
        this.loadDoseResponse();
    }

    _renderPlot(d, yrange) {
        //console.log('_renderPlot');
        if (this.refs[d.key] === undefined) {
            return;
        }
        //console.log(d);

        let data = [],
            dose_range = [0, 1],
            // dose_range = d3.extent(_.map(d.dose_response, 'n')),
            trsh = null,
            annotations = [];

        let svgConfig = {
            modeBarButtonsToRemove: [
                'toImage', // Remove "Download plot as PNG" button
                'hoverClosest3d', // Remove "Show closest data on hover" button
                'hoverCompareCartesian', // Remove "Compare data on hover" button
                'toggleSpikelines', // Remove "Toggle spikelines" button
            ],
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
                ...(d.outline
                    ? {
                          linecolor: '#d62976',
                          linewidth: 3,
                          mirror: true,
                      }
                    : {}),
            },
            yaxis: {
                type: 'linear',
                title: 'response (%)',
                autorange: false,
                range: [-10, 110],
                ...(d.outline
                    ? {
                          linecolor: '#d62976',
                          linewidth: 3,
                          mirror: true,
                      }
                    : {}),
            },
            showlegend: false,
            // add room for collapsed plot legends
            height: this.props.height + d.groupKeys.length * 19 + 20,
            // width: this.props.height + d.groupKeys.length * 19 + 50,
            autosize: true,
        };
        if (this.props.collapse == COLLAPSE_WITH_Mortality120) {
            d.groupKeys.map((gk) => {
                let drs = d.dose_response.filter((r) => r.groupKey == gk),
                    mor120drs = d.mortality120dose_response.filter((r) => r.groupKey == gk),
                    substance_codeCase = _.chain(drs)
                        .map('substance_code')
                        .uniq()
                        .value();
                this.state.labelsDict = [];
                d.substance_code_input_ids.map((id_flag, index) => {
                    let drs_split = _.chain(drs)
                        .filter((r) => r.substance_code_input_id === id_flag)
                        .sortBy('dose')
                        .value();

                    data.push({
                        x: _.map(drs_split, 'dose'),
                        y: drs_split.map((obj) => {
                            return ((obj.n_in / obj.n) * 100).toFixed(2);
                        }),
                        legendgroup: 'plot',
                        mode: 'line',
                        type: 'scatter',
                        text: `${this.getResponseLabels(
                            drs_split[0],
                            this.props.collapse,
                            substance_codeCase
                        )}<br>${this.getTextLabels(drs_split, d)}`,
                        marker: {
                            color: this.getMarkerColor(gk, 'responses'),
                        },
                        opacity: 0.8,
                    });
                });

                d.substance_code_input_ids_120.map((id_flag, index) => {
                    let drs_split = _.chain(mor120drs)
                        .filter((r) => r.substance_code_input_id == id_flag)
                        .sortBy('dose')
                        .value();
                    data.push({
                        x: _.map(drs_split, 'dose'),
                        y: drs_split.map((obj) => {
                            return (obj.n_in / obj.n) * 100;
                        }),
                        legendgroup: 'plot',
                        mode: 'line',
                        type: 'scatter',
                        text: `${this.getResponseLabels(
                            drs_split[0],
                            this.props.collapse,
                            substance_codeCase
                        )}`,
                        marker: {
                            color: this.getMarkerColor(drs_split[0].endpoint_name, 'responses'),
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
                        });
                }
            });
        } else {
            d.groupKeys.map((gk) => {
                let drs = d.dose_response.filter((r) => r.groupKey == gk),
                    substance_codeCase = _.chain(drs)
                        .map('substance_code')
                        .uniq()
                        .value();

                this.state.labelsDict = [];
                d.substance_code_input_ids.map((id_flag, index) => {
                    let drs_split = drs.filter((r) => r.substance_code_input_id == id_flag);
                    drs_split = _.sortBy(drs_split, 'dose');
                    data.push({
                        x: _.map(drs_split, 'dose'),
                        y: drs_split.map((obj) => {
                            return ((obj.n_in / obj.n) * 100).toFixed(2);
                        }),
                        legendgroup: 'plot',
                        mode: 'line',
                        type: 'scatter',
                        text: `${this.getResponseLabels(
                            drs_split[0],
                            this.props.collapse,
                            substance_codeCase
                        )}<br>${this.getTextLabels(drs_split, d)}`,
                        marker: {
                            color: this.getMarkerColor(gk, 'responses'),
                        },
                        opacity: 0.8,
                    });
                });
                if (d.bmcoutput.length > 0) {
                    d.bmcoutput
                        .filter((r) => r.groupKey == gk)
                        .forEach((el) => {
                            if (el.trsh === null || el.hit_confidence < 0.5) {
                                return;
                            }
                            trsh = el.trsh;
                            let dash = gk ? { dash: 'dot' } : null;
                        });
                }
            });
        }
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
        // //console.log(d)

        Plotly.newPlot(this.refs[d.key], data, layout, svgConfig);
    }

    loadDoseResponse() {
        //console.log('loadDoseResponse');
        this.state.collapsedData.map((d) => this._renderPlot(d, this.state.yrange));
    }

    getDerivedStateFrpmProps;

    async componentDidMount() {
        try {
            await this.fetchDoseResponseData(this.props.url);
        } catch (error) {
            //console.error(error);
            // Handle error if needed
            this.setState({ error: 'Failed to fetch data.' });
        }
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.url !== this.props.url) {
            await this.fetchDoseResponseData(this.props.url);
            // this.updateData(this.state.data, this.props.collapse);
            return; // Exit early
        }
        if (prevProps.collapse !== this.props.collapse) {
            await this.fetchDoseResponseData(this.props.url);
            this.updateData(this.state.data, this.props.collapse);
        }
        if (prevProps.cols !== this.props.cols || prevProps.height !== this.props.height) {
            this.loadDoseResponse();
        }
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
        if (!this.state.data) {
            return <Loading />;
        }

        let colNum = Math.ceil(12 / this.props.cols);
        return (
            // <div className="row">
            <div className="d-flex flex-wrap mx-5 my-3">
                {this.state.collapsedData.map((item) => (
                    <div className={`col-${colNum}`} key={item.key} ref={item.key} />
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
    devtoxEndPointList: PropTypes.array,
    final_dev_call: PropTypes.string,
};

export default DoseResponse;
