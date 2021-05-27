import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import _ from 'lodash';
import Loading from 'utils/Loading';
import ResponseFigure from './ResponseFigure';

import {
    READOUT_TYPE_READOUT,
    READOUT_TYPE_CATEGORY,
    HEATMAP_ACTIVITY,
    HEATMAP_BMC,
    printFloat,
    renderNoDataAlert,
} from '../shared';

class ResponseHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            scale: null,
            continuousColorScale: null,
        };
    }

    _updateData(bmdType) {
        //  ex:  /neurotox/api/hill/bmds/?format=tsv
        // ex: /neurotox/api/curvep/bmds/?format=tsv
        // ex: /neurotox/api/exposure/bmds/?format=tsv
        //TODO, make exposurebmdType below

        let url = `/neurotox/api/exposure${bmdType}/bmds/?format=tsv`,
            // neurotox/api/curvep/bmds/?format=tsv

            // call django (url)
            // I really dont understand this.... Ask Sue maybe.
            cleanRow = function(row) {
                return {
                    id: +row.id,
                    bmd: row.bmd ? +row.bmd : null,
                    is_active: row.is_active === 'True',
                    substance_id: +row.substance_id,
                    chemical_casrn: row.chemical_casrn,
                    chemical_name: row.chemical_name,
                    provider: row.protocol_provider,
                    provider_category: `${row.protocol_provider}: ${row.readout_category}`,
                    readout_endpoint: row.readout_endpoint,
                    readout_id: +row.readout_id,
                    seem3_cmean: row.seem3_cmean ? +row.seem3_cmean : null,
                    seem3_l95: row.seem3_l95 ? +row.seem3_l95 : null,
                    seem3_u95: row.seem3_u95 ? +row.seem3_u95 : null,
                    chemical_category: row.chemical_category,
                };
            },
            formatData = (error, data) => {
                // TODO - domain hard-coded to make constant for CurveP & Hill

                let domain = [1e-5, 1e3],
                    scale = d3
                        .scaleLog()
                        .range([1, 0])
                        .domain(domain),
                    // zicong-10-7 .
                    // continuousColorScale, d3.interpolateViridis(scale(d)' function
                    // is the one covert number to color. d is the input .
                    continuousColorScale = function(d) {
                        return d3.interpolateViridis(scale(d));
                    };

                this.setState({
                    data,
                    scale,
                    continuousColorScale,
                });
            };

        // state.data is null here
        d3.tsv(url, cleanRow, formatData);
    }

    componentWillMount() {
        this._updateData(this.props.bmdType);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.bmdType !== this.props.bmdType) {
            this._updateData(nextProps.bmdType);
        }
        return true;
    }

    _getFilteredData() {
        let getFillFunction = function(heatmapDisplay, continuousColorScale) {
                switch (heatmapDisplay) {
                    case HEATMAP_ACTIVITY:
                        return function(data) {
                            switch (data.is_active) {
                                case true:
                                    return 'black';
                                case false:
                                    return 'white';
                                default:
                                    return '#C9C9C9';
                            }
                        };
                    case HEATMAP_BMC:
                        // return color scale if it exist, otherwise, white
                        return function(data) {
                            // the scale color is coverted from data.bmd,
                            // if null, white.
                            return data.bmd ? continuousColorScale(data.bmd) : 'white';
                        };
                    default:
                        throw 'Unknown display type.';
                }
            },
            getHoverTextFunction = function(heatmapDisplay) {
                switch (heatmapDisplay) {
                    case HEATMAP_ACTIVITY:
                        return function(d) {
                            return `${d.chemical_name}<br/>
                                ${d.readout_endpoint}<br/>
                                ${d.is_active ? 'Active' : 'Inactive'}`;
                        };
                    case HEATMAP_BMC:
                        return function(d) {
                            return `${d.chemical_name}<br/>
                                ${d.readout_endpoint}<br/>
                                BMC = ${d.is_active ? `${printFloat(d.bmd)} µM` : 'None'}`;
                        };
                    default:
                        throw 'Unknown display type.';
                }
            },
            getLegendData = function(heatmapDisplay, scale, colorScale) {
                switch (heatmapDisplay) {
                    case HEATMAP_ACTIVITY:
                        return {
                            type: 'discrete',
                            values: [
                                {
                                    label: 'active',
                                    fill: 'black',
                                },
                                {
                                    label: 'inactive',
                                    fill: 'white',
                                },
                                {
                                    label: 'untested',
                                    fill: '#C9C9C9',
                                },
                            ],
                        };

                    // HEATMAP_BMC type is continuous, search that.
                    case HEATMAP_BMC:
                        return {
                            type: 'continuous',
                            legendScale: scale,
                            colorScaleFunction: colorScale,
                        };
                    default:
                        throw 'Unknown display type.';
                }
            };

        let fillFunction = getFillFunction(
                this.props.heatmapDisplay,
                this.state.continuousColorScale
            ),
            hoverTextFunction = getHoverTextFunction(this.props.heatmapDisplay),
            legendData = getLegendData(
                this.props.heatmapDisplay,
                this.state.scale,
                this.state.continuousColorScale
            ),
            readout_ids = this.props.readouts.map((d) => parseInt(d)),
            data;

        switch (this.props.readoutType) {
            case READOUT_TYPE_READOUT: {
                data = _.chain(this.state.data)
                    .filter((d) => _.includes(this.props.casrns, d.chemical_casrn))
                    .filter((d) => _.includes(readout_ids, d.readout_id))
                    .map((d) => {
                        return {
                            bmd: d.bmd,
                            x: `${d.provider}: ${d.readout_endpoint}`,
                            x_key: d.readout_id,
                            y: d.chemical_name,
                            y_key: d.chemical_casrn,
                            fill: fillFunction(d),
                            hover_text: hoverTextFunction(d),
                            chemical_casrn: d.chemical_casrn,
                            chemical_name: d.chemical_name,
                            readout_id: d.readout_id,
                            title: `${d.chemical_name}: ${d.readout_endpoint}`,
                            seem3_cmean: d.seem3_cmean,
                            seem3_l95: d.seem3_l95,
                            seem3_u95: d.seem3_u95,
                            chemical_category: d.chemical_category,
                        };
                    })
                    .value();
                break;
            }
            case READOUT_TYPE_CATEGORY: {
                data = _.chain(this.state.data)
                    .filter((d) => _.includes(this.props.casrns, d.chemical_casrn))
                    .filter((d) => _.includes(this.props.readoutCategories, d.provider_category))
                    .each((d) => (d._key = `${d.chemical_casrn}-${d.provider_category}`))
                    .groupBy('_key')
                    .values()
                    .map((arr) => {
                        let d = _.chain(arr)
                            .filter((d) => d.bmd > 0)
                            .min((d) => d.bmd)
                            .value();
                        if (!_.isObject(d)) {
                            // if no bmd exists; just pick first
                            d = arr[0];
                        }
                        d.readouts = _.sortBy(arr, 'bmd');
                        return d;
                    })
                    .map((d) => {
                        return {
                            bmd: d.bmd,
                            x: d.provider_category,
                            x_key: d.readout_id, // changeme
                            y: d.chemical_name,
                            y_key: d.chemical_casrn,
                            fill: fillFunction(d),
                            hover_text: hoverTextFunction(d),
                            chemical_casrn: d.chemical_casrn,
                            chemical_name: d.chemical_name,
                            readout_id: d.readout_id,
                            title: `${d.chemical_name}: ${d.readout_endpoint}`,
                            readouts: d.readouts,
                            seem3_cmean: d.seem3_cmean,
                            seem3_l95: d.seem3_l95,
                            seem3_u95: d.seem3_u95,
                            chemical_category: d.chemical_category,
                        };
                    })
                    .value();

                break;
            }
            default: {
                throw 'Unknown readoutType';
            }
        }
        return {
            data,
            legendData,
        };
    }
    786;

    render() {
        //        console.log(this.state.data);
        if (!this.state.data) {
            return <Loading />;
        }
        //        console.log(this.state.data);
        let d = this._getFilteredData();
        //        console.log(d);

        // this is result, with color name is fill data.
        if (d.data.length === 0) {
            return renderNoDataAlert();
        }
        return <ResponseFigure data={d.data} legendData={d.legendData} />;
    }
}

ResponseHandler.propTypes = {
    bmdType: PropTypes.string.isRequired,
    casrns: PropTypes.array.isRequired,
    heatmapDisplay: PropTypes.number.isRequired,
    readoutType: PropTypes.number.isRequired,
    readouts: PropTypes.array.isRequired,
    readoutCategories: PropTypes.array.isRequired,
};

export default ResponseHandler;
