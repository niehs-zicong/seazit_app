import React from 'react';
import BaseWidget from './BaseWidget';

import {
    CHEMFILTER_CATEGORY,
    CHEMFILTER_CHEMICIAL,
    HEATMAP_ACTIVITY,
    integrative_Granular,
    IntegrativeAnalysesTab,
    INTVIZ_DevtoxHEATMAP,
    INTVIZ_HEATMAP,
    READOUT_TYPE_CATEGORY,
    renderSelectMultiOptgroupWidget,
} from '../shared';
import HelpButtonWidget from './HelpButtonWidget';
import _ from 'lodash';
import styles from '../components/graph.css';

class IntegrativePlotWidget extends BaseWidget {
    /*
    IntegrativePlotWidget requires the following state properties:
        - stateHolder.state.visualization is one of the enumerations above
    */
    constructor(props) {
        super(props);
        this.state = {
            // HelpButtonWidget
            showHelpText: false,
            helpButtonContentId: null,
        };
    }

    _renderHelpText() {
        // console.log(this.props.stateHolder.state)
        // console.log(this.state)
        let state = this.props.stateHolder.state;
        let contentId = this.state.helpButtonContentId;
        if (!this.state.showHelpText) {
            return null;
        }
        if (contentId === 'A') {
            return (
                <div className="alert alert-info">
                    <p>
                        Activity calls are the potency value of the benchmark concentration (BMC) of
                        a certain altered phenotype; lower BMC value represents a more potent
                        effect.
                    </p>
                </div>
            );
        } else if (contentId === 'B') {
            return (
                <div className="alert alert-info">
                    <p>
                        Potency value s are determined by the benchmark concentration (BMC).
                        Specificity is the fold change of the BMC values between the mortality and a
                        certain altered phenotype. The fold change value is log10-transformed;
                        higher specificity represents a more specific phenotypic effect compared to
                        mortality.
                    </p>
                </div>
            );
        }
    }

    render() {
        let state = this.props.stateHolder.state;
        return (
            <div>
                <label>Select visual: </label>
                {[
                    {
                        value: INTVIZ_HEATMAP,
                        label: 'Developmental toxicity classification',
                        title: 'Heatmap with activity calls',
                        contentId: 'A',
                    },
                    {
                        value: INTVIZ_DevtoxHEATMAP,
                        label: 'Potency and specificity for developmental toxicity',
                        title: 'Heatmap with BMC and specificity',
                        contentId: 'B',
                    },
                ].map((option) => (
                    <div className={`radio ${styles.labelHorizontal}`} key={option.value}>
                        <label className={styles.labelHorizaontal}>
                            <input
                                type="radio"
                                name="visualization"
                                onChange={this.handleRadioChange}
                                value={option.value}
                                checked={state.visualization === option.value}
                            />
                            {option.label}
                            <HelpButtonWidget
                                stateHolder={this}
                                headLevel={'label'}
                                title={option.title}
                                contentId={option.contentId}
                            />
                        </label>
                    </div>
                ))}
                {this._renderHelpText()}
            </div>
        );
    }
}

export default IntegrativePlotWidget;
