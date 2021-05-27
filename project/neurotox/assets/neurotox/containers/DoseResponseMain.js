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
    NO_COLLAPSE,
    getDoseResponsesUrl,
    loadMetadata,
    renderNoSelected,
} from '../shared';

class DoseResponseMain extends React.Component {
    // lifecycle
    constructor(props) {
        super(props);
        // take 75% of the screen width since main body is col-9 size; assume
        // each plot is ~400px for a reasonable start, make sure it's at least 1
        let initialCols = Math.max(1, Math.floor(0.75 * window.innerWidth / 400));

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

            // ReadoutSelectorWidget
            assays: [],
            readouts: [],

            // PlotCollapseWidget
            plotCollapse: NO_COLLAPSE,

            // DoseResponseGridWidget
            vizColumns: initialCols,
            vizHeight: 350,
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
        // console.log('renderSelection this.state')
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
                <h2>Help text</h2>
                <p>
                    This page allows for the visualization of chemical-specific concentration
                    response curves. Filters on the left allow for visualization by lab (select
                    assays), endpoint (select readout), chemical list, chemical categories, and
                    individual chemicals.{' '}
                    <b>A maximum of 40 dose-response curves can be viewed at once.</b> Visuals can
                    be edited by in a number of ways in with options provided in the lower left hand
                    corner. Graphs can be viewed by Chemical+Readout, Chemical, or Readout. Graphs
                    can also be adjusted using the Number of Columns and Image Height.
                </p>
                <p>
                    The chemical specific response (y-axis) data points are plotted (green dots) for
                    each concentration tested (x-axis; µM). Based on DMSO variability in each
                    endpoint, a threshold (i.e., benchmark response = BMR) was calculated and can be
                    visualized by the gray dotted line.
                </p>
                <p>
                    The intersect of the BMR with the model fit (Hill, CurveP) can be used to obtain
                    a benchmark concentration (BMC); values are shown at the bottom-right of each
                    plot. The BMC value indicates the concentration at which a chemical is
                    considered active above the inherent noise of each assay. If a BMR line is not
                    visualized, this is an indication that the effect of that responses of the
                    chemical did not reach the BMR threshold.
                </p>
                <p>
                    Hill Model: Implemented using the&nbsp;
                    <a href="https://doi.org/10.1093/bioinformatics/btw680">tcplR</a> package. The
                    Hill model is used by, among others, the US EPA’s ToxCast program (the
                    developers of the package) and the Tox21 community for fitting continuous data.
                </p>
                <p>
                    CurveP: Noise filtering algorithm designed for high-throughput screening data.
                    The program is used in NTP’s Tox21 program. The R package can be downloaded
                    from&nbsp;
                    <a href="https://github.com/moggces/Rcurvep">
                        https://github.com/moggces/Rcurvep
                    </a>
                    .
                </p>
                <p>
                    <i>
                        Disclaimer: The use of two different methods of analysis will be reflected
                        as different benchmark concentrations.
                    </i>
                </p>
                <p>
                    <i>
                        Options for editing or saving images are provided by toggling over the upper
                        right side of each image.
                    </i>
                </p>
            </div>
        );
    }

    render() {
        if (!this.state.metadataLoaded) {
            return <Loading />;
        }
        // console.log('this.state.readouts')
        // console.log(this.state.readouts)
        // console.log('this.state.chemicals')
        // console.log(this.state.chemicals)
        let url = getDoseResponsesUrl(this.state.readouts, this.state.chemicals);

        return (
            <div className="row-fluid">
                <div className="col-md-12">
                    <h1>
                        Concentration response
                        <HelpButtonWidget stateHolder={this} />
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
