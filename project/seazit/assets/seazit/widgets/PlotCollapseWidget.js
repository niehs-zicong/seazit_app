import $ from '$';
import React from 'react';
import PropTypes from 'prop-types';
import BaseWidget from './BaseWidget';

import { COLLAPSE_BY_CHEMICAL, COLLAPSE_BY_READOUT, NO_COLLAPSE } from '../shared';

class PlotCollapseWidget extends BaseWidget {
    constructor(props) {
        super(props);
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

    render() {
        let { state } = this.props.stateHolder;
        return (
            <div ref="buttons">
                <label>One chart for each: </label>
                <div className="radio">
                    <label
                        data-toggle="tooltip"
                        data-title="One chart for each chemical + readout combination"
                    >
                        <input
                            type="radio"
                            name="plotCollapse"
                            id={NO_COLLAPSE}
                            onChange={this.handleCollapseChange}
                            value={NO_COLLAPSE}
                            checked={state.plotCollapse === NO_COLLAPSE}
                        />
                        Chemical + Readout
                    </label>

                    <span style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>|</span>

                    <label
                        htmlFor={COLLAPSE_BY_CHEMICAL}
                        data-toggle="tooltip"
                        data-title="One chart for each chemical (multiple readouts on chart)"
                    >
                        <input
                            type="radio"
                            name="plotCollapse"
                            id={COLLAPSE_BY_CHEMICAL}
                            onChange={this.handleCollapseChange}
                            value={COLLAPSE_BY_CHEMICAL}
                            checked={state.plotCollapse === COLLAPSE_BY_CHEMICAL}
                        />
                        Chemical
                    </label>

                    <span style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>|</span>

                    <label
                        htmlFor={COLLAPSE_BY_READOUT}
                        data-toggle="tooltip"
                        data-title="One chart for each readout (multiple chemicals on chart)"
                    >
                        <input
                            type="radio"
                            name="plotCollapse"
                            id={COLLAPSE_BY_READOUT}
                            onChange={this.handleCollapseChange}
                            value={COLLAPSE_BY_READOUT}
                            checked={state.plotCollapse === COLLAPSE_BY_READOUT}
                        />
                        Readout
                    </label>
                </div>
                <p className="help-block">Hover for more details on each option.</p>
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
