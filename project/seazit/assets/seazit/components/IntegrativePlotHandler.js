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

            selectivityList: [
                {
                    id: 1,
                    name: "dev tox",
                },
                {
                    id: 2,
                    name: "general tox",
                },
                {
                    id: 3,
                    name: "inconclusive",
                },
                {
                    id: 4,
                    name: "inactive",
                }
            ],


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
            this.setState({ data });

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
        let data = this.state.data.integrative_activity_selectivity,
            ontologyGroup = this.props.ontologyGroup,
            ontologyType = this.props.ontologyType;
            console.log(this.state.data.integrative_activity_selectivity)
            console.log(ontologyGroup)
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
     let data2 = _.map(_.groupBy(data, 'x'), (value, key) => ({[key]: _.groupBy(value, 'y')}))
        console.log(data)
        console.log(data2)
            return {
                    data
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

        return (
            <div>
                {/*<Heatmap data={d.data} />*/}
            </div>
            //    <div>
            //     {/*<DevtoxHeatmap data={d.data} />*/}
            // </div>
        );
    }

}

IntegrativePlotHandler.propTypes = {
    assay: PropTypes.array.isRequired,
    casrns: PropTypes.array.isRequired,
    ontologyType: PropTypes.number.isRequired,
    ontologyGroup: PropTypes.array.isRequired,
    visualization: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
};

export default IntegrativePlotHandler;
