import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import _ from 'lodash';
import Loading from 'utils/Loading';
import {svg_download_form, data_exportToJsonFile, BMDVIZ_ACTIVITY} from '../shared';
import Heatmap from './Heatmap';
import DevtoxHeatmap from './DevtoxHeatmap';
import {
    READOUT_TYPE_READOUT,
    READOUT_TYPE_CATEGORY,
    HEATMAP_ACTIVITY,
    HEATMAP_BMC,
    INTVIZ_DevtoxHEATMAP,
    INTVIZ_HEATMAP,
    integrative_Granular,
    integrative_General,
    printFloat,
    renderNoDataAlert,
} from '../shared';


class IntegrativePlotHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            scale: null,
            continuousColorScale: null,

        };
    }

    fetchIntegrativeData(url) {
        d3.json(url, (error, data) => {
            if (error) {
                let err = error.target.responseText.replace('["', '').replace('"]', '');
                this.setState({
                    data: [],
                    error: err,
                });
                return;
            }
            let domain = [1e-5, 1e3],
                scale = d3
                    .scaleLog()
                    .range([1, 0])
                    .domain(domain),
                continuousColorScale = function(d) {
                    return d3.interpolateViridis(scale(d));
                };

            this.setState({
                data,
                scale,
                continuousColorScale,
                });

        });
    }


    componentWillMount() {
        this.fetchIntegrativeData(this.props.url);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.url !== this.props.url) {
            this.fetchIntegrativeData(nextProps.url);
        }
    }

    _getFilteredData() {

        let getFillFunction = function(visualization, continuousColorScale) {
                switch (visualization) {
                    case INTVIZ_HEATMAP:
                        return function(data) {
                            switch (data.final_dev_call) {
                                case 'dev tox':
                                    return '#d62976';
                                case 'general tox':
                                    return '#f9d70b';
                                case 'inconclusive':
                                    return '#3BD6C6';
                                case 'inactive':
                                    return '#FFFFFF';
                                default:
                                    return '#C9C9C9';
                            }
                        };
                    case INTVIZ_DevtoxHEATMAP:
                        return function(data) {
                            return data.mean_pod ? continuousColorScale(Math.pow(10, data.mean_pod) * 1000000) : 'white';
                        };
                    default:
                        throw 'Unknown display type.';
                }
            };
       let  getLegendData = function(visualization, scale, colorScale) {
                switch (visualization) {
                    case INTVIZ_HEATMAP:
                        return {
                            type: 'discrete',
                            values: [
                                {
                                    label: 'dev tox',
                                    fill: '#d62976',
                                },
                                {
                                    label: 'general tox',
                                    fill: '#f9d70b',
                                },
                                {
                                    label: 'inconclusive',
                                    fill: '#3BD6C6',
                                },
                                {
                                    label: 'inactive',
                                    fill:'#FFFFFF',
                                },
                                {
                                    label: 'untested',
                                    fill: '#C9C9C9',
                                },

                            ],
                        };

                    // HEATMAP_BMC type is continuous, search that.
                    case INTVIZ_DevtoxHEATMAP:
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
                this.props.visualization,
                 this.state.continuousColorScale

            ),
         legendData = getLegendData(
                this.props.visualization,
                this.state.scale,
                this.state.continuousColorScale
            );


        let data = this.state.data.integrative_activity_selectivity,
            ontologyGroup = this.props.ontologyGroup,
            ontologyType = this.props.ontologyType;

        switch (ontologyType) {
            case integrative_Granular: {
                data = _.chain(data)
                    .filter((i) => ontologyGroup.includes(i.developmental_defect_grouping_granular))
                    .map((d) => {
                        return {
                            protocol_id:   d.protocol_id ,
                            endpoint_name: d.endpoint_name,
                            casrn: d.casrn,
                            preferred_name:  d.preferred_name,
                            use_category1:  d.use_category1,
                            min_pod_med: d.min_pod_med,
                            med_pod_med: d.med_pod_med,
                            max_pod_med: d.max_pod_med,
                            med_hitconf: d.med_hitconf,
                            n_values:  d.n_values  ,
                            mort_min_pod_med:  d.mort_min_pod_med   ,
                            mort_med_pod_med:  d.mort_med_pod_med  ,
                            mort_max_pod_med:  d.mort_max_pod_med  ,
                            mort_med_hitconf:  d.mort_med_hitconf  ,
                            mort_n_values:  d.mort_n_values  ,
                            min_lowest_conc: d.min_lowest_conc,
                            max_highest_conc: d.max_highest_conc,
                            mean_pod: d.mean_pod,
                            mean_selectivity: d.mean_selectivity,
                            med_mort_hit_confidence: d.med_mort_hit_confidence,
                            n_rep_max_dev_call: d.n_rep_max_dev_call   ,
                            n_rep:  d.n_rep,
                            f_max_dev_call: d.f_max_dev_call,
                            final_dev_call: d.final_dev_call,
                            malformation: d.malformation,
                            endpoint_name_protocol: d.endpoint_name_protocol,
                            combin_ontology: d.combin_ontology,
                            combin_ontology_id: d.combin_ontology_id,
                            protocol_source: d.protocol_source,
                            lab_anonymous_code: d.lab_anonymous_code,
                            study_phase: d.study_phase,
                            test_condition:   d.test_condition  ,
                            protocol_name_long:  d.protocol_name_long  ,
                            protocol_name_plot:   d.protocol_name_plot ,
                            proposed_ontology_label:   d.proposed_ontology_label ,
                            ontology_id_number:   d.ontology_id_number ,
                            recording_name:   d.recording_name ,
                            developmental_defect_catergories:   d.developmental_defect_catergories ,
                            defects_mapped_to_body_region:   d.defects_mapped_to_body_region ,
                            developmental_defect_grouping_granular: d.developmental_defect_grouping_granular,
                            developmental_defect_grouping_general:   d.developmental_defect_grouping_general ,
                            seazit_recording_id:   d.seazit_recording_id ,
                            x: d.protocol_name_plot + ": " + d.developmental_defect_grouping_granular,
                            y: d.preferred_name,
                            fill:  fillFunction(d),
                        };
                    })
                    .sortBy('med_pod_med')
                    .value();
                    break;
                    };
            case integrative_General: {
                data = _.chain(data)
                    .filter((i) => ontologyGroup.includes(i.developmental_defect_grouping_general))
                    .map((d) => {
                        return {
                            protocol_id:   d.protocol_id ,
                            endpoint_name: d.endpoint_name,
                            casrn: d.casrn,
                            preferred_name:  d.preferred_name,
                            use_category1:  d.use_category1,
                            min_pod_med: d.min_pod_med,
                            med_pod_med: d.med_pod_med,
                            max_pod_med: d.max_pod_med,
                            med_hitconf: d.med_hitconf,
                            n_values:  d.n_values  ,
                            mort_min_pod_med:  d.mort_min_pod_med   ,
                            mort_med_pod_med:  d.mort_med_pod_med  ,
                            mort_max_pod_med:  d.mort_max_pod_med  ,
                            mort_med_hitconf:  d.mort_med_hitconf  ,
                            mort_n_values:  d.mort_n_values  ,
                            min_lowest_conc: d.min_lowest_conc,
                            max_highest_conc: d.max_highest_conc,
                            mean_pod: d.mean_pod,
                            mean_selectivity: d.mean_selectivity,
                            med_mort_hit_confidence: d.med_mort_hit_confidence,
                            n_rep_max_dev_call: d.n_rep_max_dev_call   ,
                            n_rep:  d.n_rep,
                            f_max_dev_call: d.f_max_dev_call,
                            final_dev_call: d.final_dev_call,
                            malformation: d.malformation,
                            endpoint_name_protocol: d.endpoint_name_protocol,
                            combin_ontology: d.combin_ontology,
                            combin_ontology_id: d.combin_ontology_id,
                            protocol_source: d.protocol_source,
                            lab_anonymous_code: d.lab_anonymous_code,
                            study_phase: d.study_phase,
                            test_condition:   d.test_condition  ,
                            protocol_name_long:  d.protocol_name_long  ,
                            protocol_name_plot:   d.protocol_name_plot ,
                            proposed_ontology_label:   d.proposed_ontology_label ,
                            ontology_id_number:   d.ontology_id_number ,
                            recording_name:   d.recording_name ,
                            developmental_defect_catergories:   d.developmental_defect_catergories ,
                            defects_mapped_to_body_region:   d.defects_mapped_to_body_region ,
                            developmental_defect_grouping_granular:   d.developmental_defect_grouping_granular ,
                            developmental_defect_grouping_general:   d.developmental_defect_grouping_general ,
                            seazit_recording_id:   d.seazit_recording_id ,
                            x: d.protocol_name_plot + ": " + d.developmental_defect_grouping_general,
                            y: d.preferred_name,
                        };
                    })
                    .sortBy('med_pod_med')
                    .value();
                    break;
                    };
        }
     // let data2 = _.map(_.groupBy(data, 'x'), (value, key) => ({[key]: _.groupBy(value, 'y')}))
       console.log("plot data")
         console.log(this.state.data.integrative_activity_selectivity)
        console.log(data)
        // console.log(data2)
            return {
                    data,
                    legendData,
                };
         };

    render() {
        if (!this.state.data) {
            return <Loading />;
        }
        console.log(this.props)
        let d;
        d = this._getFilteredData();
        console.log(d)

        // this is result, with color name is fill data.
        if (d.data.length === 0) {
            return renderNoDataAlert();
        }

        if (this.props.visualization == INTVIZ_HEATMAP )
        {
            return (
            <div>
                <Heatmap data={d.data}
                     legendData={d.legendData}
                />
            </div>
        );
        }
           else
        {
            return (
               <div>
                <DevtoxHeatmap data={d.data}
                     legendData={d.legendData}
                />
             </div>
        );
        }

    }

}

IntegrativePlotHandler.propTypes = {
    assays: PropTypes.array.isRequired,
    casrns: PropTypes.array.isRequired,
    ontologyType: PropTypes.number.isRequired,
    ontologyGroup: PropTypes.array.isRequired,
    visualization: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
};

export default IntegrativePlotHandler;
