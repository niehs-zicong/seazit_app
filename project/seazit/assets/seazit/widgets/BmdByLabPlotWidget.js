import React from 'react';
import BaseWidget from './BaseWidget';

import { BMDVIZ_ACTIVITY, BMDVIZ_SELECTIVITY } from '../shared';

class BmdByLabPlotWidget extends BaseWidget {
    /*
    BmdByLabPlotWidget requires the following state properties:
        - stateHolder.state.visualization is one of the enumerations above
    */

    render() {
        let state = this.props.stateHolder.state;
        return (
            <div>
                <label>Select visual: </label>
                <div className="radio">
                {/*<div >*/}
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
