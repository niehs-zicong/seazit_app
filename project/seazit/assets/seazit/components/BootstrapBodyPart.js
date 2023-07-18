import React from 'react';
import PropTypes from 'prop-types';
import {DoseResponse, DoseResponseMort120} from './DoseResponse';
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
} from '../shared';
import IntegrativeCheckBoxWidget from '../widgets/IntegrativeCheckBoxWidget';
import _ from 'lodash';
import BmdCheckBoxWidget from '../widgets/BmdCheckBoxWidget';

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
        };
    }

    _renderDoseResponse(state) {
        if (state.mortalityCheck) {
            return (
                <div className="col-sm-10">
                    <DoseResponseMort120
                        url={state.url}
                        cols={1}
                        height={400}
                        collapse={COLLAPSE_WITH_Mortality120}
                        devtoxreadout_ids={this.props.devtoxreadout_ids}
                    />
                </div>
            );
        } else {
            return (
                <div className="col-sm-10">
                    <DoseResponse
                        url={state.url}
                        cols={1}
                        height={400}
                        collapse={NO_COLLAPSE}
                        devtoxreadout_ids={this.props.devtoxreadout_ids}
                    />
                </div>
            );
        }
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
                {/*<div className="col-sm-2">*/}
                {/*    <IntegrativeCheckBoxWidget stateHolder={this} />*/}
                {/*</div>*/}
                {this.props.CheckBoxDisable ? null : (
                    <IntegrativeCheckBoxWidget stateHolder={this}/>
                )}
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
                <SankeyPlot
                    cells={this.props.cells}
                />
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
            vizHeight: 350,
            mortalityCheck: false,
        };
    }

    _renderDoseResponse(state) {
        if (state.mortalityCheck) {
            return (
                <div className="col-sm-10">
                    <DoseResponseMort120
                        url={state.url}
                        cols={state.vizColumns}
                        height={state.vizHeight}
                        collapse={COLLAPSE_WITH_Mortality120}
                        devtoxreadout_ids={this.props.devtoxreadout_ids}
                    />
                </div>
            );
        } else {
            return (
                <div className="col-sm-10">
                    <DoseResponse
                        url={state.url}
                        cols={state.vizColumns}
                        height={state.vizHeight}
                        collapse={NO_COLLAPSE}
                        devtoxreadout_ids={this.props.devtoxreadout_ids}
                    />
                </div>
            );
        }
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
                    <DoseResponseGridWidget stateHolder={this}/>
                    <IntegrativeCheckBoxWidget stateHolder={this}/>
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
};

export {Header};
export {SingleCurveBody};
export {MultipleCurveBody};
export {molecularGraphBody};
export {sankeyPlotGraphBody};

