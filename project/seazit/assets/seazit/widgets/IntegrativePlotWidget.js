import React from 'react';
import BaseWidget from './BaseWidget';

import { INTVIZ_DevtoxHEATMAP, INTVIZ_HEATMAP } from '../shared';

class IntegrativePlotWidget extends BaseWidget {
    /*
    IntegrativePlotWidget requires the following state properties:
        - stateHolder.state.visualization is one of the enumerations above
    */

    render() {
        let state = this.props.stateHolder.state;
        return (
            <div>
                <label>Select visual: </label>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="visualization"
                            onChange={this.handleRadioChange}
                            value={INTVIZ_HEATMAP}
                            checked={state.visualization === INTVIZ_HEATMAP}
                        />
                        Heatmap with activity calls
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="visualization"
                            onChange={this.handleRadioChange}
                            value={INTVIZ_DevtoxHEATMAP}
                            checked={state.visualization === INTVIZ_DevtoxHEATMAP}
                        />
                        Devtox heatmap with BMC and selectivity
                    </label>
                </div>

            </div>
        );
    }
}

export default IntegrativePlotWidget;
