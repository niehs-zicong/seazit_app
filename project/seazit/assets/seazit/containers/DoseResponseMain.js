import React from 'react';

import Loading from 'utils/Loading';
import { DoseResponse } from '../components/DoseResponse';
import FiveOhEight from '../components/FiveOhEight';
import HelpButtonWidget from '../widgets/HelpButtonWidget';
import ChemicalWidget from '../widgets/ChemicalWidget';
import ReadoutWidget from '../widgets/ReadoutWidget';
import DoseResponseGridWidget from '../widgets/DoseResponseGridWidget';
import PlotCollapseWidget from '../widgets/PlotCollapseWidget';

import {
    CHEMFILTER_CATEGORY,
    CHEMLIST_80,
    NO_COLLAPSE,
    getDoseResponsesUrl,
    loadMetadata,
    renderNoSelected,
    CHEMFILTER_CHEMICIAL,
    ConcentrationResponseTab,
    integrative_Granular,
} from '../shared';
import styles from '../style.css';

class DoseResponseMain extends React.Component {
    // lifecycle
    constructor(props) {
        super(props);
        // take 75% of the screen width since main body is col-9 size; assume
        // each plot is ~400px for a reasonable start, make sure it's at least 1
        let initialCols = Math.max(1, Math.floor((0.75 * window.innerWidth) / 400));
        this.state = {
            // loadMetadata
            metadataLoaded: false,
            metadata: null,

            // HelpButtonWidget
            showHelpText: false,

            // ChemicalSelectorWidget
            chemList: CHEMLIST_80,
            chemicalFilterBy: CHEMFILTER_CATEGORY,
            // chemicalFilterBy: CHEMFILTER_CHEMICIAL,

            chemicals: [],
            categories: [],
            ontologyType: integrative_Granular,

            // ReadoutSelectorWidget
            assays: [],
            readouts: [],

            // PlotCollapseWidget
            plotCollapse: NO_COLLAPSE,

            // DoseResponseGridWidget
            vizColumns: initialCols,
            vizHeight: 350,
            tabFlag: ConcentrationResponseTab,
        };
    }

    componentWillMount() {
        loadMetadata(this);
    }

    renderNoSelection() {
        return renderNoSelected({
            hasReadouts: this.state.readouts.length > 0,
            hasChems: this.state.chemicals.length > 0,
        });
    }

    renderSelection(url) {
        return (
            <DoseResponse
                cols={this.state.vizColumns}
                collapse={this.state.plotCollapse}
                height={this.state.vizHeight}
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
                <p>helptext zw</p>
                <p>helptext zw</p>
                <p>helptext zw</p>
                <p>helptext zw</p>
                <p>helptext zw</p>
                <p>
                    <i>helptext zw</i>
                </p>
                <p>
                    <i>helptext zw</i>
                </p>
            </div>
        );
    }

    // https://gitlab.niehs.nih.gov/ods/seazit_app.git/';

    render() {
        if (!this.state.metadataLoaded) {
            return <Loading />;
        }
        let url = getDoseResponsesUrl(this.state.assays, this.state.readouts, this.state.chemicals);
        // console.log(url);
        return (
            <div className="row-fluid">
                <div className="col-md-12">
                    <h1 className={styles.labelHorizontal}>
                        Concentration Response
                        <HelpButtonWidget stateHolder={this} headLevel={'h1'} />
                    </h1>
                </div>
                <div className="col-md-12">
                    <FiveOhEight />
                </div>

                <div className="col-md-3">
                    <ReadoutWidget
                        stateHolder={this}
                        hideViability={false}
                        hideNonViability={false}
                        multiAssaySelector={true}
                        multiReadoutSelector={true}
                    />
                    <hr />
                    <ChemicalWidget stateHolder={this} />
                    <hr />
                    <PlotCollapseWidget stateHolder={this} />
                    <hr />
                    <DoseResponseGridWidget stateHolder={this} />
                </div>
                <div className="col-md-9">
                    {this._renderHelpText()}
                    {url ? this.renderSelection(url) : this.renderNoSelection()}
                </div>
            </div>
        );
    }
}

export default DoseResponseMain;
