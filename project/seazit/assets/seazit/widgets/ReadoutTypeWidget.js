import React from 'react';
import BaseWidget from './BaseWidget';

import { READOUT_TYPE_READOUT, READOUT_TYPE_CATEGORY } from '../shared';

class ReadoutTypeWidget extends BaseWidget {
    /*
    IntegrativePlotWidget requires the following state properties:
        - stateHolder.state.readoutType is one of the enumerations above
    */

    render() {
        let state = this.props.stateHolder.state;
        console.log(state);
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

                    <span style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>|</span>

                    <label>
                        <input
                            type="radio"
                            name="readoutType"
                            onChange={this.handleRadioChange}
                            value={READOUT_TYPE_READOUT}
                            checked={state.readoutType === READOUT_TYPE_READOUT}
                        />
                        by Readout
                    </label>
                </div>
            </div>
        );
    }
}

export default ReadoutTypeWidget;
