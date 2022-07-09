import React from 'react';
import _ from 'lodash';
import BmdBoxplot from '../components/BmdBoxplot';
import BmdAssayPca from '../components/BmdAssayPca';
import BmdChemicalPca from '../components/BmdChemicalPca';
import FiveOhEight from '../components/FiveOhEight';
import RankedBarchart from '../components/RankedBarchart';
import IntegrativePlotHandler from '../components/IntegrativePlotHandler';

import Loading from 'utils/Loading';
import HeatmapDisplaySelector from '../widgets/HeatmapDisplaySelector';
import HelpButtonWidget from '../widgets/HelpButtonWidget';
import IntegrativePlotWidget from '../widgets/IntegrativePlotWidget';
import BmdWidget from '../widgets/BmdWidget';
import ChemicalWidget from '../widgets/ChemicalWidget';
import OntologyWidget from '../widgets/OntologyWidget';

import ReadoutWidget from '../widgets/ReadoutWidget';
import ReadoutCategoryWidget from '../widgets/ReadoutCategoryWidget';
import ReadoutTypeWidget from '../widgets/ReadoutTypeWidget';
import CheckBoxWidget from "../widgets/CheckBoxWidget";

import {
    HEATMAP_ACTIVITY,
    INTVIZ_DevtoxHEATMAP,
    INTVIZ_ASSAY_PCA,
    INTVIZ_CHEMICAL_PCA,
    INTVIZ_HEATMAP,
    CHEMFILTER_CATEGORY,
    READOUT_TYPE_CATEGORY,
    READOUT_TYPE_READOUT,
    IntegrativeAnalysesTab,
    integrative_Granular,
    integrative_General,
    loadMetadata,
    renderNoSelected,
    getIntegrativeUrl,
} from '../shared';
import PropTypes from "prop-types";


class IntegrativeAnalysesMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // loadMetadata
            metadataLoaded: false,
            metadata: null,

            // HelpButtonWidget
            showHelpText: false,
            assays: [],

            // ontologyWidget
            ontologyType: integrative_Granular,
            ontologyGroup:[],

            // ChemicalSelectorWidget
            chemicalFilterBy: CHEMFILTER_CATEGORY,
            chemicals: [],
            categories: [],

            // ReadoutSelectorWidget
            readoutType: READOUT_TYPE_CATEGORY,

            readouts: [],

            // IntegrativePlotWidget
            visualization: INTVIZ_HEATMAP,

            // HeatmapDisplaySelector
            heatmapDisplay: HEATMAP_ACTIVITY,
            tabFlag: IntegrativeAnalysesTab,

        };

    }

    componentWillMount() {
        loadMetadata(this);
    }

    _renderHelpText() {
        if (!this.state.showHelpText) {
            return null;
        }
        return (
            <div className="alert alert-info">
                <h2>Help text</h2>
                <p>
                    zw
                </p>
                <p>
                    zw_renderReadoutChemicalSelectors

                </p>
                <p>
                                        zw

                </p>
                <p>
                    <b>Visualization options:</b>
                </p>
                <ol>
                    <li>
                        <b>Heatmap:</b> For comparisons of readout or endpoint-category via activity
                        or BMC; the most sensitive (i.e., lowest BMC) is presented where multiple
                        BMCs are available. Selection of ‘activity’ presents the activity result as
                        a binary output (active or inactive). Selection of ‘BMC’ will present the
                        activity results based on the BMC value. Clicking on individual cells shows
                        the user the concentration-response curve. By clicking on the row or column
                        label, the concentration-response curves for an entire row/column are
                        displayed.
                    </li>
                    <li>
                        <b>XXX:</b>
                    </li>
                </ol>
                <p>
                    <i>
                        Disclaimer: The use of two different methods of analysis will be reflected
                        as different benchmark concentrations
                    </i>
                </p>
                <p>
                    <i>
                        Options for editing or saving images are provided by toggling over the upper
                        right side of each image. If the edit/save toolbar is not available, it was
                        a custom visualization created specifically for this application. Please
                        take a screenshot to save, or if you need a higher resolution image, please
                        contact us.
                    </i>
                </p>
            </div>
        );
    }



    _renderMainBody(url) {
        // let hasChems = this.state.chemicals.length > 0,
        //     hasReadoutCategories = this.state.readoutCategories.length > 0,
        //     requiresFilters = [INTVIZ_HEATMAP, INTVIZ_DevtoxHEATMAP];
            return (
                    <div>
                        <IntegrativePlotHandler
                            assay = {this.state.assays}
                            casrns={this.state.chemicals}
                            visualization={this.state.visualization}
                            ontologyType={this.state.ontologyType}
                            ontologyGroup={this.state.ontologyGroup}
                            url={url}
                        />
                        <p className="help-block">
                            <b>Interactivity note:</b> This heatmap is interactive. Click a cell to
                            view individual dose-response curves associated with it.
                        </p>
                    </div>
            );
    }

    render() {
        if (!this.state.metadataLoaded) {
            return <Loading />;
        }

        console.log(this.state)
        // let url = getIntegrativeUrl(this.state.assays, this.state.chemicals, this.state.ontologyType, this.state.ontologyGroup);
        // let url = getIntegrativeUrl(this.state.assays, this.state.chemicals);
        // let url = "/seazit/api/seazit_result/integrativeResult/?format=json&protocol_ids=1&casrns=95-76-1"
        // let url = "/seazit/api/seazit_result/integrativeResult/?format=json&protocol_ids=1,2&casrns=95-76-1"
        let url = "/seazit/api/seazit_result/integrativeResult/?format=json&protocol_ids=1,2&casrns=95-76-1,56-35-9"


        console.log("url")
        console.log(url)
        return (
            <div className="row-fluid">
                <div className="col-md-12">
                    <h1>
                        Integrative analyses
                        <HelpButtonWidget stateHolder={this} />
                    </h1>
                </div>
                <div className="col-md-12">
                    <FiveOhEight />
                </div>
                <div className="col-md-3">
                    <IntegrativePlotWidget stateHolder={this} />
                    <hr />
                    <ReadoutWidget
                        stateHolder={this}
                        hideViability={false}
                        hideNonViability={false}
                        multiAssaySelector={true}
                        multiReadoutSelector={true}
                    />
                    <hr />
                    <div>
                        <OntologyWidget stateHolder={this} />
                            <hr />
                    </div>
                    <ChemicalWidget stateHolder={this} />
                </div>

                <div className="col-md-9">
                    {this._renderHelpText()}
                    {this._renderMainBody(url)}
                </div>

            </div>
        );
    }
}

export default IntegrativeAnalysesMain;
