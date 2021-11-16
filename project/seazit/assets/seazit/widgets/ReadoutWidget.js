import $ from '$';
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import BaseWidget from './BaseWidget';

import { renderSelectMultiWidget, renderSelectMultiOptgroupWidget } from '../shared';

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
                    protocol_name: r.protocol_name,
                    protocol_source: r.protocol_source,
                    seazit_protocol_id: r.seazit_protocol_id,
                    key: r.seazit_protocol_id,
                    label: r.protocol_name,
                };
            })
            .sortBy('seazit_protocol_id')
            .value();
        if (this.props.multiAssaySelector === true) {
            return renderSelectMultiWidget(
                'assays',
                'Assay / Protocol zw1',
                options,
                state.assays,
                this.handleSelectMultiChange
            );
        } else {
            return (
                <div>
                    <label>Select an assay:</label>
                    <select
                        name="assay"
                        className="form-control"
                        onChange={this.handleSelectChange}
                        size="11"
                        value={state.assay}
                    >
                        {_.map(options, (d) => (
                            <option key={d.key} value={d.key}>
                                {d.label}state.assay
                            </option>
                        ))}
                    </select>
                </div>
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

        opts = _.chain(opts)
            .map((r) => {
                return {
                    key: r.endpoint_name.toString(),
                    category: r.protocol_name,
                    label: r.endpoint_name,
                };
            })
            .sortBy('label')
            .sortBy('category')
            .groupBy('category')
            .value();

        if (_.keys(opts).length === 0) {
            return null;
        }

        return renderSelectMultiOptgroupWidget(
            'readouts',
            'Readout Endpoint zw2',
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
