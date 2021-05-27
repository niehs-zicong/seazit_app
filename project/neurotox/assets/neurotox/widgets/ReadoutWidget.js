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
        let options = _.chain(state.tbl_readouts)
            .map('protocol__protocol')
            .uniq()
            .map((r) => {
                return {
                    key: r,
                    label: r,
                };
            })
            .sortBy('label')
            .value();

        if (this.props.multiAssaySelector === true) {
            return renderSelectMultiWidget(
                'assays',
                'assay',
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

        let opts = _.chain(state.tbl_readouts)
            .filter((r) => {
                return r.calculate_bmc === true && _.includes(assays, r.protocol__protocol);
            })
            .value();

        if (this.props.hideViability) {
            opts = _.reject(opts, (r) => r.is_viability === true);
        }

        if (this.props.hideNonViability) {
            opts = _.reject(opts, (r) => r.is_viability === false);
        }

        opts = _.chain(opts)
            .map((r) => {
                return {
                    key: r.id.toString(),
                    category: `${r.protocol__provider}: ${r.category}`,
                    label: r.endpoint,
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
            'readout',
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
