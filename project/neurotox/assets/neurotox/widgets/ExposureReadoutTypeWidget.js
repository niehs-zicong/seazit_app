import React from 'react';
import BaseWidget from './BaseWidget';

import { READOUT_TYPE_READOUT, READOUT_TYPE_CATEGORY } from '../shared';

class ExposureReadoutTypeWidget extends BaseWidget {
    /*
    IntegrativePlotWidget requires the following state properties:
        - stateHolder.state.readoutType is one of the enumerations above
    */

    render() {
        let state = this.props.stateHolder.state;
        return (
            <div>
                <label>Filter endpoints by:</label>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="readoutType"
                            onChange={this.handleRadioChange}
                            value={READOUT_TYPE_CATEGORY}
                            checked={state.readoutType === READOUT_TYPE_CATEGORY}
                        />
                        by Category
                    </label>
                </div>
            </div>
        );
    }
}

export default ExposureReadoutTypeWidget;
