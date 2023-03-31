import $ from '$';
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import BaseWidget from './BaseWidget';
import OntologyTypeWidget from './OntologyTypeWidget';

import {
    renderSelectMultiWidget,
    renderSelectSingleWidget,
    renderSelectMultiOptgroupWidget,
    ConcentrationResponseTab,
    BMCTab,
    IntegrativeAnalysesTab,
    integrative_Granular,
    integrative_General,
} from '../shared';

class ReadoutWidget extends BaseWidget {
    /*
    ReadoutWidget requires the following state properties:
    */

    constructor(props) {
        super(props);
    }

    _renderSingleDatasetSelector(state) {
        let options = _.chain(state.protocol_data)
            .map((r) => {
                return {
                    key: r.seazit_protocol_id,
                    label: r.protocol_name_long,
                    protocol_name: r.protocol_name,
                    description: r.protocol_name_plot,
                    protocol_type: r.protocol_type,
                    protocol_source: r.protocol_source,
                    seazit_protocol_id: r.seazit_protocol_id,
                    lab_anonymous_code: r.lab_anonymous_code,
                    study_phase: r.study_phase,
                    test_condition: r.test_condition,
                    protocol_name_long: r.protocol_name_long,
                    protocol_name_plot: r.protocol_name_plot,
                };
            })
            .sortBy('seazit_protocol_id')
            .value();

        return renderSelectSingleWidget(
            'assays',
            'dataset',
            options,
            state.assays,
            this.handleSelectChange
        );
    }

    _renderMultipleDatasetSelector(state) {
        let options = _.chain(state.protocol_data)
            .map((r) => {
                return {
                    key: r.seazit_protocol_id,
                    label: r.protocol_name_long,
                    protocol_name: r.protocol_name,
                    description: r.protocol_name_plot,
                    protocol_type: r.protocol_type,
                    protocol_source: r.protocol_source,
                    seazit_protocol_id: r.seazit_protocol_id,
                    lab_anonymous_code: r.lab_anonymous_code,
                    study_phase: r.study_phase,
                    test_condition: r.test_condition,
                    protocol_name_long: r.protocol_name_long,
                    protocol_name_plot: r.protocol_name_plot,
                };
            })
            .sortBy('seazit_protocol_id')
            .value();

        return renderSelectMultiWidget(
            'assays',
            'dataset',
            options,
            state.assays,
            this.handleSelectMultiChange
        );
    }

    _renderFilterBy(state) {
        if (state.assays.length === 0) {
            return null;
        }
        return (
            <div>
                <label>Filter endpoints by:</label>
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

    _renderMultipleEndpointSelector(state) {
        let assays = state.assays,
            opts,
            ontologyGroup,
            groupBy;

        switch (state.tabFlag) {
            case ConcentrationResponseTab:
                groupBy = 'category';
                break;
            case BMCTab:
                if (state.ontologyType === integrative_Granular) {
                    groupBy = 'developmental_defect_grouping_granular';
                } else {
                    groupBy = 'developmental_defect_grouping_general';
                }
                break;
            case IntegrativeAnalysesTab:
                if (state.ontologyType === integrative_Granular) {
                    groupBy = 'developmental_defect_grouping_granular';
                } else {
                    groupBy = 'developmental_defect_grouping_general';
                }
                break;
            default:
                return null;
        }

        // console.log(state)
        opts = _.chain(state.Seazit_ui_panel)
            .filter((r) => {
                return _.includes(assays, r.seazit_protocol_id.toString());
            })
            .reject((r) => {
                return (
                    r.endpoint_name == 'Mortality@120' ||
                    r.endpoint_name == 'Mortality@24' ||
                    r.endpoint_name.includes('@24')
                );
            })
            .map((r) => {
                return {
                    key: r.endpoint_name_protocol.toString(),
                    category: r.protocol_name_plot,
                    label: r.endpoint_name,
                    description: r.endpoint_description,
                    protocol_name: r.protocol_name,
                    seazit_protocol_id: r.seazit_protocol_id.toString(),
                    study_phase: r.study_phase,
                    test_condition: r.test_condition,
                    protocol_name_long: r.protocol_name_long,
                    protocol_name_plot: r.protocol_name_plot,
                    endpoint_name_protocol: r.endpoint_name_protocol,
                    developmental_defect_grouping_general: r.developmental_defect_grouping_general,
                    developmental_defect_grouping_granular:
                        r.developmental_defect_grouping_granular,
                };
            })
            .uniqBy('key')
            .sortBy('label')
            .groupBy(groupBy)
            .value();
        if (_.keys(opts).length === 0) {
            return null;
        }
        return renderSelectMultiOptgroupWidget(
            'readouts',
            'endpoint',
            opts,
            state.readouts,
            this.handleSelectMultiChange
        );
    }

    render() {
        let state = this.props.stateHolder.state;
        switch (state.tabFlag) {
            case ConcentrationResponseTab:
                return (
                    <div>
                        {this._renderMultipleDatasetSelector(state)}
                        <br />
                        {this._renderFilterBy(state)}
                        {this._renderMultipleEndpointSelector(state)}
                    </div>
                );

            case BMCTab:
                return (
                    <div>
                        {this._renderSingleDatasetSelector(state)}
                        <br />
                        {this._renderFilterBy(state)}
                        {this._renderMultipleEndpointSelector(state)}
                    </div>
                );
            case IntegrativeAnalysesTab:
                return <div>{this._renderMultipleDatasetSelector(state)}</div>;
        }
    }
}

ReadoutWidget.propTypes = {
    stateHolder: PropTypes.instanceOf(React.Component).isRequired,
    hideViability: PropTypes.bool.isRequired,
    hideNonViability: PropTypes.bool.isRequired,
    multiAssaySelector: PropTypes.bool.isRequired,
    multiReadoutSelector: PropTypes.bool.isRequired,
};

export default ReadoutWidget;
