import React from 'react';
import PropTypes from 'prop-types';
import DoseResponse from './DoseResponse';
import SankeyPlot from './SankeyPlot';

import DoseResponseGridWidget from '../widgets/DoseResponseGridWidget';
import Plotly from 'Plotly';

import {
    getDoseResponsesUrl,
    getSankeyPlotUrl,
    NO_COLLAPSE,
    COLLAPSE_BY_CHEMICAL,
    COLLAPSE_WITH_Mortality120,
    renderSelectMultiOptgroupWidget,
    renderSelectMultiWidget,
    BMDVIZ_SELECTIVITY,
    BMCTab,
    ConcentrationResponseTab,
    IntegrativeAnalysesTab,
    integrative_Granular,
} from '../shared';
import IntegrativeCheckBoxWidget from '../widgets/IntegrativeCheckBoxWidget';
import _ from 'lodash';
import BmdCheckBoxWidget from '../widgets/BmdCheckBoxWidget';
import HelpButtonWidget from '../widgets/HelpButtonWidget';

function _renderHelpText(state) {
    if (!state.showHelpText) {
        return null;
    }
    return (
        <div className="alert alert-info">
            <p>
                Detailed view of each developmental phenotype incorporated into the selected
                phenotype group. Specific phenotype terms used per laboratory are included in each
                figure title. Click an x-axis label of the heatmap to learn more about selected
                phenotype.
            </p>
            <br />

            <p>
                Percent mortality at 120 hours post fertilization alone can be visualized in each
                figure by selecting the “add mortality@120” box. Effects that were driven by altered
                morphological phenotypes and not mortality (i.e., specific developmental toxicity
                effect) have backgrounds highlighted using a magenta box. Dotted line is the
                benchmark response (BMR) visualized when looking at altered phenotype data.
            </p>
            <br />

            <p>
                Figures are interactive: the user can zoom in and out using curser and hover over
                each line for information per plate.
            </p>
        </div>
    );
}

class Header extends React.Component {
    render() {
        return <h4>{this.props.title}</h4>;
    }
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
};

class SingleCurveBody extends React.Component {
    constructor(props) {
        super(props);
        // take 75% of the screen width since main body is col-9 size; assume
        // each plot is ~400px for a reasonable start, make sure it's at least 1
        this.state = {
            mortalityCheck: false,
            showHelpText: false,
            vizHeight: 340,
            collapse: NO_COLLAPSE, // Set initial collapse state
        };
    }

    _renderDoseResponse(state) {
        const commonHeader = (
            <div className="col-10">
                <h4 className="label-horizontal">
                    Developmental Toxicity Concentration Response Figures
                    <HelpButtonWidget
                        stateHolder={this}
                        headLevel={'h4'}
                        title={'Click to toggle help-text'}
                    />
                </h4>
                {_renderHelpText(this.state)}
                {this.props.heading && <h5>{this.props.heading}</h5>}
            </div>
        );

        return (
            <div className="col-10">
                {commonHeader}
                <DoseResponse
                    stateHolder={this}
                    url={state.url}
                    cols={3}
                    height={state.vizHeight}
                    collapse={state.collapse}
                    devtoxEndPointList={this.props.devtoxEndPointList}
                    final_dev_call={this.props.final_dev_call}
                />
            </div>
        );
    }

    render() {
        this.state.collapse = this.state.mortalityCheck ? COLLAPSE_WITH_Mortality120 : NO_COLLAPSE;

        let readout_ids = this.state.mortalityCheck
            ? [this.props.readout_id].concat(['Mortality@120' + '_' + this.props.protocol_id])
            : [this.props.readout_id];
        this.state.url = getDoseResponsesUrl(
            [this.props.protocol_id],
            [readout_ids],
            [this.props.casrn]
        );

        return (
            <div className="row  row-full-width">
                <div className="col-2">
                    {this.props.CheckBoxDisable ? null : (
                        <IntegrativeCheckBoxWidget stateHolder={this} />
                    )}
                </div>
                {this._renderDoseResponse(this.state)}
            </div>
        );
    }
}

