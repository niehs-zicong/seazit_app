import React from 'react';
import BaseWidget from './BaseWidget';

import { AXIS_LINEAR, AXIS_LOG10, AXIS_SQRT } from '../shared';

class AxisSelectorWidget extends BaseWidget {
    /*
    AxisSelectorWidget requires the following state properties:
        - stateHolder.state.selectivityCutoff
    */

    render() {
        let state = this.props.stateHolder.state;
        return (
            <div>
                <label>Axis scale:</label>

                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="selectedAxis"
                            onChange={this.handleRadioChange}
                            value={AXIS_LOG10}
                            checked={state.selectedAxis === AXIS_LOG10}
                        />
                        Log10
                    </label>

                    <span style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>|</span>

                    <label>
                        <input
                            type="radio"
                            name="selectedAxis"
                            onChange={this.handleRadioChange}
                            value={AXIS_LINEAR}
                            checked={state.selectedAxis === AXIS_LINEAR}
                        />
                        Linear
                    </label>

                    <span style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>|</span>

                    <label>
                        <input
                            type="radio"
                            name="selectedAxis"
                            onChange={this.handleRadioChange}
                            value={AXIS_SQRT}
                            checked={state.selectedAxis === AXIS_SQRT}
                        />
                        Sqrt
                    </label>
                </div>
            </div>
        );
    }
}

export default AxisSelectorWidget;
