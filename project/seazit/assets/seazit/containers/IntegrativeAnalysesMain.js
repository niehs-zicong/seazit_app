import React from 'react';
import Modal from 'react-modal';
import _ from 'lodash';
import BmdBoxplot from '../components/BmdBoxplot';
import BmdAssayPca from '../components/BmdAssayPca';
import BmdChemicalPca from '../components/BmdChemicalPca';
import FiveOhEight from '../components/FiveOhEight';
import RankedBarchart from '../components/RankedBarchart';
import HeatmapHandler from '../components/HeatmapHandler';

import Loading from 'utils/Loading';
import HeatmapDisplaySelector from '../widgets/HeatmapDisplaySelector';
import HelpButtonWidget from '../widgets/HelpButtonWidget';
import IntegrativePlotWidget from '../widgets/IntegrativePlotWidget';
import BmdWidget from '../widgets/BmdWidget';
import ChemicalWidget from '../widgets/ChemicalWidget';
import OntologyWidget from '../widgets/OntologyWidget';
import OntologyTypeWidget from '../widgets/OntologyTypeWidget';

import ReadoutWidget from '../widgets/ReadoutWidget';

import {
    HEATMAP_ACTIVITY,
    INTVIZ_DevtoxHEATMAP,
    INTVIZ_ASSAY_PCA,
    INTVIZ_CHEMICAL_PCA,
    INTVIZ_HEATMAP,
    CHEMFILTER_CATEGORY,
    CHEMFILTER_CHEMICIAL,
    READOUT_TYPE_CATEGORY,
    READOUT_TYPE_READOUT,
    IntegrativeAnalysesTab,
    integrative_Granular,
    integrative_General,
    loadMetadata,
    loadBaseUrl,
    renderNoSelected,
    getIntegrativeUrl,
} from '../shared';
import PropTypes from 'prop-types';
import BmdCheckBoxWidget from '../widgets/BmdCheckBoxWidget';

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
            // assays:['1', '2'],

            labDataset: [],
            url: null,
            // ontologyWidget
            ontologyType: integrative_General,
            // ontologyType: integrative_Granular,

            ontologyGroup: [],

            // ChemicalSelectorWidget
            chemicalFilterBy: CHEMFILTER_CATEGORY,
            // chemicalFilterBy: CHEMFILTER_CHEMICIAL,

            chemicals: [],
            // chemicals: ['115-86-6', '13674-87-8', '79-94-7'],

            // ReadoutSelectorWidget
            readoutType: READOUT_TYPE_CATEGORY,

            readouts: [],

            // mortalityCheck: false,

            // IntegrativePlotWidget
            visualization: INTVIZ_HEATMAP,
            // visualization: INTVIZ_DevtoxHEATMAP,

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
                <p>
                    This page allows for the cross-dataset comparison of developmental toxicity
                    results determined by alteration of zebrafish larva phenotypes after test
                    substance exposure.
                </p>
                <br />

                <p>
                    The developmental toxicity results include three main elements: test substance
                    classification, activity, and specificity related to the associated
                    developmental phenotype group.
                </p>
                <br />

                <p>
                    Multiple features can be selected at once. Once the user has selected at least
                    one item within each feature, interactive heatmaps will appear if data are
                    available. More information on each dataset can be viewed on the{' '}
                    {/*<a href="https://ods.ntp.niehs.nih.gov/seazit/dataset/">*/}
                    <a href={loadBaseUrl('/seazit/dataset/')}>
                        {/*<a href={this.state.dynamicUrl + "/seazit/dataset/"}>*/}
                        Datasets tool page
                    </a>
                    .
                </p>
                <br />

                <p>
                    Options for editing or saving images are provided by toggling over the upper
                    right side of each image. If the edit/save toolbar is not available, it was a
                    custom visualization created specifically for this application. Please take a
                    screenshot to save, or if you need a higher resolution image, please contact us.
                </p>
                <br />

                <p>
                    <i>
                        Disclaimer: The use of two different methods of analysis will be reflected
                        as different benchmark concentrations.”
                    </i>
                </p>
            </div>
        );
    }

    _renderMainBody() {
        // console.log(this.state.ontologyType);
        // console.log(this.state.ontologyGroup);

        return (
            <div>
                <HeatmapHandler
                    assays={this.state.assays}
                    casrns={this.state.chemicals}
                    visualization={this.state.visualization}
                    ontologyType={this.state.ontologyType}
                    ontologyGroup={this.state.ontologyGroup}
                    url={this.state.url}
                    labDataset={this.state.labDataset}
                />

                {/*// for test use. */}

                {/*<HeatmapHandler*/}
                {/*    assays={['1']}*/}
                {/*    casrns={['115-86-6', '13674-87-8','79-94-7','87-86-5','53-70-3','3380-34-5']}*/}
                {/*    visualization={1}*/}
                {/*                        ontologyType={this.state.ontologyType}*/}
                {/*    ontologyGroup={['hatching defect', 'head defects', 'fin defects', 'heart defects', 'arrested heart contraction', 'torso defects', 'abnormal pigmentation', 'swim bladder defect', 'yolk defects']}*/}
                {/*    url={*/}
                {/*        '/seazit/api/seazit_result/integrativeResult/?format=json&protocol_ids=1&casrns=115-86-6,13674-87-8,79-94-7,87-86-5,53-70-3,3380-34-5'*/}
                {/*    }*/}
                {/*    labDataset={[*/}
                {/*        {*/}
                {/*            "protocol_name": "SEAZIT_DRF_BIOBIDE_R-C",*/}
                {/*            "protocol_type": "DRF",*/}
                {/*            "protocol_source": "biobide",*/}
                {/*            "seazit_protocol_id": 1,*/}
                {/*            "lab_anonymous_code": "Lab A",*/}
                {/*            "study_phase": "Dose Range Finding",*/}
                {/*            "test_condition": "Static Renewal-Chorion (SR-C)",*/}
                {/*            "protocol_name_long": "Dose Range Finding study, Lab A, Static Renewal-Chorion (SR-C)",*/}
                {/*            "protocol_name_plot": "DRF_Lab A_SR-C"*/}
                {/*        }*/}
                {/*    ]}*/}
                {/*/>*/}

                <p className=" form-text">
                    <b>Interactivity note:</b> This heatmap is interactive. Click a cell to view
                    individual concentration response curves associated with it. Select x-axis label
                    to learn more about selected phenotype.
                </p>
            </div>
        );
    }

    render() {
        if (!this.state.metadataLoaded) {
            return <Loading />;
        }
        this.state.labDataset = _.chain(this.state.protocol_data)
            .filter((i) => this.state.assays.includes(i.seazit_protocol_id.toString()))
            // .map('protocol_name_plot')
            .value();
        this.state.url = getIntegrativeUrl(this.state.assays, this.state.chemicals);
        //heatmap test
        return (
            <div className="d-flex flex-wrap mx-5 my-3">
                <div className="col-12">
                    <div className="d-flex align-items-center">
                        <h1 className="label-horizontal">
                            <img
                                src="/static_seazit/img/seazit/logo-5.png"
                                alt="Logo"
                                className="img-fluid"
                                style={{ marginRight: '10px', height: '50px' }}
                            />
                            Integrative Analyses
                            <HelpButtonWidget
                                stateHolder={this}
                                headLevel={'h1'}
                                title={'Click to toggle help-text'}
                            />
                        </h1>
                    </div>
                </div>

                <div className="col-12">
                    <FiveOhEight />
                </div>
                <div className="col-3 pe-3">
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

                <div className="col-9">
                    {this._renderHelpText()}
                    {this._renderMainBody()}
                </div>
            </div>
        );
    }
}

export default IntegrativeAnalysesMain;
