import $ from '$';
import _ from 'lodash';
import React from 'react';
import BaseWidget from './BaseWidget';

import {
    renderSelectMultiWidget,
    renderSelectMultiOptgroupWidget,
    integrative_Granular,
    integrative_General
} from '../shared';
import PropTypes from "prop-types";

class OntologyWidget extends BaseWidget {

    constructor(props) {
        super(props);
    }

    _renderFilterBy(state) {
        return (
            <div>
                <label>Ontology Groupings:</label>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="ontologyType"
                            onChange={this.handleRadioChange}
                            value={integrative_Granular}
                            checked={state.ontologyType === integrative_Granular}
                        />
                        Granular
                    </label>

                    <span style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>|</span>

                    <label>
                        <input
                            type="radio"
                            name="ontologyType"
                            onChange={this.handleRadioChange}
                            value={integrative_General}
                            checked={state.ontologyType === integrative_General}
                        />
                        General
                    </label>
                </div>
            </div>

        );
    }

    _renderSelector(state) {
        let opts;
        if (state.ontologyType === integrative_Granular) {
            opts = _.chain(state.Seazit_ontology)
                .map((r) => {
                return {
                    key: r.developmental_defect_grouping_granular,
                    label: r.developmental_defect_grouping_granular,
                    developmental_defect_catergories:r.developmental_defect_catergories,
                    developmental_defect_grouping_general:r.developmental_defect_grouping_general,
                    developmental_defect_grouping_granular:r.developmental_defect_grouping_granular,
                    hour_post_fertilization:r.hour_post_fertilization,
                    ontology_id_number:r.ontology_id_number,
                    proposed_ontology_label:r.proposed_ontology_label,
                    protocol_source:r.protocol_source,
                    recording_name:r.recording_name,
                    seazit_recording_id:r.seazit_recording_id,

                };
            })
            .uniqBy('developmental_defect_grouping_granular')
            .sortBy('developmental_defect_grouping_granular')
            .groupBy('developmental_defect_catergories')
            .value()
            ;
            console.log(opts)
            if (_.keys(opts).length === 0) {
                    return null;
            }
            return renderSelectMultiOptgroupWidget(
                'ontologyGroup',
                'Granular',
                opts,
                state.ontologyGroup,
                this.handleSelectMultiChange
            );
        } else {
            opts = _.chain(state.Seazit_ontology)
                .map((r) => {
                return {
                    key: r.developmental_defect_grouping_general,
                    label: r.developmental_defect_grouping_general,
                    developmental_defect_catergories:r.developmental_defect_catergories,
                    developmental_defect_grouping_general:r.developmental_defect_grouping_general,
                    developmental_defect_grouping_granular:r.developmental_defect_grouping_granular,
                    hour_post_fertilization:r.hour_post_fertilization,
                    ontology_id_number:r.ontology_id_number,
                    proposed_ontology_label:r.proposed_ontology_label,
                    protocol_source:r.protocol_source,
                    recording_name:r.recording_name,
                    seazit_recording_id:r.seazit_recording_id,                };
            })
            .uniqBy('developmental_defect_grouping_general')
            .sortBy('developmental_defect_grouping_general')
            .groupBy('developmental_defect_catergories')
            .value()
            ;
            if (_.keys(opts).length === 0) {
                    return null;
                }

            return renderSelectMultiOptgroupWidget(
                'ontologyGroup',
                'General',
                opts,
                state.ontologyGroup,
                this.handleSelectMultiChange
            );
        }
    }

    render() {
        let state = this.props.stateHolder.state;
        return (
            <div className="clearfix">
                {this._renderFilterBy(state)}
                {this._renderSelector(state)}
            </div>
        );
    }
}

OntologyWidget.propTypes = {
    stateHolder: PropTypes.instanceOf(React.Component).isRequired,
    // hideViability: PropTypes.bool.isRequired,
    // hideNonViability: PropTypes.bool.isRequired,
    // multiAssaySelector: PropTypes.bool.isRequired,
    // multiReadoutSelector: PropTypes.bool.isRequired,
    // tabName: PropTypes.string.isRequired,
};

export default OntologyWidget;
