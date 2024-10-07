import React from 'react';

import Loading from 'utils/Loading';
import FiveOhEight from '../components/FiveOhEight';
import HelpButtonWidget from '../widgets/HelpButtonWidget';
import BmdByLabPlotWidget from '../widgets/BmdByLabPlotWidget';
import ReadoutWidget from '../widgets/ReadoutWidget';
import SelectorSliderWidget from '../widgets/SelectorSliderWidget';
import BmdCheckBoxWidget from '../widgets/BmdCheckBoxWidget';
import OntologyTypeWidget from '../widgets/OntologyTypeWidget';

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
    loadBaseUrl,
    renderNoSelected,
    BMCTab,
    integrative_Granular,
    integrative_General,
} from '../shared';

class BmdByLabMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            metadataLoaded: false,
            metadata: null,
            showHelpText: false,

            chemList: CHEMLIST_80,
            chemicalFilterBy: CHEMFILTER_CATEGORY,
            chemicals: [],
            categories: [],
            ontologyType: integrative_General,
            ontologyGroup: [],

            selectivityCutoff: 0.5,
            selectivityList: [
                { id: 1, name: 'dev tox', isChecked: true, label: 'specific' },
                { id: 2, name: 'general tox', isChecked: false, label: 'non-specific' },
                {
                    id: 3,
                    name: 'inconclusive',
                    isChecked: false,
                    label: 'inconclusive, more tests are needed',
                },
                { id: 4, name: 'inactive', isChecked: false, label: 'non-toxic' },
            ],

            selectedAxis: AXIS_LOG10,

            assays: [],
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
            hasAssay: this.state.assays.length > 0,
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
                <p>
                    The page allows for the visualization of test substance ranking based on either
                    the Activity or Specificity of selected altered laboratory defined phenotype(s)
                    within a single dataset.
                </p>
                <br />

                <p>
                    The Use Categories of test substances are color coded next to substance name.
                    More information on Use Category can be viewed on the{' '}
                    {/*<a href="https://ods.ntp.niehs.nih.gov/seazit/dataset/">*/}
                    <a href={loadBaseUrl('/seazit/dataset/')}>
                        {/*<a href={this.state.dynamicUrl + "/seazit/dataset/"}>*/}
                        Datasets tool page
                    </a>
                    .
                </p>
                <br />

                <p>A table will appear underneath each visual with additional information.</p>
                <br />

                <p>
                    Options for editing or saving images are provided by toggling over the upper
                    right side of each image. If the edit/save toolbar is not available, it was a
                    custom visualization created specifically for this application. Please take a
                    screenshot to save, or if you need a higher resolution image, please contact us.
                </p>
            </div>
        );
    }

    render() {
        if (!this.state.metadataLoaded) {
            return <Loading />;
        }

        let url = getBmdsUrl(this.state.assays, this.state.readouts);

        return (
            <div className="row  row-full-width">
                <div className="col-12">
                    <h1 className="label-horizontal">
                        Benchmark concentration (BMC) summary by dataset
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
                        hideViability={true}
                        hideNonViability={false}
                        multiAssaySelector={false}
                        multiReadoutSelector={false}
                    />
                    <hr />
                    <BmdByLabPlotWidget stateHolder={this} />
                    {this.state.visualization === BMDVIZ_SELECTIVITY ? (
                        <BmdCheckBoxWidget stateHolder={this} />
                    ) : null}
                </div>
                <div className="col-9">
                    {this._renderHelpText()}
                    {url ? this.renderSelection(url) : this.renderNoSelection()}
                </div>
            </div>
        );
    }
}

export default BmdByLabMain;
