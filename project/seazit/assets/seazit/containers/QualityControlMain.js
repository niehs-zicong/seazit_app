import React from 'react';

import FiveOhEight from '../components/FiveOhEight';
import HelpButtonWidget from '../widgets/HelpButtonWidget';
import styles from '../style.css';

class QualityControlMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // HelpButtonWidget
            showHelpText: false,
        };
    }

    _renderHelpText() {
        if (!this.state.showHelpText) {
            return null;
        }
        return (
            <div className="alert alert-info">
                <p>
                    The page allows for data comparison of vehicle control (VC), positive control
                    (PC, add in chemical name), and duplicated test substances (aldicarb, bisphenol
                    A, and valproic acid) across datasets. Particularly, the data from the three
                    endpoints are compared:
                </p>
                {/*<ol>*/}
                <ol style={{ paddingLeft: '40px' }}>
                    <li>
                        MalformedAny+Mort@120 (i.e., percent of affected embryo [the embryo is
                        either dead or with altered phenotypes] at 120 hour-post-fertilization
                        (hpf))
                    </li>
                    <li>Mortality@120 (i.e., percent of dead embryos at 120 hpf)</li>
                    <li>Mortality@24 (i.e., percent of dead embryos at 24 hpf)</li>
                </ol>
                <p>
                    Dataset information can be viewed and downloaded in tabular form underneath each
                    figure. Tabular results can be resorted by selecting any of the table headings.
                    White blank boxes indicate search boxes.
                </p>
                <p>
                    Options for editing or saving images are provided by hovering over the upper
                    right side of each image.
                </p>
            </div>
        );
    }

    render() {
        return (
            <div className="row-fluid">
                <div className="col-md-12">
                    <h1 className={styles.labelHorizontal}>
                        Quality Check
                        <HelpButtonWidget
                            stateHolder={this}
                            headLevel={'h1'}
                            title={'Click to toggle help-text'}
                        />
                    </h1>
                    {this._renderHelpText()}
                </div>
                <div className="col-md-12">
                    <FiveOhEight />
                </div>
            </div>
        );
    }
}

export default QualityControlMain;
