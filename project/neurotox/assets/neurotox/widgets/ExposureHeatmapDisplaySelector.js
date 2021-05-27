import React from 'react';
import BaseWidget from './BaseWidget';

import { HEATMAP_BMC, HEATMAP_ACTIVITY } from '../shared';

class ExposureHeatmapDisplaySelector extends BaseWidget {
    /*
    HeatmapDisplaySelector requires the following state properties:
        - stateHolder.state.heatmapDisplay is one of the enumerations above
    */

    render() {
        let state = this.props.stateHolder.state;
        //        console.log(state)
        return (
            <div>
                <label>Select heatmap data display: </label>
                <div className="radio">
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

export default ExposureHeatmapDisplaySelector;
