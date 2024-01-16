import React from 'react';
import BaseWidget from './BaseWidget';

import { BMDVIZ_ACTIVITY, BMDVIZ_SELECTIVITY, INTVIZ_HEATMAP } from '../shared';
import HelpButtonWidget from './HelpButtonWidget';
import styles from '../style.css';

class BmdByLabPlotWidget extends BaseWidget {
    /*
    BmdByLabPlotWidget requires the following state properties:
        - stateHolder.state.visualization is one of the enumerations above
    */
    constructor(props) {
        super(props);

        this.state = {
            showHelpText: false,
        };
        // console.log(this.props);
        // console.log(this.props.stateHolder.state);
    }

    _renderHelpText() {
        if (!this.state.showHelpText) {
            return null;
        }

        return (
            <div className="alert alert-info">
                <p>
                    Activity: the potency value of the benchmark concentration (BMC) of a selected
                    endpoint; lower BMC value represents a more potent effect.
                </p>
                <br />

                <p>
                    Specificity: the fold change of the BMC values between the mortality endpoint
                    and the selected endpoint. The fold change value is log10-transformed; higher
                    specificity represents a more specific effect of the selected endpoint compared
                    to the mortality effect
                </p>
            </div>
        );
        //     if (this.props.stateHolder.state.visualization === BMDVIZ_ACTIVITY) {
        //     return (
        //         <div className="alert alert-info">
        //             <ul>
        //                 <li>
        //                     specific = a test substance produces quantifiable alteration(s) in
        //                     phenotypes at a concentration lower than that which causes overt
        //                     toxicity (i.e., mortality)
        //                 </li>
        //                 <li>
        //                     non-specific = a test substance produces both altered phenotypes and
        //                     mortality at similar concentrations
        //                 </li>
        //                 <li>
        //                     non-toxic = no changes to phenotype or survival occurred at the
        //                     concentrations evaluated
        //                 </li>
        //                 <li>
        //                     inconclusive = specificity couldn’t be determined based on differences
        //                     among plate replicates and requires more testing
        //                 </li>
        //                 <li>
        //                     not evaluated = a phenotype that was not assessed in a particular
        //                     laboratory
        //                 </li>
        //             </ul>
        //         </div>
        //     );
        // } else {
        //     return (
        //         <div className="alert alert-info">
        //             <p>
        //                 Benchmark concentration (BMC) of a selected endpoint is indicative of
        //                 potency; darker shades indicative lower BMC value which is a more potent
        //                 effect. Specificity is the fold change of the BMC values between the
        //                 mortality and a certain altered phenotype. The fold change value is
        //                 log10-transformed; higher specificity represents a more specific phenotypic
        //                 effect compared to mortality. The higher the specificity, the larger the
        //                 circle.
        //             </p>
        //         </div>
        //     );
        // }
    }

    render() {
        let state = this.props.stateHolder.state;
        return (
            <div>
                <label className={styles.labelHorizontal}>
                    Select visual:
                    <HelpButtonWidget
                        stateHolder={this}
                        headLevel={'label'}
                        title={'More information on developmental toxicity classifications'}
                    />
                </label>

                {this._renderHelpText()}

                <div className="radio">
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
