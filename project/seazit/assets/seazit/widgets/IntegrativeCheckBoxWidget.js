import React, { useState }from 'react';
import BaseWidget from './BaseWidget';
import * as d3 from "d3";
import _ from "lodash";
import PropTypes from "prop-types";


class IntegrativeCheckBoxWidget extends BaseWidget {
    /*
    IntegrativeCheckBoxWidget requires the following state properties:
        - stateHolder.state.IntegrativeCheckBoxWidget
    */
    constructor(props) {
        super(props);
    }

        render() {
        let state = this.props.stateHolder.state;
        return (
            <div>
                    <label>Toggle Switch for mortality@120  </label>
                        <input type="checkbox" checked/>
                            <span className="slider round"/>
            </div>
        );
        }
}
export default IntegrativeCheckBoxWidget;
