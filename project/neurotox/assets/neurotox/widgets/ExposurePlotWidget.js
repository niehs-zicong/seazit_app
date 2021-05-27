import React from 'react';
import BaseWidget from './BaseWidget';

import { INTVIZ_BOXPLOT, INTVIZ_ASSAY_PCA, INTVIZ_CHEMICAL_PCA, INTVIZ_HEATMAP } from '../shared';

class ExposurePlotWidget extends BaseWidget {
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
                        Heatmap
                    </label>
                </div>
            </div>
        );
    }
}

export default ExposurePlotWidget;
