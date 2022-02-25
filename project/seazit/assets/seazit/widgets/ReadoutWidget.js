import $ from '$';
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import BaseWidget from './BaseWidget';

import {
    renderSelectMultiWidget,
    renderSelectSingleWidget,
    renderSelectMultiOptgroupWidget,
} from '../shared';

class ReadoutWidget extends BaseWidget {
    /*
    ReadoutWidget requires the following state properties:
    */

    constructor(props) {
        super(props);
    }

    _renderAssaySelector(state) {
        let options = _.chain(state.protocol_data)
            .map((r) => {
                return {
                    key: r.seazit_protocol_id,
                    label: r.protocol_name_long,
                    protocol_name: r.protocol_name,
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
        if (this.props.multiAssaySelector === true) {
            return renderSelectMultiWidget(
                'assays',
                'dataset',
                options,
                state.assays,
                this.handleSelectMultiChange
            );
        } else {
            return renderSelectSingleWidget(
                'assay',
                'dataset',
                options,
                state.assay,
                this.handleSelectChange
            );
        }
    }

    _renderReadoutSelector(state) {
        let assays = this.props.multiAssaySelector === true ? state.assays : [state.assay];
        let opts = _.chain(state.Seazit_ui_panel)
            .filter((r) => {
                return _.includes(assays, r.seazit_protocol_id.toString());
            })
            .value();
        if (this.props.multiReadoutSelector) {
            opts = _.chain(opts)
                .map((r) => {
                    return {
                        // key: `${r.endpoint_name} | ${r.seazit_protocol_id}`,
                        // key: r.endpoint_name.toString(),
                        key: r.endpoint_name_protocol.toString(),
                        category: r.protocol_name_plot,
                        label: r.endpoint_name,
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
                .sortBy('category')
                .groupBy('category')
                .value();
            let endpointCases = ['MalformedAny+Mort@120', 'Mortality@120', 'Mortality@24'];
            Object.values(opts).forEach((val) => {
                val.forEach(function(item, i) {
                    if (endpointCases.includes(item.label)) {
                        val.splice(i, 1);
                        val.unshift(item);
                    }
                });
            });
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
        } else {
            opts = _.chain(opts)
                .map((r) => {
                    return {
                        // key: `${r.endpoint_name} | ${r.seazit_protocol_id}`,
                        // key: r.endpoint_name.toString(),
                        key: r.endpoint_name.toString(),
                        category: r.protocol_name_plot,
                        label: r.endpoint_name,
                        protocol_name: r.protocol_name,
                        seazit_protocol_id: r.seazit_protocol_id.toString(),
                        study_phase: r.study_phase,
                        test_condition: r.test_condition,
                        protocol_name_long: r.protocol_name_long,
                        protocol_name_plot: r.protocol_name_plot,
                        endpoint_name_protocol: r.endpoint_name_protocol,
                    };
                })
                .sortBy('label')
                .sortBy('category')
                .groupBy('category')
                .value();
            Object.values(opts).forEach((val) => {
                val.forEach(function(item, index) {
                    if (
                        item.key == 'Mortality@120' ||
                        item.key == 'Mortality@24' ||
                        item.key.includes('@24')
                    ) {
                        delete val[index];
                    }
                });
            });

            let endpointCases = ['MalformedAny+Mort@120'];
            Object.values(opts).forEach((val) => {
                val.forEach(function(item, i) {
                    if (endpointCases.includes(item.label)) {
                        val.splice(i, 1);
                        val.unshift(item);
                    }
                });
            });
            if (_.keys(opts).length === 0) {
                return null;
            }
            // single selections.
            opts = Object.values(opts)[0];
            return renderSelectSingleWidget(
                'readouts',
                'endpoint',
                opts,
                state.readouts,
                this.handleSelectChange
            );
        }
    }

    render() {
        let state = this.props.stateHolder.state;
        return (
            <div>
                {this._renderAssaySelector(state)}
                {this._renderReadoutSelector(state)}
            </div>
        );
    }
}

ReadoutWidget.propTypes = {
    stateHolder: PropTypes.instanceOf(React.Component).isRequired,
    hideViability: PropTypes.bool.isRequired,
    hideNonViability: PropTypes.bool.isRequired,
    multiAssaySelector: PropTypes.bool.isRequired,
    multiReadoutSelector: PropTypes.bool.isRequired,
    tabName: PropTypes.string.isRequired,
};

export default ReadoutWidget;
