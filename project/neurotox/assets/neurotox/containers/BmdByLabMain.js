import React from 'react';

import Loading from 'utils/Loading';
import FiveOhEight from '../components/FiveOhEight';
import HelpButtonWidget from '../widgets/HelpButtonWidget';
import BmdByLabPlotWidget from '../widgets/BmdByLabPlotWidget';
import BmdWidget from '../widgets/BmdWidget';
import ReadoutWidget from '../widgets/ReadoutWidget';
import SelectorSliderWidget from '../widgets/SelectorSliderWidget';
import AxisSelectorWidget from '../widgets/AxisSelectorWidget';
import RankedBarchartHandler from '../components/RankedBarchartHandler';

import {
    AXIS_LOG10,
    BMD_HILL,
    CHEMFILTER_CATEGORY,
    CHEMLIST_80,
    BMDVIZ_ACTIVITY,
    BMDVIZ_SELECTIVITY,
    loadMetadata,
    renderNoSelected,
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

            // BmdWidget
            bmdType: BMD_HILL,

            // ChemicalSelectorWidget
            chemList: CHEMLIST_80,
            chemicalFilterBy: CHEMFILTER_CATEGORY,
            chemicals: [],
            categories: [],

            // SelectorSliderWidget
            selectivityCutoff: 0.5,

            // AxisSelectorWidget
            selectedAxis: AXIS_LOG10,

            // ReadoutSelectorWidget
            assay: '',
            readouts: [],

            visualization: BMDVIZ_ACTIVITY,
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
                <p>
                    Following the selection of assays and the BMC model (Hill or CurveP) on the left
                    panel, the user can choose to visualize data either by activity or selectivity.
                    Data can be viewed on a linear, log, or square root (sqrt) scale. If assay
                    specific controls were submitted to the NTP (by each lab), then these data are
                    also here for comparison.
                </p>
                <p>
                    When <b>Activity</b> is selected:
                </p>
                <p style={{ paddingLeft: '1em' }}>
                    Chemicals are ranked (y-axis) by lowest BMC (most active) to highest BMC within
                    an assay. If multiple readouts are selected per assay, the minimum BMC is shown.
                    Chemical categories are color coded next to chemical name. For selected readout,
                    the BMC for the neuro/developmental specific endpoints is visualized by a
                    colored circle. BMCs are given in µM (x-axis). By clicking on a colored dot, the
                    concentration response curve can be visualized. The BMC upper and lower (BMC -U
                    and BMC-L) confidence limits are shown in colored bars. Additionally, the BMC
                    values are shown for corresponding cell viability or mortality with a black dot;
                    the corresponding BMC-U and BMC-L are visualized with the black dashed line. If
                    you click on the black dot, the concentration response curve can be visualized.
                    All chemicals and their BMCs are listed below in tabular form. Again, if
                    multiple readouts are selected per assay, the minimum BMC is shown in the table
                    under “minimum non-viability BMC”. For comparison, the “minimum viability (or
                    mortality)” BMC along with its confidence interval in parenthesis is also shown.
                    For chemicals which did not have activity exceeding the BMR, a BMC was not
                    calculated (BMC = “-”).
                </p>
                <p>
                    When <b>Selectivity</b> is selected:
                </p>
                <p style={{ paddingLeft: '1em' }}>
                    Chemicals are ranked by most selective to least selective and the selective
                    value is denoted on the right-side of the graph. Selectivity is defined as a
                    neuro or developmental specific effect occurring in the absence of general
                    toxicity (i.e., mortality or loss of cell viability). Selectivity is the log10
                    of the ratio (minimum BMC viability value for an assay/ minimum nonviability BMC
                    value for the same assay); higher values are for more selective chemicals. A
                    sliding scale bar is provided to visualize a selectivity cutoff values for
                    chemicals that affect developmental or neuro processes in the absence of general
                    toxicity. Depending on the goal of study, a selectivity score of 0.3 or higher
                    is suggested. This value was chosen because it is approximately the 25th
                    percentile across all current datasets . This is a conservative approach that
                    allows for the identification of selectively neurotoxic chemicals to prioritize
                    for further testing. In some cases, this inclusivity may result in false
                    positives.
                </p>
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

    _renderMain() {
        let hasReadouts = this.state.readouts.length > 0;
        if (!hasReadouts) {
            return renderNoSelected({
                hasReadouts,
                hasChems: true,
            });
        }

        return (
            <RankedBarchartHandler
                selectedReadouts={this.state.readouts}
                bmdType={this.state.bmdType}
                visualization={this.state.visualization}
                selectivityCutoff={this.state.selectivityCutoff}
                selectedAxis={this.state.selectedAxis}
            />
        );
    }

    render() {
        if (!this.state.metadataLoaded) {
            return <Loading />;
        }

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
                    <hr />
                    <ReadoutWidget
                        stateHolder={this}
                        hideViability={true}
                        hideNonViability={false}
                        multiAssaySelector={false}
                    />
                    <hr />
                    <BmdWidget stateHolder={this} />
                    <BmdByLabPlotWidget stateHolder={this} />
                    <AxisSelectorWidget stateHolder={this} />
                    {this.state.visualization === BMDVIZ_SELECTIVITY ? (
                        <SelectorSliderWidget stateHolder={this} />
                    ) : null}
                </div>
                <div className="col-md-9">
                    {this._renderHelpText()}
                    {this._renderMain()}
                </div>
            </div>
        );
    }
}

export default BmdByLabMain;
