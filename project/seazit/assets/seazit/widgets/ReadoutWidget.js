import $ from '$';
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import BaseWidget from './BaseWidget';

import {
    renderSelectMultiWidget,
    renderSelectSingleWidget,
    renderSelectMultiOptgroupWidget,
    ConcentrationResponseTab,
    BMCTab,
    IntegrativeAnalysesTab,
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
                'assay',
                'dataset',
                options,
                state.assay,
                this.handleSelectChange,
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
                this.handleSelectMultiChange,
            );

    }

    _renderSingleEndpointSelector(state) {
        let assay =  [state.assay];
        let opts = _.chain(state.Seazit_ui_panel)
            .filter((r) => {
                return _.includes(assay, r.seazit_protocol_id.toString());
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
                    };
                })
            .filter((r) => {
                return r.key !== 'Mortality@120' && r.key !== 'Mortality@24' && !(r.key.includes('@24'))
            })
                .sortBy('label')
                .sortBy( function( r ) { return r.label !== 'MalformedAny+Mort@120'; } )
                .sortBy('category')
                .groupBy('category')
                .value();

            if (_.keys(opts).length === 0) {
                return null;
            }
            opts = Object.values(opts)[0];

            // single selections.
            return renderSelectSingleWidget(
                'readouts',
                'endpoint',
                opts,
                state.readouts,
                this.handleSelectChange
            );
    }


    _renderMultipleEndpointSelector(state) {
        let assays =  state.assays;

        let opts = _.chain(state.Seazit_ui_panel)
            .filter((r) => {
                return _.includes(assays, r.seazit_protocol_id.toString());
            })
            .map((r) => {
                    return {
                        key: r.endpoint_name_protocol.toString(),
                        category: r.protocol_name_plot,
                        label: r.endpoint_name,
                        description: r.endpoint_description,
                        protocol_name: r.protocol_name,
                        seazit_protocol_id: r.seazit_protocol_id,
                        study_phase: r.study_phase,
                        test_condition: r.test_condition,
                        protocol_name_long: r.protocol_name_long,
                        protocol_name_plot: r.protocol_name_plot,
                        endpoint_name_protocol: r.endpoint_name_protocol,
                    };
                })
                .sortBy('label')
                .sortBy( function( r ) { return r.label !== 'Mortality@24' && r.label !==  'Mortality@120' && r.label !==  'MalformedAny+Mort@120'; } )
                .sortBy('category')
                .groupBy('category')
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
        switch (state.tabFlag)
            {
                case ConcentrationResponseTab:
                    return(
                        <div>
                            {this._renderMultipleDatasetSelector(state)}
                            {this._renderMultipleEndpointSelector(state)}

                        </div>
                    )
            };
        switch (state.tabFlag)
            {
                case BMCTab:
                    return(
                        <div>
                            {this._renderSingleDatasetSelector(state)}
                            {this._renderSingleEndpointSelector(state)}

                        </div>
                    )
            };
        switch (state.tabFlag)
            {
                case IntegrativeAnalysesTab:
                    return(
                        <div>
                            {this._renderMultipleDatasetSelector(state)}
                        </div>
                    )
            };
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
