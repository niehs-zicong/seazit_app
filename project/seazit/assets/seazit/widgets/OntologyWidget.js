import $ from '$';
import _ from 'lodash';
import React from 'react';
import BaseWidget from './BaseWidget';
import styles from '../style.css';

import {
    renderSelectMultiWidget,
    renderSelectMultiOptgroupWidget,
    integrative_Granular,
    integrative_General,
} from '../shared';
import PropTypes from 'prop-types';
import HelpButtonWidget from './HelpButtonWidget';

class OntologyWidget extends BaseWidget {
    constructor(props) {
        super(props);

        this.state = {
            showHelpText: false,
        };
    }

    _renderFilterBy(state) {
        return (
            <div>
                <label className={styles.labelHorizontal}>
                    Select developmental phenotype group:
                    <HelpButtonWidget
                        stateHolder={this}
                        headLevel={'label'}
                        title={'More information on developmental phenotype groups'}
                    />
                </label>
                {this._renderHelpText()}

                <div className="radio">
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
                    <span style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>|</span>
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
                </div>
            </div>
        );
    }

    _renderSelector(state) {
        const customGroupOrder = ['General', 'Head', 'Appendage', 'Torso'];
        const groupingKey =
            state.ontologyType === integrative_Granular
                ? 'developmental_defect_grouping_granular'
                : 'developmental_defect_grouping_general';
        // console.log(state.Seazit_ontology)
        const opts = _.chain(state.Seazit_ontology)
            .filter((r) => r[groupingKey] !== 'dead') // Filter out items where groupingKey is 'dead'

            .map((r) => ({ key: r[groupingKey], label: r[groupingKey], ...r }))
            .reject((r) => r.key === null)
            .uniqBy(groupingKey)
            .groupBy('developmental_defect_catergories')
            .thru((groupedData) =>
                _.fromPairs(
                    _.sortBy(Object.entries(groupedData), ([group]) =>
                        customGroupOrder.indexOf(group)
                    )
                )
            )
            .value();

        if (_.isEmpty(opts)) {
            return null;
        }
        // console.log(opts)

        return renderSelectMultiOptgroupWidget(
            'ontologyGroup',
            state.ontologyType === integrative_Granular
                ? 'Granular phenotype term'
                : 'General phenotype term',
            opts,
            state.ontologyGroup,
            this.handleSelectMultiChange
        );
    }

    _renderHelpText() {
        if (!this.state.showHelpText) {
            return null;
        }
        return (
            <div className="alert alert-info">
                <p>
                    Detailed recordings of each laboratory are grouped into corresponding higher
                    level developmental defect phenotype groups. We created two types of
                    developmental defect phenotypes, the general grouping (n = 10) and the granular
                    grouping (n = 18). See{' '}
                    <a href="https://ods.ntp.niehs.nih.gov/seazit/dataset/"> Datasets page</a> for
                    more information.
                </p>
            </div>
        );
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
