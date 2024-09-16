import React from 'react';
import BaseWidget from './BaseWidget';

import { BMDVIZ_ACTIVITY, BMDVIZ_SELECTIVITY, INTVIZ_HEATMAP } from '../shared';
import HelpButtonWidget from './HelpButtonWidget';

class BmdByLabPlotWidget extends BaseWidget {
    /*
    BmdByLabPlotWidget requires the following state properties:
        - stateHolder.state.visualization is one of the enumerations above
    */
    constructor(props) {
        super(props);

        this.state = {
            showHelpText: false,
        };
        // console.log(this.props);
        // console.log(this.props.stateHolder.state);
    }

    _renderHelpText() {
        if (!this.state.showHelpText) {
            return null;
        }

        return (
            <div className="alert alert-info">
                <p>
                    Activity: the potency value of the benchmark concentration (BMC) of a selected
                    endpoint; lower BMC value represents a more potent effect.
                </p>
                <p>
                    Specificity: the fold change of the BMC values between the mortality endpoint
                    and the selected endpoint. The fold change value is log10-transformed; higher
                    specificity represents a more specific effect of the selected endpoint compared
                    to the mortality effect
                </p>
            </div>
        );
    }

    render() {
        let state = this.props.stateHolder.state;
        return (
            <div>
                <label className="label-horizontal">
                    Select visual:
                    <HelpButtonWidget
                        stateHolder={this}
                        headLevel={'label'}
                        title={'More information on developmental toxicity classifications'}
                    />
                </label>

                {this._renderHelpText()}

                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="visualization"
                            onChange={this.handleRadioChange}
                            value={BMDVIZ_ACTIVITY}
                            checked={state.visualization === BMDVIZ_ACTIVITY}
                        />
                        Activity
                    </label>

                    <span style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>|</span>

                    <label>
                        <input
                            type="radio"
                            name="visualization"
                            onChange={this.handleRadioChange}
                            value={BMDVIZ_SELECTIVITY}
                            checked={state.visualization === BMDVIZ_SELECTIVITY}
                        />
                        Specificity
                    </label>
                </div>
            </div>
        );
    }
}

export default BmdByLabPlotWidget;
