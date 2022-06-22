import $ from '$';
import _ from 'lodash';
import React from 'react';
import BaseWidget from './BaseWidget';

import {
    CHEMFILTER_CATEGORY,
    CHEMFILTER_CHEMICIAL,
    renderSelectMultiWidget,
    renderSelectMultiOptgroupWidget,
    integrative_Granular,
    integrative_General
} from '../shared';
import PropTypes from "prop-types";
import ReadoutWidget from "./ReadoutWidget";

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
                            name="ontologyGroup"
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

    _renderSelector(state) {
        let opts;
        if (state.ontologyGroup === integrative_Granular) {
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
            console.log("opts")
            console.log(opts)

            return renderSelectMultiWidget(
                'ontologyDefectGrouping',
                'Granular',
                opts,
                state.ontologyDefectGrouping,
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
                'ontologyDefectGrouping',
                'General',
                opts,
                state.ontologyDefectGrouping,
                this.handleGeneralChange
            );
        }
    }

    render() {
        let state = this.props.stateHolder.state;
        console.log(state)

        return (
            <div className="clearfix">
                {this._renderFilterBy(state)}
                {this._renderSelector(state)}
            </div>
        );
    }
}

ReadoutWidget.propTypes = {
    stateHolder: PropTypes.instanceOf(React.Component).isRequired,
    // hideViability: PropTypes.bool.isRequired,
    // hideNonViability: PropTypes.bool.isRequired,
    // multiAssaySelector: PropTypes.bool.isRequired,
    // multiReadoutSelector: PropTypes.bool.isRequired,
    // tabName: PropTypes.string.isRequired,
};

export default OntologyWidget;
