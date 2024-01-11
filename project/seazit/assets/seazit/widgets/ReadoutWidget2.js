import $ from '$';
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import BaseWidget from './BaseWidget';
import OntologyTypeWidget from './OntologyTypeWidget';
import HelpButtonWidget from './HelpButtonWidget';

import {
    renderSelectMultiWidget,
    renderSelectSingleWidget,
    renderSelectMultiOptgroupWidget,
    ConcentrationResponseTab,
    BMCTab,
    IntegrativeAnalysesTab,
    integrative_Granular,
    integrative_General,
} from '../shared';

class ReadoutWidget extends BaseWidget {
    /*
    ReadoutWidget requires the following state properties:
    */

    constructor(props) {
        super(props);

        this.state = {
            showHelpText: false,
        };
    }

    mapFun = (r) => {
        return {
            ...r,
            key: r.seazit_protocol_id,
            label: r.protocol_name_long,
        };
    };

    _renderSingleDatasetSelector(state, renderHelpButtonWidget, renderHelpText) {
        let options = _.chain(state.protocol_data)
            .map(this.mapFun)
            .sortBy('seazit_protocol_id')
            .value();

        return renderSelectSingleWidget(
            'assays',
            'dataset',
            options,
            state.assays,
            this.handleSelectChange,
            renderHelpButtonWidget,
            renderHelpText
        );
    }

    _renderMultipleDatasetSelector(state) {
        let options = _.chain(state.protocol_data)
            .map(this.mapFun)
            .sortBy('seazit_protocol_id')
            .value();

        // const helpText = this._renderHelpText();
        const renderHelpText = () => {
            if (!this.state.showHelpText) {
                return null;
            }

            return (
                <div className="alert alert-info">
                    <p>
                        Study abbreviations: Dose range finding study = DRF and Definitive study =
                        Def. Note: there is no limit to the number of datasets you can select. More
                        information can be found on the
                        <a href="https://ods.ntp.niehs.nih.gov/seazit/dataset/"> Datasets page</a>.
                    </p>
                </div>
            );
        };
        const renderHelpButtonWidget = () => {
            return (
                <HelpButtonWidget
                    stateHolder={this}
                    headLevel={'label'}
                    title={'Click to toggle help-text'}
                />
            );
        };
        switch (state.tabFlag) {
            case ConcentrationResponseTab:
                return renderSelectMultiWidget(
                    'assays',
                    'dataset',
                    options,
                    state.assays,
                    this.handleSelectMultiChange
                );
            case BMCTab:
            case IntegrativeAnalysesTab:
                return (
                    <div>
                        {renderSelectMultiWidget(
                            'assays',
                            'dataset',
                            options,
                            state.assays,
                            this.handleSelectMultiChange,
                            renderHelpButtonWidget,
                            renderHelpText
                        )}
                    </div>
                );
            default:
                // Default action or other cases
                return null;
        }
    }

    _renderFilterBy(state) {
        if (state.assays.length === 0) {
            return null;
        }
        return (
            <div>
                <label>Filter endpoints by:</label>
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

    _renderMultipleEndpointSelector(state) {
        //console.log(state.assays);
        let assays = Array.isArray(state.assays)
            ? state.assays.map((item) => Number(item))
            : [Number(state.assays)];
        let opts = null;
        let endPointFilterFun = null;
        let endPointSortFun = null;
        let keyFunction = null;
        let groupBy = null;
        switch (state.tabFlag) {
            case ConcentrationResponseTab:
                // group by category,
                // no endpoint filter function,
                //   Sort endpoint, put 'Mortality@24',      'Mortality@120',  'MalformedAny+Mort@120' be first 3 endpoints.
                groupBy = 'category';
                endPointSortFun = (e) =>
                    !['Mortality@24', 'Mortality@120', 'MalformedAny+Mort@120'].includes(e.label);
                break;
            case BMCTab:
                // group by 'developmental_defect_grouping_granular' or 'developmental_defect_grouping_general',
                //  endpoint filter out, 'Mortality@24', 'Mortality@120', endpoint contains @24
                //  no sort function.
                endPointFilterFun = (r) =>
                    !['Mortality@120', 'Mortality@24', '@24'].some((term) =>
                        r.endpoint_name.includes(term)
                    );
                groupBy =
                    state.ontologyType === integrative_Granular
                        ? 'developmental_defect_grouping_granular'
                        : 'developmental_defect_grouping_general';
                keyFunction = (key) => (key === 'null' ? '(no labels)' : key);
                break;
            case IntegrativeAnalysesTab:
                break;
            default:
                return null;
        }
        opts = _.chain(state.Seazit_ui_panel)
            .filter((r) => {
                // I used to use _.includes(). I found this is wrong. if assays is double digits ex: 10,
                // it will includes  [1, 10]
                return _.includes(assays, r.seazit_protocol_id);
            })
            .filter(endPointFilterFun)
            .map((r) => {
                return {
                    ...r,
                    key: r.endpoint_name_protocol,
                    category: r.protocol_name_plot,
                    label: r.endpoint_name,
                    description: r.endpoint_description,
                };
            })
            .sortBy('label')
            .sortBy(endPointSortFun)
            .groupBy(groupBy)
            .mapValues((group) => _.uniqBy(group, 'key'))
            .thru((result) =>
                keyFunction ? _.mapKeys(result, (value, key) => keyFunction(key)) : result
            )
            .toPairs()
            .orderBy(0) // Sort by the group key (the first element in each pair)
            .fromPairs()
            .value();
        // console.log(endPointFilterFun)
        // console.log('state.Seazit_ui_panel', state.Seazit_ui_panel);
        // console.log(opts)
        if (_.keys(opts).length === 0) {
            return null;
        }
        return renderSelectMultiOptgroupWidget(
            'readouts',
            'endpoint',
            opts,
            state.readouts,
            this.handleSelectMultiChange
        );
    }

    render() {
        let state = this.props.stateHolder.state;
        switch (state.tabFlag) {
            case ConcentrationResponseTab:
                return (
                    <div>
                        {this._renderMultipleDatasetSelector(state)}
                        <br />
                        {this._renderMultipleEndpointSelector(state)}
                    </div>
                );

            case BMCTab:
                return (
                    <div>
                        {this._renderSingleDatasetSelector(state)}
                        <br />
                        {this._renderFilterBy(state)}
                        {this._renderMultipleEndpointSelector(state)}
                    </div>
                );
            case IntegrativeAnalysesTab:
                return <div>{this._renderMultipleDatasetSelector(state)}</div>;
        }
    }
}

ReadoutWidget.propTypes = {
    stateHolder: PropTypes.instanceOf(React.Component).isRequired,
    hideViability: PropTypes.bool.isRequired,
    hideNonViability: PropTypes.bool.isRequired,
    multiAssaySelector: PropTypes.bool.isRequired,
    multiReadoutSelector: PropTypes.bool.isRequired,
};

export default ReadoutWidget;
