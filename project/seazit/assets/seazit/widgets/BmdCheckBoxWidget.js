import React, { useState } from 'react';
import BaseWidget from './BaseWidget';
import * as d3 from 'd3';
import _ from 'lodash';
import PropTypes from 'prop-types';
import RankedBarchartHandler from '../components/RankedBarchartHandler';
import HelpButtonWidget from './HelpButtonWidget';

class BmdCheckBoxWidget extends BaseWidget {
    /*
    BmdCheckBoxWidget requires the following state properties:
        - stateHolder.state.BmdCheckBoxWidget
    */
    constructor(props) {
        super(props);

        this.state = {
            showHelpText: false,
        };
    }
    _renderHelpText() {
        if (!this.state.showHelpText) {
            return null;
        }
        return (
            <div className="alert alert-info">
                <p>
                    Text box: “By default, only the test substances eliciting specific effects will
                    appear.
                </p>
                <ul>
                    <li>
                        specific = a test substance produces quantifiable alteration(s) in
                        phenotypes at a concentration lower than that which causes overt toxicity
                        (i.e., mortality)
                    </li>
                    <li>
                        non-specific = a test substance produces both altered phenotypes and
                        mortality at similar concentrations
                    </li>
                    <li>
                        non-toxic = no changes to phenotype or survival occurred at the
                        concentrations evaluated
                    </li>
                    <li>
                        inconclusive = specificity couldn’t be determined based on differences among
                        plate replicates and requires more testing
                    </li>
                    <li>
                        not evaluated = a phenotype that was not assessed in a particular laboratory
                    </li>
                </ul>
            </div>
        );
    }
    render() {
        let state = this.props.stateHolder.state;
        return (
            <div>
                <label className="label-horizontal">
                    Developmental Toxicity Classification:
                    <HelpButtonWidget
                        stateHolder={this}
                        headLevel={'label'}
                        title={'More information on developmental toxicity classifications'}
                    />
                </label>
                {this._renderHelpText()}

                {/*{this.props.stateHolder.state.selectivityList.map((d, index) => {*/}
                {state.selectivityList.map((d, index) => {
                    return (
                        <div className="checkbox" key={index}>
                            <label>
                                <input
                                    type="checkbox"
                                    name={d.name}
                                    defaultChecked={d.isChecked}
                                    onChange={this.handleCheckboxInputChange}
                                />
                                {d.label}
                            </label>
                        </div>
                    );
                })}
            </div>
        );
    }
}
export default BmdCheckBoxWidget;
