import React from 'react';
import _ from 'lodash';
import BmdBoxplot from '../components/BmdBoxplot';
import BmdAssayPca from '../components/BmdAssayPca';
import BmdChemicalPca from '../components/BmdChemicalPca';
import FiveOhEight from '../components/FiveOhEight';
import HeatmapHandler from '../components/HeatmapHandler';
import RankedBarchart from '../components/RankedBarchart';

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

class IntegrativeAnalysesMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // loadMetadata
            metadataLoaded: false,
            metadata: null,

            // HelpButtonWidget
            showHelpText: false,

            // ontologyWidget
            ontologyType: integrative_Granular,
            ontologyGroup:[],

            // ChemicalSelectorWidget
            chemicalFilterBy: CHEMFILTER_CATEGORY,
            chemicals: [],
            categories: [],
            // ReadoutTypeWidget
            readoutType: READOUT_TYPE_CATEGORY,

            // ReadoutSelectorWidget
            assays: [],
            readouts: [],

            // ReadoutCategoryWidget
            readoutCategories: [],

            // IntegrativePlotWidget
            visualization: INTVIZ_HEATMAP,

            // HeatmapDisplaySelector
            heatmapDisplay: HEATMAP_ACTIVITY,
            tabFlag: IntegrativeAnalysesTab,

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
        };

    }

    componentWillMount() {
        loadMetadata(this);
        console.log(this.state)

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

    _renderReadoutChemicalSelectors() {
        let widget;
        if (this.state.readoutType === READOUT_TYPE_CATEGORY) {
            widget = <ReadoutCategoryWidget stateHolder={this} />;
        } else {
            widget = (
                <ReadoutWidget
                    stateHolder={this}
                    hideViability={false}
                    hideNonViability={false}
                    multiAssaySelector={true}
                    multiReadoutSelector={true}
                />
            );
        }

        return (
            <div>
                <ReadoutTypeWidget stateHolder={this} />
                {widget}
                <hr />
                <ChemicalWidget stateHolder={this} />
                <hr />
            </div>
        );
    }

    _renderMainBody(url) {
        let hasChems = this.state.chemicals.length > 0,
            hasReadoutCategories = this.state.readoutCategories.length > 0,
            readoutType,
            viz = this.state.visualization,
            requiresFilters = [INTVIZ_HEATMAP, INTVIZ_DevtoxHEATMAP];
        //
        // let filtersRequired =
        //     _.includes(requiresFilters, viz) &&
        //     (!hasChems ||
        //         (readoutType == READOUT_TYPE_READOUT && !hasReadouts) ||
        //             (readoutType == READOUT_TYPE_CATEGORY && !hasReadoutCategories));
        //
        // if (filtersRequired) {
        //     return renderNoSelected({
        //         // hasReadouts: readoutType == READOUT_TYPE_READOUT ? hasReadouts : undefined,
        //         // hasReadoutCategories:
        //         //     readoutType == READOUT_TYPE_CATEGORY ? hasReadoutCategories : undefined,
        //         // hasChems,
        //     });
        // }

        switch (viz) {
            case INTVIZ_HEATMAP: {
                return (
                    <div>
                        <HeatmapHandler
                            casrns={this.state.chemicals}
                            heatmapDisplay={this.state.heatmapDisplay}
                            readouts={this.state.readouts}
                            viz = {this.state.visualization}
                            ontologyType = {this.state.ontologyType}
                            ontologyGroup = {this.state.ontologyGroup}
                            selectivityList={this.state.selectivityList}
                            url={url}
                        />
                        <p className="help-block">
                            <b>Interactivity note:</b> This heatmap is interactive. Click a cell to
                            view individual dose-response curves associated with it.
                        </p>
                    </div>
                );
            }


           case INTVIZ_DevtoxHEATMAP: {
                return (
                    <div>
                        <HeatmapHandler
                            casrns={this.state.chemicals}
                            heatmapDisplay={this.state.heatmapDisplay}
                            readouts={this.state.readouts}
                            viz = {this.state.visualization}
                            ontologyType = {this.state.ontologyType}
                            ontologyGroup = {this.state.ontologyGroup}
                            selectivityList={this.state.selectivityList}
                            url={url}
                        />
                        <p className="help-block">
                            <b>Interactivity note:</b> This heatmap is interactive. Click a cell to
                            view individual dose-response curves associated with it.
                        </p>
                    </div>
                );
            }
            default: {
                throw 'Unknown visualization type';
            }
        }
    }

    render() {
        if (!this.state.metadataLoaded) {
            return <Loading />;
        }

        let isPca = _.includes([INTVIZ_ASSAY_PCA, INTVIZ_CHEMICAL_PCA], this.state.visualization),
            isHeatmap = this.state.visualization === INTVIZ_HEATMAP;
        console.log(this.state)
        // let url = getIntegrativeUrl(this.state.assays, this.state.chemicals, this.state.ontologyType, this.state.ontologyGroup);
        let url = getIntegrativeUrl(this.state.assays, this.state.chemicals);

        // url = '/seazit/api/seazit_result/integrativeResult/?format=json&protocol_ids=2,3,4&readouts=Mortality@24_2,Mortality@120_2,MalformedAny+Mort@120_2,AXIS+Mort@120_2,BRN_+Mort@120_2,CRAN+Mort@120_2,necrosis+Mort@120_3,notochord_defect+Mort@120_3,scoliosis+Mort@120_3,tail_bending+Mort@120_3,Mortality@24_4,Mortality@120_4,MalformedAny+Mort@120_4&casrns=51-52-5,115-86-6,2078-54-8,71751-41-2,56-35-9,36734-19-7,26787-78-0,53-70-3,127-07-1,43121-43-3,108-46-3,84-74-2,95-76-1,5598-15-2,2921-88-2,56-53-1,137-30-4,58-89-9,116-06-3,58-08-2,330-55-2,80-05-7,76738-62-0,298-02-2,99-66-1,69806-50-4,75-07-0,50-35-1,95737-68-1,83-79-4,85509-19-9,13674-87-8,1912-24-9,1069-66-5,50-78-2,79-94-7,129-00-0'
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
                    {this.state.visualization === INTVIZ_DevtoxHEATMAP ?
                        (
                            <div>
                                <OntologyWidget stateHolder={this} />
                                    <hr />
                            </div>
                        ) : null}

                    <ChemicalWidget stateHolder={this} />
                    {/*<hr />*/}
                    {/*<CheckBoxWidget stateHolder={this} />*/}
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
