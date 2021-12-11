import React from 'react';
import BaseWidget from './BaseWidget';

import { BMD_CURVEP, BMD_HILL } from '../shared';

class BmdWidget extends BaseWidget {
    /*
    BmdWidget requires the following state properties:
        - stateHolder.state.bmdType is one of the enumerations above
    */

    render() {
        let state = this.props.stateHolder.state;
        return (
            <div>
                <label>Select BMC model:</label>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="bmdType"
                            onChange={this.handleRadioChange}
                            value={BMD_HILL}
                            checked={state.bmdType === BMD_HILL}
                        />
                        Hill
                    </label>

                    <span style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>|</span>

                    <label>
                        <input
                            type="radio"
                            name="bmdType"
                            onChange={this.handleRadioChange}
                            value={BMD_CURVEP}
                            checked={state.bmdType === BMD_CURVEP}
                        />
                        CurveP
                    </label>
                </div>
            </div>
        );
    }
}

export default BmdWidget;
