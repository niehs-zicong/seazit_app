import React from 'react';

import FiveOhEight from '../components/FiveOhEight';
import HelpButtonWidget from '../widgets/HelpButtonWidget';

class DatasetsMain extends React.Component {
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
                    This page includes tabs that provide tabulated parameters of protocols (Tab
                    name: Protocols), details of test substances (Tab name: Test Substances), the
                    mapping of laboratory specific recording to phenotype ontology terms (Tab name:
                    Phenotype Ontology).
                </p>
                <p>White boxes in each table indicate search boxes.</p>
                <p>Tables are available to download in each tab.</p>
            </div>
        );
    }

    render() {
        return (
            <div className="row row-full-width">
                <div className="col-12">
                    <h1 className="label-horizontal">
                        Data
                        <HelpButtonWidget
                            stateHolder={this}
                            headLevel={'h1'}
                            title={'Click to toggle help-text'}
                        />
                    </h1>
                    {this._renderHelpText()}
                </div>
                <div className="col-12">
                    <FiveOhEight />
                </div>
            </div>
        );
    }
}

export default DatasetsMain;
