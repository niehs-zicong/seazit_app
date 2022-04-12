import React, { useState }from 'react';
import BaseWidget from './BaseWidget';
import * as d3 from "d3";
import _ from "lodash";


class CheckBoxWidget extends BaseWidget {
    /*
    CheckBoxWidget requires the following state properties:
        - stateHolder.state.CheckBoxWidget
    */
    constructor(props) {
        super(props);
        // this.state = {
        //     selectivityList: [
        //         {
        //             id: 1,
        //             name: "dev tox",
        //             isChecked: true,
        //         },
        //         {
        //             id: 2,
        //             name: "general tox",
        //             isChecked: false,
        //         },
        //         {
        //             id: 3,
        //             name: "inconclusive",
        //             isChecked: false,
        //         },
        //         {
        //             id: 4,
        //             name: "inactive",
        //             isChecked: false,
        //         }
        //     ]
        // };
    }


       handleChange = (e) => {
        const { name, checked } = e.target;
          this.state.selectivityList.map((d) => {
              if (d.name === name)
              {
                    d.isChecked=checked
              }
          }
          );
          let result = _.chain(this.state.selectivityList)
                .filter((r) => r.isChecked === true)
                .map('name')
                .uniq()
                .value();
           this.props.stateHolder.state.selectivityNames = result
           console.log(this.props.stateHolder.state)
      };
        render() {
        let state = this.props.stateHolder.state;
        let result2 = _.chain(state.selectivityList)
                .filter((r) => r.isChecked === true)
                .map('name')
                .uniq()
                .value();
        console.log(result2)

        return (
            <div>
                <label>Selectivity:</label>
                    {state.selectivityList.map((d, index) => {
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
export default CheckBoxWidget;
