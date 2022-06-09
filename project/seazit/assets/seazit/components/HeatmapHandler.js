import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import _ from 'lodash';
import Loading from 'utils/Loading';
import heatmap from './heatmap';
import { svg_download_form, data_exportToJsonFile } from '../shared';

import {
    READOUT_TYPE_READOUT,
    READOUT_TYPE_CATEGORY,
    HEATMAP_ACTIVITY,
    HEATMAP_BMC,
    printFloat,
    renderNoDataAlert,
} from '../shared';
import Heatmap from './Heatmap';

class HeatmapHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            scale: null,
            continuousColorScale: null,
        };
    }

    _updateData(url) {
        d3.json(url, (error, data) => {
            if (error) {
                let err = error.target.responseText.replace('["', '').replace('"]', '');
                this.setState({
                    data: [],
                    error: err,
                });
                return;
            }
            // console.log(this.state.data)
            console.log('data');
            console.log(url);
            console.log(data);
            this.setState({ data });
        });
    }


    componentWillMount() {
        this._updateData(this.props.url);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.url !== this.props.url) {
            this._updateData(nextProps.url);
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.url !== this.props.url) {
            this._updateData(nextProps.url);
        }
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
                        // return colorscale if it exist, otherwise, white
                        return function(data) {
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
            // hoverTextFunction = getHoverTextFunction(this.props.heatmapDisplay),
            legendData = getLegendData(
                this.props.heatmapDisplay,
                this.state.scale,
                this.state.continuousColorScale
            ),
            // readout_ids = this.props.readouts.map((d) => parseInt(d)),
            data;

        switch (this.props.readoutType) {
            case READOUT_TYPE_READOUT: {

                data = _.chain(this.state.data.bmd_activity_selectivity)
                    .map((d) => {
                        return {
                            casrn: d.casrn,
                            combin_ontology: d.combin_ontology,
                            combin_ontology_id: d.combin_ontology_id,
                            dtxsid: d.dtxsid,
                            endpoint_name: d.endpoint_name,
                            endpoint_name_protocol: d.endpoint_name_protocol,
                            f_max_dev_call: d.f_max_dev_call,
                            final_dev_call: d.final_dev_call,
                            lab_anonymous_code: d.lab_anonymous_code,
                            malformation: d.malformation,

                            max_highest_conc: d.max_highest_conc,
                            max_pod_med: d.max_pod_med,
                            mean_pod: d.mean_pod,
                            mean_selectivity: d.mean_selectivity,

                            med_hitconf: d.med_hitconf,
                            med_mort_hit_confidence: d.med_mort_hit_confidence,
                            med_pod_med: d.med_pod_med,
                            min_lowest_conc: d.min_lowest_conc,
                            min_pod_med:  d.min_pod_med  ,
                            mort_max_pod_med:  d.mort_max_pod_med  ,
                            mort_med_hitconf:  d.mort_med_hitconf  ,
                            mort_med_pod_med:  d.mort_med_pod_med  ,
                            mort_min_pod_med:  d.mort_min_pod_med   ,
                            mort_n_values:  d.mort_n_values  ,
                            n_rep:  d.n_rep  ,
                            n_rep_max_dev_call: d.n_rep_max_dev_call   ,
                            n_values:  d.n_values  ,
                            preferred_name:  d.preferred_name   ,
                            protocol_id:   d.protocol_id ,
                            protocol_name_long:  d.protocol_name_long  ,
                            protocol_name_plot:   d.protocol_name_plot ,
                            test_condition:   d.test_condition  ,
                            use_category1:  d.use_category1  ,
                        };
                    })
                    .sortBy('med_pod_med')
                    .value();
                break;
            }
            case READOUT_TYPE_CATEGORY: {
            data = _.chain(this.state.data.bmd_activity_selectivity)
                    .map((d) => {
                        return {
                            casrn: d.casrn,
                            combin_ontology: d.combin_ontology,
                            combin_ontology_id: d.combin_ontology_id,
                            dtxsid: d.dtxsid,
                            endpoint_name: d.endpoint_name,
                            endpoint_name_protocol: d.endpoint_name_protocol,
                            f_max_dev_call: d.f_max_dev_call,
                            final_dev_call: d.final_dev_call,
                            lab_anonymous_code: d.lab_anonymous_code,
                            malformation: d.malformation,

                            max_highest_conc: d.max_highest_conc,
                            max_pod_med: d.max_pod_med,
                            mean_pod: d.mean_pod,
                            mean_selectivity: d.mean_selectivity,

                            med_hitconf: d.med_hitconf,
                            med_mort_hit_confidence: d.med_mort_hit_confidence,
                            med_pod_med: d.med_pod_med,
                            min_lowest_conc: d.min_lowest_conc,
                            min_pod_med:  d.min_pod_med  ,
                            mort_max_pod_med:  d.mort_max_pod_med  ,
                            mort_med_hitconf:  d.mort_med_hitconf  ,
                            mort_med_pod_med:  d.mort_med_pod_med  ,
                            mort_min_pod_med:  d.mort_min_pod_med   ,
                            mort_n_values:  d.mort_n_values  ,
                            n_rep:  d.n_rep  ,
                            n_rep_max_dev_call: d.n_rep_max_dev_call   ,
                            n_values:  d.n_values  ,
                            preferred_name:  d.preferred_name   ,
                            protocol_id:   d.protocol_id ,
                            protocol_name_long:  d.protocol_name_long  ,
                            protocol_name_plot:   d.protocol_name_plot ,
                            test_condition:   d.test_condition  ,
                            use_category1:  d.use_category1  ,
                        };
                    })
                    .sortBy('med_pod_med')
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
    };

    render() {
        if (!this.state.data) {
            return <Loading />;
        }
        let d;
        d = this._getFilteredData();
        console.log(d)


        // this is result, with color name is fill data.
        // if (d.data.length === 0) {
        if (d.length === 0) {
            return renderNoDataAlert();
        }

        return (
            <div>
                <Heatmap data={d.data} legendData={"zw"} />
            </div>
        );
    }
}

HeatmapHandler.propTypes = {
    bmdType: PropTypes.string.isRequired,
    casrns: PropTypes.array.isRequired,
    heatmapDisplay: PropTypes.number.isRequired,
    readoutType: PropTypes.number.isRequired,
    readouts: PropTypes.array.isRequired,
    readoutCategories: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired,

};

export default HeatmapHandler;
