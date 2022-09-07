import React from 'react';
import PropTypes from 'prop-types';
import DoseResponse from './DoseResponse';
import DoseResponse2 from './DoseResponse2';

import DoseResponseGridWidget from '../widgets/DoseResponseGridWidget';

import {
    getDoseResponsesUrl,
    NO_COLLAPSE,
    COLLAPSE_BY_CHEMICAL,
    CHEMFILTER_CHEMICIAL,
    renderSelectMultiOptgroupWidget, renderSelectMultiWidget
} from '../shared';
import IntegrativeCheckBoxWidget from "../widgets/IntegrativeCheckBoxWidget";
import _ from "lodash";

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
                    <DoseResponse2
                        url={state.url}
                        cols={1}
                        height={400}
                        collapse={
                            COLLAPSE_BY_CHEMICAL}
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
                        collapse={
                            NO_COLLAPSE}
                        devtoxreadout_ids={this.props.devtoxreadout_ids}
                    />
                </div>
            );
        }
    }

    render() {
        let readout_ids = (this.state.mortalityCheck) ?
            [this.props.readout_id].concat(['Mortality@120' + '_' + this.props.protocol_id])
            : [this.props.readout_id];
        let collapseFlag = (this.state.mortalityCheck) ?
            COLLAPSE_BY_CHEMICAL
            : NO_COLLAPSE;
        this.state.url = getDoseResponsesUrl(
            [this.props.protocol_id],
            [readout_ids],
            [this.props.casrn]
        );
        return (
            <div className="row-fluid">
                <div className="col-sm-2">
                    <IntegrativeCheckBoxWidget stateHolder={this}/>
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
    devtoxreadout_ids: PropTypes.string.isRequired,
};


class MultipleCurveBody extends React.Component {
    constructor(props) {
        super(props);
        // take 75% of the screen width since main body is col-9 size; assume
        // each plot is ~400px for a reasonable start, make sure it's at least 1
        let initialCols = Math.max(1, Math.floor(0.75 * window.innerWidth / 400));
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
                    <DoseResponse2
                        url={state.url}
                        cols={state.vizColumns}
                        height={state.vizHeight}
                        collapse={
                            // COLLAPSE_BY_CHEMICAL
                        NO_COLLAPSE
                        }
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
                        collapse={
                            NO_COLLAPSE}
                        devtoxreadout_ids={this.props.devtoxreadout_ids}
                    />
                </div>
            );
        }
    }


    render() {
        let readout_ids = (this.state.mortalityCheck) ?
            this.props.readout_ids.concat(['Mortality@120' + '_' + this.props.protocol_id])
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
