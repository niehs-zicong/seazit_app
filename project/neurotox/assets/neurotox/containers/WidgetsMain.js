import React from 'react';

import Loading from 'utils/Loading';
import BmdWidget from '../widgets/BmdWidget';
import ChemicalWidget from '../widgets/ChemicalWidget';
import ReadoutWidget from '../widgets/ReadoutWidget';
import { BMD_CURVEP, CHEMFILTER_CATEGORY, CHEMLIST_80, loadMetadata } from '../shared';

class WidgetsMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // loadMetadata
            metadataLoaded: false,
            metadata: null,

            // BmdWidget
            bmdType: BMD_CURVEP,

            // ChemicalSelectorWidget
            chemList: CHEMLIST_80,
            chemicalFilterBy: CHEMFILTER_CATEGORY,
            chemicals: [],
            categories: [],

            // ReadoutSelectorWidget
            assays: [],
            readouts: [],
        };
    }

    componentWillMount() {
        loadMetadata(this);
    }

    render() {
        if (!this.state.metadataLoaded) {
            return <Loading />;
        }
        return (
            <div className="row-fluid">
                <div className="col-sm-12">
                    <h1>Widget main</h1>
                </div>
                <div className="col-sm-3">
                    <BmdWidget stateHolder={this} />
                    <hr />
                    <ReadoutWidget
                        stateHolder={this}
                        hideViability={false}
                        hideNonViability={false}
                        multiAssaySelector={true}
                    />
                    <hr />
                    <ChemicalWidget stateHolder={this} />
                </div>
                <div className="col-sm-9">
                    <h2>BMD widget</h2>
                    <pre>this.state.bmdType: {this.state.bmdType}</pre>

                    <h2>Readout widget</h2>
                    <pre>this.state.assays: {this.state.assays.toString()}</pre>
                    <pre>this.state.readouts: {this.state.readouts.toString()}</pre>

                    <h2>Chemical widget</h2>
                    <pre>this.state.chemList: {this.state.chemList}</pre>
                    <pre>this.state.chemicalFilterBy: {this.state.chemicalFilterBy}</pre>
                    <pre>this.state.chemicals: {this.state.chemicals.toString()}</pre>
                    <pre>this.state.categories: {this.state.categories.toString()}</pre>

                    <h2>loadMetadata</h2>
                    <pre>this.state.metadataLoaded: {this.state.metadataLoaded.toString()}</pre>
                    <pre>this.state.tbl_readouts.length: {this.state.tbl_readouts.length}</pre>
                    <pre>this.state.tbl_substances.length: {this.state.tbl_substances.length}</pre>
                </div>
            </div>
        );
    }
}

export default WidgetsMain;
