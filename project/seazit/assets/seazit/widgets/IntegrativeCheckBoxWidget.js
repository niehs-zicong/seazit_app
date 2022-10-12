import React from 'react';
import BaseWidget from './BaseWidget';
import './Switch.css';
import styles from '../components/graph.css';

import * as d3 from "d3";
import _ from "lodash";
import PropTypes from "prop-types";
import {INTVIZ_HEATMAP} from "../shared";


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

                {/*<label>Toggle Switch for mortality@120 </label>*/}
                <label>
                    <input
                        type="checkbox"
                        name="mortalityCheck"
                        onChange={this.handleToggleChange}
                        value={state.mortalityCheck}
                    />
                    <span>Add mortality@120</span>
                </label>
                <br/>

                <div>
                    <div className={styles.yellowbox}></div>
                    Background: specific
                </div>

            </div>

        );
    }
}

export default IntegrativeCheckBoxWidget;
