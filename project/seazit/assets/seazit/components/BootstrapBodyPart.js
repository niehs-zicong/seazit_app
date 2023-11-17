import React from 'react';
import PropTypes from 'prop-types';
import { DoseResponse, DoseResponseMort120 } from './DoseResponse';
import SankeyPlot from './SankeyPlot';
import styles from './graph.css';

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
                phenotype .
            </p>
            <p>
                Percent mortality at 120 hours post fertilization alone can be visualized in each
                figure by selecting the “add mortality@120” box. Effects that were driven by altered
                morphological phenotypes and not mortality (i.e., specific developmental toxicity
                effect) have backgrounds highlighted using a magenta box. Dotted line is the
                benchmark response (BMR) visualized when looking at altered phenotype data.
            </p>
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
            fill: this.props.fill,
            showHelpText: false,
        };
    }

    _renderDoseResponse(state) {
        const commonHeader = (
            <div className="col-sm-10">
                <h4 className={styles.labelHorizaontal}>
                    Developmental Toxicity Concentration Response Figures
                    <HelpButtonWidget
                        stateHolder={this}
                        headLevel={'h4'}
                        title={'Click to toggle help-text'}
                    />
                </h4>
                <h5>
                    {this.props.devtoxreadout_ids.length} of endpoints are associated with{' '}
                    {this.props.ontologyGroupName}
                </h5>
                {_renderHelpText(this.state)}
            </div>
        );

        return (
            <div className="col-sm-10">
                {commonHeader}
                {state.mortalityCheck ? (
                    <DoseResponseMort120
                        stateHolder={this}
                        url={state.url}
                        cols={1}
                        height={400}
                        collapse={COLLAPSE_WITH_Mortality120}
                        devtoxreadout_ids={this.props.devtoxreadout_ids}
                        fill={this.props.fill}
                    />
                ) : (
                    <DoseResponse
                        stateHolder={this}
                        url={state.url}
                        cols={1}
                        height={400}
                        collapse={NO_COLLAPSE}
                        devtoxreadout_ids={this.props.devtoxreadout_ids}
                        fill={this.props.fill}
                    />
                )}
            </div>
        );
    }

    render() {
        let readout_ids = this.state.mortalityCheck
            ? [this.props.readout_id].concat(['Mortality@120' + '_' + this.props.protocol_id])
            : [this.props.readout_id];
        let collapseFlag = this.state.mortalityCheck ? COLLAPSE_BY_CHEMICAL : NO_COLLAPSE;
        this.state.url = getDoseResponsesUrl(
            [this.props.protocol_id],
            [readout_ids],
            [this.props.casrn]
        );
        return (
            <div className="row-fluid">
                <div className="col-sm-2">
                    <IntegrativeCheckBoxWidget stateHolder={this} />
                </div>
                {/*{this.props.CheckBoxDisable ? null : (*/}
                {/*    <IntegrativeCheckBoxWidget stateHolder={this}/>*/}
                {/*)}*/}
                {this._renderDoseResponse(this.state)}
            </div>
        );
    }
}

SingleCurveBody.propTypes = {
    protocol_id: PropTypes.number.isRequired,
    readout_id: PropTypes.string.isRequired,
    casrn: PropTypes.array.isRequired,
    devtoxreadout_ids: PropTypes.string.isRequired,
    CheckBoxDisable: false,
    fill: PropTypes.string,
    title: PropTypes.string,
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
            <div className="col-sm-10">
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
            <div className="col-sm-10">
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
            // DoseResponseGridWidget
            vizColumns: initialCols,
            vizHeight: 340,
            mortalityCheck: false,
            showHelpText: false,
            fill: this.props.fill,
        };
    }

    _renderDoseResponse(state) {
        // console.log(state)
        console.log(this.props.devtoxreadout_ids);

        const commonHeader = (
            <div className="col-sm-10">
                <h4 className={styles.labelHorizaontal}>
                    Developmental Toxicity Concentration Response Figures
                    <HelpButtonWidget
                        stateHolder={this}
                        headLevel={'h4'}
                        title={'Click to toggle help-text'}
                    />
                </h4>
                <h5>
                    {this.props.devtoxreadout_ids.length} of endpoints are associated with{' '}
                    {this.props.ontologyGroupName}
                </h5>
                {_renderHelpText(this.state)}
            </div>
        );

        return (
            <div className="col-sm-10">
                {commonHeader}
                {state.mortalityCheck ? (
                    <DoseResponseMort120
                        stateHolder={this}
                        url={state.url}
                        cols={state.vizColumns}
                        height={state.vizHeight}
                        collapse={COLLAPSE_WITH_Mortality120}
                        devtoxreadout_ids={this.props.devtoxreadout_ids}
                        fill={this.props.fill}
                    />
                ) : (
                    <DoseResponse
                        url={state.url}
                        cols={state.vizColumns}
                        height={state.vizHeight}
                        collapse={NO_COLLAPSE}
                        devtoxreadout_ids={this.props.devtoxreadout_ids}
                        fill={this.props.fill}
                    />
                )}
            </div>
        );
    }

    render() {
        let readout_ids = this.state.mortalityCheck
            ? this.props.readout_ids.concat(['Mortality@120' + '_' + this.props.protocol_id])
            : [this.props.readout_ids];
        this.state.url = getDoseResponsesUrl(
            [this.props.protocol_id],
            [readout_ids],
            [this.props.casrns]
        );
        return (
            <div className="row-fluid">
                <div className="col-sm-2">
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
    devtoxreadout_ids: PropTypes.array.isRequired,
    fill: PropTypes.string,
    ontologyGroupName: PropTypes.ontologyGroupName,
};

export { Header, SingleCurveBody, MultipleCurveBody, molecularGraphBody, sankeyPlotGraphBody };
