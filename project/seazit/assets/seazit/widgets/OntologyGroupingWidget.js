import React, { useState }from 'react';
import BaseWidget from './BaseWidget';
import * as d3 from "d3";
import _ from "lodash";
import PropTypes from "prop-types";
import { integrative_Granular, integrative_General} from "../shared";


class OntologyGroupingWidget extends BaseWidget {
    /*
    CheckBoxWiOntologyGroupingWidgetdget requires the following state properties:
        - stateHolder.state.OntologyGroupingWidget
    */
    constructor(props) {
        super(props);
    }


        render() {
        let state = this.props.stateHolder.state;
        return (
            <div>
                <label>Ontology Groupings:</label>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="ontologyGroup"
                            // name="ontologyGroup"
                            onChange={this.handleRadioChange}
                            value={integrative_Granular}
                            checked={state.ontologyGroup === integrative_Granular}
                        />
                        Granular
                    </label>

                    <span style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>|</span>

                    <label>
                        <input
                            type="radio"
                            name="ontologyGroup"
                            // name="ontologyGroup"
                            onChange={this.handleRadioChange}
                            value={integrative_General}
                            checked={state.ontologyGroup === integrative_General}
                        />
                        General
                    </label>
                </div>
            </div>
        );
    }


}

export default OntologyGroupingWidget;
