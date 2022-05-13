import React, { useState }from 'react';
import BaseWidget from './BaseWidget';
import * as d3 from "d3";
import _ from "lodash";
import PropTypes from "prop-types";
import RankedBarchartHandler from "../components/RankedBarchartHandler";


class CheckBoxWidget extends BaseWidget {
    /*
    CheckBoxWidget requires the following state properties:
        - stateHolder.state.CheckBoxWidget
    */
    constructor(props) {
        super(props);
    }

        render() {
        let state = this.props.stateHolder.state;
        return (
            <div>
                <label>Selectivity:</label>
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
                                    // value={state.selectivityNames}
                                />
                                {d.name}
                            </label>
                        </div>
                    );
                })}
            </div>
        );

        }

}
//
// CheckBoxWidget.propTypes = {
//     selectivityList: PropTypes.array.isRequired,
// };

export default CheckBoxWidget;
