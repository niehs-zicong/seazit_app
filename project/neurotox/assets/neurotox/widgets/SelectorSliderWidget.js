import React from 'react';
import BaseWidget from './BaseWidget';

class SelectivitySliderWidget extends BaseWidget {
    /*
    SelectivitySliderWidget requires the following state properties:
        - stateHolder.state.selectivityCutoff
    */

    render() {
        let state = this.props.stateHolder.state;
        return (
            <div>
                <label>Selectivity cutoff:</label>
                <input
                    className="form-control"
                    type="range"
                    name="selectivityCutoff"
                    min="0"
                    max="2"
                    step="0.1"
                    onChange={this.handleFloatInputChange}
                    value={state.selectivityCutoff}
                />
                <span>>{state.selectivityCutoff} is selective</span>
            </div>
        );
    }
}

export default SelectivitySliderWidget;
