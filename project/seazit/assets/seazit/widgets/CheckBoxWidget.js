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


       handleChange = (e) => {
        const { name, checked } = e.target;
          this.props.stateHolder.state.selectivityList.map((d) => {
              if (d.name === name)
              {
                    d.isChecked=checked
              }
          }
          );
          // let result = _.chain(this.props.stateHolder.state.selectivityList)
          //       .filter((r) => r.isChecked === true)
          //       .map('name')
          //       .uniq()
          //       .value();
          //  this.props.stateHolder.state.selectivityNames = result
          //  console.log(this.props.stateHolder.state)
      };

        render() {
        let state = this.props.stateHolder.state;

        return (
            <div>
                <label>Selectivity:</label>
                    {this.props.stateHolder.state.selectivityList.map((d, index) => {
                    return (
                        <div key={index}>
                            <input
                                type="checkbox"
                                name={d.name}
                                defaultChecked={d.isChecked}
                                onChange={this.handleChange}
                                // value={state.selectivityNames}
                            />
                            <label>{d.name}</label>
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
