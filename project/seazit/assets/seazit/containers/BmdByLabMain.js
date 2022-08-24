import React from 'react';

import Loading from 'utils/Loading';
import FiveOhEight from '../components/FiveOhEight';
import HelpButtonWidget from '../widgets/HelpButtonWidget';
import BmdByLabPlotWidget from '../widgets/BmdByLabPlotWidget';
// import BmdWidget from '../widgets/BmdWidget';
import ReadoutWidget from '../widgets/ReadoutWidget';
import SelectorSliderWidget from '../widgets/SelectorSliderWidget';
import BmdCheckBoxWidget from "../widgets/BmdCheckBoxWidget";

// import AxisSelectorWidget from '../widgets/AxisSelectorWidget';
import RankedBarchartHandler from '../components/RankedBarchartHandler';

import {
    getBmdsUrl,
    AXIS_LOG10,
    BMD_HILL,
    CHEMFILTER_CATEGORY,
    CHEMLIST_80,
    BMDVIZ_ACTIVITY,
    BMDVIZ_SELECTIVITY,
    loadMetadata,
    renderNoSelected,
    BMCTab,
} from '../shared';

class BmdByLabMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // loadMetadata
            metadataLoaded: false,
            metadata: null,

            // HelpButtonWidget
            showHelpText: false,

            // ChemicalSelectorWidget
            chemList: CHEMLIST_80,
            chemicalFilterBy: CHEMFILTER_CATEGORY,
            chemicals: [],
            categories: [],

            // SelectorSliderWidget
            selectivityCutoff: 0.5,
                        // BmdCheckBoxWidget
            selectivityList: [
                {
                    id: 1,
                    name: "dev tox",
                    isChecked: true,
                },
                {
                    id: 2,
                    name: "general tox",
                    isChecked: false,

                },
                {
                    id: 3,
                    name: "inconclusive",
                    isChecked: false,
                },
                {
                    id: 4,
                    name: "inactive",
                    isChecked: false,
                }
            ],

            // AxisSelectorWidget
            selectedAxis: AXIS_LOG10,

            // ReadoutSelectorWidget
            assay: [],
            readouts: [],

            visualization: BMDVIZ_ACTIVITY,
            tabFlag: BMCTab,
        };
    }

    componentWillMount() {
        loadMetadata(this);
    }

    renderNoSelection() {
        return renderNoSelected({
            hasAssay: this.state.assay.length > 0,
            hasReadouts: this.state.readouts.length > 0,
        });
    }

    renderSelection(url) {
        return (
            <RankedBarchartHandler
                visualization={this.state.visualization}
                selectivityCutoff={this.state.selectivityCutoff}
                selectivityList={this.state.selectivityList}
                selectedAxis={this.state.selectedAxis}
                url={url}
            />
        );
    }
    _renderHelpText() {
        if (!this.state.showHelpText) {
            return null;
        }
        return (
            <div className="alert alert-info">
                <h2>Help text</h2>
                <p>
                    This page allows for each investigator to see how the chemicals rank by activity
                    in two ways:
                    <ul>
                        <li>
                            <b>Activity:</b> any chemical where a BMC can be calculated for any
                            effect, or
                        </li>
                        <li>
                            <b>Selectivity:</b> a neuro or developmental specific effect occurring
                            in the absence of general toxicity (i.e., mortality or loss of cell
                            viability).
                        </li>
                    </ul>
                </p>
                <p>zw</p>
                <p>
                    When <b>Activity</b> is selected:
                </p>
                <p style={{ paddingLeft: '1em' }}>zw</p>
                <p>
                    When <b>Selectivity</b> is selected:
                </p>
                <p style={{ paddingLeft: '1em' }}>zw</p>
                <p>
                    <i>
                        Disclaimer: The use of two different methods of analysis will be reflected
                        as different benchmark concentrations
                    </i>
                </p>
                <p>
                    <i>zw</i>
                </p>
            </div>
        );
    }

    render() {
        if (!this.state.metadataLoaded) {
            return <Loading />;
        }
        // console.log(this.state);
        let url = getBmdsUrl(this.state.assay, this.state.readouts);

        return (
            <div className="row-fluid">
                <div className="col-md-12">
                    <h1>
                        Benchmark concentration (BMC) summary by lab
                        <HelpButtonWidget stateHolder={this} />
                    </h1>
                </div>
                <div className="col-md-12">
                    <FiveOhEight />
                </div>
                <div className="col-md-3">
                    <ReadoutWidget
                        stateHolder={this}
                        hideViability={true}
                        hideNonViability={false}
                        multiAssaySelector={false}
                        multiReadoutSelector={false}
                    />
                    <hr />
                    <BmdByLabPlotWidget stateHolder={this} />
                    {/*{this.state.visualization === BMDVIZ_SELECTIVITY ? (*/}
                    {/*    <SelectorSliderWidget stateHolder={this} />*/}
                    {/*) : null}*/}
                    {this.state.visualization === BMDVIZ_SELECTIVITY ? (
                        <BmdCheckBoxWidget stateHolder={this} />
                    ) : null}
                </div>
                <div className="col-md-9">
                    {this._renderHelpText()}
                    {url ? this.renderSelection(url) : this.renderNoSelection()}
                </div>
            </div>
        );
    }
}

export default BmdByLabMain;
