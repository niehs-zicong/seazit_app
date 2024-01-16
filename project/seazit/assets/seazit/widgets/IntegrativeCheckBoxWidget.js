import React from 'react';
import BaseWidget from './BaseWidget';
import './Switch.css';
import styles from '../style.css';

import * as d3 from 'd3';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { INTVIZ_HEATMAP } from '../shared';
import SankeyPlot from '../components/SankeyPlot';

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
                <input
                    type="checkbox"
                    name="mortalityCheck"
                    onChange={this.handleToggleChange}
                    value={state.mortalityCheck}
                />
                <span> &nbsp; Add mortality@120 responses</span>
                <br />
                <div>
                    <div className={styles.magentaBox}></div>
                    <span> &nbsp;Specific developmental toxicity effect</span>
                </div>
            </div>
        );
    }
}

IntegrativeCheckBoxWidget.propTypes = {
    fill: PropTypes.string,
};

export default IntegrativeCheckBoxWidget;
