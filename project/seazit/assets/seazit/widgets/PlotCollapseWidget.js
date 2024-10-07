import $ from '$';
import React from 'react';
import PropTypes from 'prop-types';
import BaseWidget from './BaseWidget';

import { COLLAPSE_BY_CHEMICAL, COLLAPSE_BY_READOUT, NO_COLLAPSE } from '../shared';
import HelpButtonWidget from './HelpButtonWidget';

class PlotCollapseWidget extends BaseWidget {
    constructor(props) {
        super(props);
        this.state = {
            showHelpText: false,
        };
        this.handleCollapseChange = this.handleCollapseChange.bind(this);
    }

    componentDidMount() {
        $(this.refs.buttons)
            .find('[data-toggle="tooltip"]')
            .tooltip();
    }

    handleCollapseChange(e) {
        let d = {};
        if (e.target.value !== NO_COLLAPSE && this.props.stateHolder.state.vizColumns > 2) {
            d.vizColumns = 2;
        }
        d[e.target.name] = e.target.value;
        this.props.stateHolder.setState(d);
    }

    _renderHelpText() {
        if (!this.state.showHelpText) {
            return null;
        }
        return (
            <div className="alert alert-info">
                <p>
                    Chart by Test substance + Endpoint visualizes the response for each dataset,
                    test substance, and endpoint selected. Chart by Test substance combines all
                    datasets and endpoints selected. Chart by Endpoint combines all test substances
                    selected per endpoint and dataset.
                </p>
                <br />
                <p>Hover over each chart line for additional information.</p>
            </div>
        );
    }

    render() {
        let { state } = this.props.stateHolder;
        return (
            <div ref="buttons">
                <label className="label-horizontal">
                    Select chart display:
                    <HelpButtonWidget
                        stateHolder={this}
                        headLevel={'label'}
                        title={'More information on chart displays'}
                    />
                </label>
                {this._renderHelpText()}

                <div className="radio">
                    <label
                        data-toggle="tooltip"
                        data-title="One chart for each chemical + endpoint combination"
                    >
                        <input
                            type="radio"
                            name="plotCollapse"
                            id={NO_COLLAPSE}
                            onChange={this.handleCollapseChange}
                            value={NO_COLLAPSE}
                            checked={state.plotCollapse === NO_COLLAPSE}
                        />
                        Test substance + Endpoint
                    </label>

                    <span style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>|</span>

                    <label
                        htmlFor={COLLAPSE_BY_CHEMICAL}
                        data-toggle="tooltip"
                        data-title="One chart for each chemical (multiple endpoints on chart)"
                    >
                        <input
                            type="radio"
                            name="plotCollapse"
                            id={COLLAPSE_BY_CHEMICAL}
                            onChange={this.handleCollapseChange}
                            value={COLLAPSE_BY_CHEMICAL}
                            checked={state.plotCollapse === COLLAPSE_BY_CHEMICAL}
                        />
                        Test substance
                    </label>

                    <span style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>|</span>

                    <label
                        htmlFor={COLLAPSE_BY_READOUT}
                        data-toggle="tooltip"
                        data-title="One chart for each endpoint (multiple chemicals on chart)"
                    >
                        <input
                            type="radio"
                            name="plotCollapse"
                            id={COLLAPSE_BY_READOUT}
                            onChange={this.handleCollapseChange}
                            value={COLLAPSE_BY_READOUT}
                            checked={state.plotCollapse === COLLAPSE_BY_READOUT}
                        />
                        Endpoint
                    </label>
                </div>
                <p className="form-text">Hover for more details on each option.</p>
            </div>
        );
    }
}

PlotCollapseWidget.propTypes = {
    stateHolder: PropTypes.shape({
        state: PropTypes.shape({
            plotCollapse: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};

export default PlotCollapseWidget;
