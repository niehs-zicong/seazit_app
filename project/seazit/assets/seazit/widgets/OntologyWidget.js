import $ from '$';
import _ from 'lodash';
import React from 'react';
import BaseWidget from './BaseWidget';

import {
    renderSelectMultiWidget,
    renderSelectMultiOptgroupWidget,
    integrative_Granular,
    integrative_General
} from '../shared';
import PropTypes from "prop-types";

class OntologyWidget extends BaseWidget {
    /*
    ChemicalWidget requires the following state properties:
        - chemList (enum)
        - chemicalFilterBy (enum)
        - chemicals (list of str)
        - categories (list of str)
    */

    constructor(props) {
        super(props);
    }

    _renderFilterBy(state) {
        return (
            <div>
                <label>Ontology Groupings:</label>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="ontologyType"
                            onChange={this.handleRadioChange}
                            value={integrative_Granular}
                            checked={state.ontologyType === integrative_Granular}
                        />
                        Granular
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
                        General
                    </label>
                </div>
            </div>

        );
    }

    _renderSelector(state) {
        let opts;
        if (state.ontologyType === integrative_Granular) {
            opts = _.chain(state.Seazit_ontology)
                .map((r) => {
                return {
                    developmental_defect_grouping_granular: r.developmental_defect_grouping_granular,
                    key: r.developmental_defect_grouping_granular,
                    label: r.developmental_defect_grouping_granular,
                };
            })
            .uniqBy('developmental_defect_grouping_granular')
            .sortBy('developmental_defect_grouping_granular')
            .value()
            ;
            return renderSelectMultiWidget(
                'ontologyGroup',
                'Granular',
                opts,
                state.ontologyGroup,
                this.handleGranularChange
            );
        } else {
            opts = _.chain(state.Seazit_ontology)
                .map((r) => {
                return {
                    key: r.developmental_defect_grouping_general,
                    label: r.developmental_defect_grouping_general,
                    developmental_defect_grouping_general: r.developmental_defect_grouping_general,
                };
            })
            .uniqBy('developmental_defect_grouping_general')
            .sortBy('developmental_defect_grouping_general')
            .value()
            ;

            console.log("opts")
            console.log(opts)

            return renderSelectMultiWidget(
                'ontologyGroup',
                'General',
                opts,
                state.ontologyGroup,
                this.handleGeneralChange
            );
        }
    }

    render() {
        let state = this.props.stateHolder.state;
        return (
            <div className="clearfix">
                {this._renderFilterBy(state)}
                {this._renderSelector(state)}
            </div>
        );
    }
}

OntologyWidget.propTypes = {
    stateHolder: PropTypes.instanceOf(React.Component).isRequired,
    // hideViability: PropTypes.bool.isRequired,
    // hideNonViability: PropTypes.bool.isRequired,
    // multiAssaySelector: PropTypes.bool.isRequired,
    // multiReadoutSelector: PropTypes.bool.isRequired,
    // tabName: PropTypes.string.isRequired,
};

export default OntologyWidget;
