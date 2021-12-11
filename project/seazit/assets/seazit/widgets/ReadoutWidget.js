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
        console.log('options');

        console.log(options);
        console.log(state.assay);
        if (this.props.multiAssaySelector === true) {
            return renderSelectMultiWidget(
                'assays',
                'Assay/Protocol zw2',
                options,
                state.assays,
                this.handleSelectMultiChange
            );
        } else {
            return renderSelectSingleWidget(
                'assay',
                'Assay/Protocol  zw5',
                options,
                state.assays,
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
        console.log(opts);

        opts = _.chain(opts)
            .map((r) => {
                return {
                    key: r.endpoint_name.toString(),
                    // category: r.protocol_name,
                    category: r.protocol_name_plot,
                    label: r.endpoint_name,

                    protocol_name: r.protocol_name,
                    seazit_protocol_id: r.seazit_protocol_id,
                    study_phase: r.study_phase,
                    test_condition: r.test_condition,
                    protocol_name_long: r.protocol_name_long,
                    protocol_name_plot: r.protocol_name_plot,
                };
            })
            .sortBy('label')
            .sortBy('category')
            .groupBy('category')
            .value();

        if (_.keys(opts).length === 0) {
            return null;
        }
        // console.log("opts")
        // console.log(opts)

        return renderSelectMultiOptgroupWidget(
            'readouts',
            'Readout/Endpoint zw1',
            opts,
            state.readouts,
            this.handleSelectMultiChange
        );
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
};

export default ReadoutWidget;
