import React from 'react';
import BaseWidget from './BaseWidget';
import styles from '../style.css';

class DoseResponseGridWidget extends BaseWidget {
    /*
    DoseResponseGridWidget requires the following state properties:
        - stateHolder.state.vizColumns
        - stateHolder.state.vizHeight
    */
    constructor(props) {
        super(props);
    }

    render() {
        let state = this.props.stateHolder.state;
        return (
            <div>
                <label>Number of columns [1-4] to view:</label>
                <input
                    className="form-control"
                    type="range"
                    name="vizColumns"
                    min="1"
                    max="4"
                    onChange={this.handleIntegerInputChange}
                    value={state.vizColumns}
                />
                <span>{state.vizColumns} columns selected</span>

                <br />

                <label>Image height [350-700px]:</label>
                <input
                    className="form-control"
                    type="range"
                    name="vizHeight"
                    min="350"
                    max="700"
                    step="50"
                    onChange={this.handleIntegerInputChange}
                    value={state.vizHeight}
                />
                <span>{state.vizHeight} px selected</span>

                <br />
            </div>
        );
    }
}

export default DoseResponseGridWidget;
