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
import ReadoutWidget from '../widgets/ReadoutWidget';
import ReadoutCategoryWidget from '../widgets/ReadoutCategoryWidget';
import ReadoutTypeWidget from '../widgets/ReadoutTypeWidget';

import {
    BMD_HILL,
    HEATMAP_ACTIVITY,
    INTVIZ_BOXPLOT,
    INTVIZ_ASSAY_PCA,
    INTVIZ_CHEMICAL_PCA,
    INTVIZ_HEATMAP,
    CHEMFILTER_CATEGORY,
    CHEMLIST_80,
    READOUT_TYPE_CATEGORY,
    READOUT_TYPE_READOUT,
    loadMetadata,
    renderNoSelected,
    svg_download_form,
} from '../shared';

let BMD_CW = {
    1: 'curvep',
    2: 'hill',
};

class IntegrativeAnalysesMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // loadMetadata
            metadataLoaded: false,
            metadata: null,

            // HelpButtonWidget
            showHelpText: false,

            // BmdWidget
            bmdType: BMD_HILL,

            // ChemicalSelectorWidget
            chemList: CHEMLIST_80,
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
                    This page allows for the comparison of assays and endpoints across a common
                    benchmark concentration (BMC) metric. On this page, <i>in vitro</i> and
                    alternate animal assays can be compared across each other. BMCs have been
                    calculated for the relevant neuro or developmental endpoints for the assays as
                    well as for general toxicity (i.e., mortality or loss of cell viability). Users
                    can select their visualization of choice (heatmaps, boxplots, or PCA plots) by
                    clicking on the appropriate option on the left panel.
                </p>
                <p>
                    Endpoints can be compared using two options: a) filtering by individual{' '}
                    <b>readouts</b>, or b) filtering by related <b>endpoint categories</b>.{' '}
                    <i>
                        When filtering by endpoint-category, related readouts are collapsed into one
                        endpoint-category, and the most sensitive BMC is displayed.
                    </i>
                </p>
                <p>
                    The user can choose to either view the performance of an individual chemical or
                    a chemical category across multiple assays using either the Hill or CurveP
                    methods.
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
                        <b>Boxplot:</b> Each boxplot represents all BMCs for a given readout or
                        endpoint category, and all selected chemicals. The box in the boxplot
                        highlights the median (solid line), 25th, and 75th percentiles. Upper and
                        lower tails are the 5th and 95th percentile. The mean is shown as a dotted
                        line within each box.
                    </li>
                    <li>
                        <b>Principal Component Analysis (Assay):</b> A 3D scatterplot where each
                        point represents an individual readout. The color of each readout is the
                        assay provider. The location of each point represents how each readout
                        compares to other readouts in chemical space. Readouts which appear close
                        share a greater similarity in BMC patterns (based on either Hill or CurveP
                        method) than those further apart. Three components (X, Y, and Z dimensions)
                        were used to compress the 100+ chemicals into dimensions that can be
                        plotted. Fraction of overall variance in the data is shown in parenthesis
                        for each dimension. You can click on the graphic and move it around for
                        different angles to aide in data visualization. Clicking on each point
                        generates information about each endpoint or readout. You can also click on
                        each laboratory (in the Key on the right of the screen) to include or
                        exclude data.
                    </li>
                    <li>
                        <b>Principal Component Analysis (Chemical):</b> A 3D scatterplot where each
                        point represents an individual chemical. The color of each chemical is the
                        chemical category and results are interpreted similarly to that described
                        above for the PCA by Assay. Three components (X, Y, and Z dimensions) were
                        used to compress the 92 readouts in which BMC could be calculated into
                        dimensions that can be plotted. You can click on the graphic and move it
                        around for different angles to aide in data visualization. Clicking on each
                        point provides each chemical name and additional information. You can also
                        click on each chemical class (in the Key on the right of the screen) to
                        include or exclude data.
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

    _renderMainBody() {
        let hasChems = this.state.chemicals.length > 0,
            hasReadouts = this.state.readouts.length > 0,
            hasReadoutCategories = this.state.readoutCategories.length > 0,
            readoutType = this.state.readoutType,
            viz = this.state.visualization,
            requiresFilters = [INTVIZ_HEATMAP, INTVIZ_BOXPLOT];

        let filtersRequired =
            _.includes(requiresFilters, viz) &&
            (!hasChems ||
                (readoutType == READOUT_TYPE_READOUT && !hasReadouts) ||
                    (readoutType == READOUT_TYPE_CATEGORY && !hasReadoutCategories));

        if (filtersRequired) {
            return renderNoSelected({
                hasReadouts: readoutType == READOUT_TYPE_READOUT ? hasReadouts : undefined,
                hasReadoutCategories:
                    readoutType == READOUT_TYPE_CATEGORY ? hasReadoutCategories : undefined,
                hasChems,
            });
        }

        switch (viz) {
            case INTVIZ_ASSAY_PCA: {
                return (
                    <div>
                        {
                            //                     unfinished download button
                            //                             <h2>
                            //                            Download buttons:
                            //                            &nbsp;&nbsp;&nbsp;&nbsp;
                            //                            <button onClick={svg_download_form} class="btn btn-primary">
                            //                                Export data
                            //                            </button>
                            //                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            //                             <button onClick={() => svg_download_form('IA_BmdAssayPca01')}  class="btn btn-primary">
                            //                                Export plot
                            //                            </button>
                            //                        </h2>
                        }

                        <BmdAssayPca bmdType={BMD_CW[this.state.bmdType]} />
                        <p className="help-block">
                            <b>Interactivity note:</b> This 3D scatterplot is interactive. Hover
                            over items to view details. Click and drag the mouse to rotate the
                            image. Use your mouse wheel to scroll in/out. Click an item in the
                            legend to show/hide.
                        </p>
                    </div>
                );
            }
            case INTVIZ_CHEMICAL_PCA: {
                return (
                    <div>
                        <BmdChemicalPca bmdType={BMD_CW[this.state.bmdType]} />
                        <p className="help-block">
                            <b>Interactivity note:</b> This 3D scatterplot is interactive. Hover
                            over items to view details. Click and drag the mouse to rotate the
                            image. Use your mouse wheel to scroll in/out. Click an item in the
                            legend to show/hide.
                        </p>
                    </div>
                );
            }
            case INTVIZ_HEATMAP: {
                return (
                    <div>
                        <HeatmapHandler
                            bmdType={BMD_CW[this.state.bmdType]}
                            casrns={this.state.chemicals}
                            heatmapDisplay={this.state.heatmapDisplay}
                            readoutType={this.state.readoutType}
                            readouts={this.state.readouts}
                            readoutCategories={this.state.readoutCategories}
                        />
                        <p className="help-block">
                            <b>Interactivity note:</b> This heatmap is interactive. Click a cell to
                            view individual dose-response curves associated with it.
                        </p>
                    </div>
                );
            }
            case INTVIZ_BOXPLOT: {
                return (
                    <div>
                        {
                            <h2>
                                Download buttons: &nbsp;&nbsp;&nbsp;&nbsp;
                                <button
                                    onClick={() => svg_download_form('IA_Boxplot01')}
                                    class="btn btn-primary"
                                >
                                    Export data
                                </button>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button
                                    onClick={() => svg_download_form('IA_Boxplot01')}
                                    class="btn btn-primary"
                                >
                                    Export plot
                                </button>
                            </h2>
                        }
                        <BmdBoxplot
                            bmdType={BMD_CW[this.state.bmdType]}
                            casrns={this.state.chemicals}
                            readoutType={this.state.readoutType}
                            readouts={this.state.readouts}
                            readoutCategories={this.state.readoutCategories}
                        />
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
                    {isHeatmap
                        ? [<hr key="0" />, <HeatmapDisplaySelector key="1" stateHolder={this} />]
                        : null}
                    <hr />
                    {isPca ? null : this._renderReadoutChemicalSelectors()}
                    <BmdWidget stateHolder={this} />
                </div>

                <div className="col-md-9">
                    {this._renderHelpText()}
                    {this._renderMainBody()}
                </div>
            </div>
        );
    }
}

export default IntegrativeAnalysesMain;
