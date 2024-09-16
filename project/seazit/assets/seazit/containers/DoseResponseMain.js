import React from 'react';

import Loading from 'utils/Loading';
import DoseResponse from '../components/DoseResponse';
import FiveOhEight from '../components/FiveOhEight';
import HelpButtonWidget from '../widgets/HelpButtonWidget';
import ChemicalWidget from '../widgets/ChemicalWidget';
import ReadoutWidget from '../widgets/ReadoutWidget';
import DoseResponseGridWidget from '../widgets/DoseResponseGridWidget';
import PlotCollapseWidget from '../widgets/PlotCollapseWidget';

import {
    CHEMFILTER_CATEGORY,
    CHEMLIST_80,
    COLLAPSE_BY_CHEMICAL,
    COLLAPSE_BY_READOUT,
    COLLAPSE_WITH_Mortality120,
    NO_COLLAPSE,
    getDoseResponsesUrl,
    loadMetadata,
    loadBaseUrl,
    renderNoSelected,
    CHEMFILTER_CHEMICIAL,
    ConcentrationResponseTab,
    integrative_Granular,
} from '../shared';
import _ from 'lodash';

class DoseResponseMain extends React.Component {
    // lifecycle
    constructor(props) {
        super(props);
        let initialCols = Math.max(1, Math.floor((0.75 * window.innerWidth) / 400));
        this.state = {
            metadataLoaded: false,
            metadata: null,
            showHelpText: false,
            chemList: CHEMLIST_80,
            chemicalFilterBy: CHEMFILTER_CATEGORY,
            chemicals: [],
            categories: [],
            ontologyType: integrative_Granular,
            assays: [],
            readouts: [],
            plotCollapse: NO_COLLAPSE,
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
        let title;
        switch (this.state.plotCollapse) {
            case COLLAPSE_BY_READOUT:
                title =
                    'Endpoint: response of all test substances selected per endpoint and dataset';
                break;
            case COLLAPSE_BY_CHEMICAL:
                title =
                    'Test substance: response for all datasets and endpoints selected per substance';
                break;
            case NO_COLLAPSE:
                title =
                    'Test substance + Endpoint: response for each dataset, test substance, and endpoint selected';
                break;
            default:
                title = '';
        }
        return (
            <div className="col-12">
                <h3 className="text-center">{title}</h3>
                <br />
                <DoseResponse
                    cols={this.state.vizColumns}
                    collapse={this.state.plotCollapse}
                    height={this.state.vizHeight}
                    url={url}
                />
            </div>
        );
    }

    _renderHelpText() {
        if (!this.state.showHelpText) {
            return null;
        }
        return (
            <div className="alert alert-info">
                <p>
                    This page allows for the visualization of concentration-response curves. Panels
                    on the left provide the options to select data of user’s interests.
                </p>
                <p>
                    Concentration response curves can be visualized in different ways to focus on
                    (1) a single test substance and endpoint, (2) all endpoints per test substance,
                    and (3) all test substances per endpoint selected. Selection of endpoints will
                    appear after a dataset(s) has been selected since these terms are dataset
                    specific. For figures including a gray dashed horizontal line, this represents
                    the benchmark response (BMR), and is available if one of the
                    concentration-response curves is considered active in the analysis. By mousing
                    over a concentration-response curve, the associated data (plate or endpoint or
                    substance, depending on the view) will appear. Additionally, the benchmark
                    concentration (BMC) will appear if the respective curve is considered active in
                    the analysis. Some selections may result in an overlap of data point or plot.
                </p>
                <p>
                    These concentration response curves have been integrated into other SEAZIT-DIVER
                    tools including the{' '}
                    <a href={loadBaseUrl('/seazit/seazit_integrative/')}>Integrative Analyses</a>{' '}
                    and <a href={loadBaseUrl('/seazit/seazit_bmcByLab/')}>BMC by dataset</a>.
                </p>
                <p>
                    Options for editing or saving charts are provided by toggling over the upper
                    right side of each chart. A maximum of 40 charts can be viewed at once.
                </p>
            </div>
        );
    }

    render() {
        if (!this.state.metadataLoaded) {
            return <Loading />;
        }
        let url = getDoseResponsesUrl(this.state.assays, this.state.readouts, this.state.chemicals);

        return (
            <div className="row row-full-width">
                <div className="col-12">
                    <h1 className="label-horizontal">
                        Concentration Response
                        <HelpButtonWidget
                            stateHolder={this}
                            headLevel={'h1'}
                            title={'Click to toggle help-text'}
                        />
                    </h1>
                </div>
                <div className="col-12">
                    <FiveOhEight />
                </div>

                <div className="col-3">
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
                <div className="col-9">
                    {this._renderHelpText()}
                    {url ? this.renderSelection(url) : this.renderNoSelection()}
                </div>
            </div>
        );
    }
}

export default DoseResponseMain;
