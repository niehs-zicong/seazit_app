import $ from '$';
import _ from 'lodash';
import React from 'react';
import BaseWidget from './BaseWidget';

import {
    renderSelectMultiWidget,
    renderSelectMultiOptgroupWidget,
    integrative_Granular,
    integrative_General,
} from '../shared';
import PropTypes from 'prop-types';

class OntologyTypeWidget extends BaseWidget {
    render() {
        let state = this.props.stateHolder.state;
        // console.log(state);
        return (
            <div>
                <label>Ontology Groupings: Filter endpoints by:</label>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="ontologyType"
                            onChange={this.handleRadioChange}
                            value={integrative_Granular}
                            checked={state.ontologyType === integrative_Granular}
                        />
                        by Granular
                    </label>

                    <span style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>|</span>

                    <label>
                        <input
                            type="radio"
                            name="ontologyType"
                            onChange={this.handleRadioChange}
                            value={integrative_General}
                            checked={state.ontologyType === integrative_General}
                        />
                        by General
                    </label>
                </div>
            </div>
        );
    }
}

export default OntologyTypeWidget;