SingleCurveBody.propTypes = {
    protocol_id: PropTypes.number.isRequired,
    readout_id: PropTypes.string.isRequired,
    casrn: PropTypes.array.isRequired,
    devtoxEndPointList: PropTypes.string,
    CheckBoxDisable: false,
    heading: PropTypes.string,
    final_dev_call: PropTypes.string,
};

class molecularGraphBody extends React.Component {
    constructor(props) {
        super(props);
        // take 75% of the screen width since main body is col-9 size; assume
        // each plot is ~400px for a reasonable start, make sure it's at least 1
    }

    render() {
        let srcUrl = `https://comptox.epa.gov/dashboard-api/ccdapp1/chemical-files/image/by-dtxsid/${this.props.dtxsid}`;
        return (
            <div className="col-10">
                <iframe src={srcUrl} width="400" height="400"></iframe>
            </div>
        );
    }
}

molecularGraphBody.propTypes = {
    dtxsid: PropTypes.string.isRequired,
};

class sankeyPlotGraphBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="col-10">
                <SankeyPlot cells={this.props.cells} />
            </div>
        );
    }
}

sankeyPlotGraphBody.propTypes = {
    title: PropTypes.string.isRequired,
    cells: PropTypes.array.isRequired,
};

class MultipleCurveBody extends React.Component {
    constructor(props) {
        super(props);
        // take 75% of the screen width since main body is col-9 size; assume
        // each plot is ~400px for a reasonable start, make sure it's at least 1
        let initialCols = Math.max(1, Math.floor((0.75 * window.innerWidth) / 400));
        this.state = {
            vizColumns: initialCols,
            vizHeight: 340,
            mortalityCheck: false,
            showHelpText: false,
            collapse: NO_COLLAPSE, // Set initial collapse state
        };
    }

    _renderDoseResponse(state) {
        // console.log(state)

        const commonHeader = (
            <div className="col-10">
                <h4 className="label-horizontal">
                    Developmental Toxicity Concentration Response Figures
                    <HelpButtonWidget
                        stateHolder={this}
                        headLevel={'h4'}
                        title={'Click to toggle help-text'}
                    />
                </h4>
                {this.props.heading && <h5>{this.props.heading}</h5>}
                {_renderHelpText(this.state)}
            </div>
        );

        return (
            <div className="col-10">
                {commonHeader}
                <DoseResponse
                    stateHolder={this}
                    url={state.url}
                    cols={state.vizColumns}
                    height={state.vizHeight}
                    collapse={state.collapse}
                    devtoxEndPointList={this.props.devtoxEndPointList}
                />
            </div>
        );
    }

    render() {
        this.state.collapse = this.state.mortalityCheck ? COLLAPSE_WITH_Mortality120 : NO_COLLAPSE;
        let readout_ids = this.state.mortalityCheck
            ? this.props.readout_ids.concat(['Mortality@120' + '_' + this.props.protocol_id])
            : [this.props.readout_ids];
        this.state.url = getDoseResponsesUrl(
            [this.props.protocol_id],
            [readout_ids],
            [this.props.casrns]
        );
        return (
            <div className="row  row-full-width">
                <div className="col-2">
                    <DoseResponseGridWidget stateHolder={this} />
                    <br />
                    <IntegrativeCheckBoxWidget stateHolder={this} />
                </div>
                {this._renderDoseResponse(this.state)}
            </div>
        );
    }
}

MultipleCurveBody.propTypes = {
    protocol_id: PropTypes.number.isRequired,
    readout_ids: PropTypes.array.isRequired,
    casrns: PropTypes.array.isRequired,
    devtoxEndPointList: PropTypes.array.isRequired,
    heading: PropTypes.string,
};

export { Header, SingleCurveBody, MultipleCurveBody, molecularGraphBody, sankeyPlotGraphBody };
