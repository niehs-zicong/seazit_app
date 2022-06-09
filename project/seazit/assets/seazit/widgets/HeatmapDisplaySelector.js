import React from 'react';
import BaseWidget from './BaseWidget';

import { HEATMAP_ACTIVITY, HEATMAP_BMC } from '../shared';

class HeatmapDisplaySelector extends BaseWidget {
    /*
    HeatmapDisplaySelector requires the following state properties:
        - stateHolder.state.heatmapDisplay is one of the enumerations above
    */

    render() {
        let state = this.props.stateHolder.state;
        return (
            <div>
                <label>Select heatmap display type: </label>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="heatmapDisplay"
                            onChange={this.handleRadioChange}
                            value={HEATMAP_ACTIVITY}
                            checked={state.heatmapDisplay === HEATMAP_ACTIVITY}
                        />
                        Activity
                    </label>

                    <span style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>|</span>

                    <label>
                        <input
                            type="radio"
                            name="heatmapDisplay"
                            onChange={this.handleRadioChange}
                            value={HEATMAP_BMC}
                            checked={state.heatmapDisplay === HEATMAP_BMC}
                        />
                        BMC
                    </label>
                </div>
            </div>
        );
    }
}

export default HeatmapDisplaySelector;
