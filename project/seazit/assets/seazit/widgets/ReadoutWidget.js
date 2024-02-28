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
    loadBaseUrl,
} from '../shared';
import styles from '../style.css';

class ReadoutWidget extends BaseWidget {
    /*
    ReadoutWidget requires the following state properties:
    */

    constructor(props) {
        super(props);

        this.state = {
            showHelpText: false,
            showCategoryHelpText: null,
            showDatasetHelpText: false,
            showEndpointHelpText: false,
        };
    }

    mapFun = (r) => {
        return {
            ...r,
            key: r.seazit_protocol_id,
            label: r.protocol_name_long,
            // description: 'zw1',
            description: r.protocol_name_plot,
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

    _renderMultipleDatasetSelector(state, renderHelpButtonWidget, renderHelpText) {
        let options = _.chain(state.protocol_data)
            .map(this.mapFun)
            .sortBy('seazit_protocol_id')
            .value();

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
    }

    _renderFilterBy(state, renderHelpButtonWidget, renderHelpText) {
        if (state.assays.length === 0) {
            return null;
        }
        return (
            <div>
                <label className={styles.labelHorizontal}>
                    Filter endpoints by:
                    {renderHelpButtonWidget && renderHelpButtonWidget()}
                </label>
                {renderHelpText && renderHelpText()}
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

    _renderMultipleEndpointSelector(state, renderHelpButtonWidget, renderHelpText) {
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
                    // description: 'zw2',
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

        if (_.keys(opts).length === 0) {
            return null;
        }
        return renderSelectMultiOptgroupWidget(
            'readouts',
            'endpoint',
            opts,
            state.readouts,
            this.handleSelectMultiChange,
            renderHelpButtonWidget,
            renderHelpText
        );
    }

    render() {
        // loadBaseUrl(this);

        let state = this.props.stateHolder.state;

        let DatasetHelpText = null;
        let EndpointtHelpText = null;
        let DatasetHelpButtonWidget = null;
        let EndpointHelpButtonWidget = null;

        switch (state.tabFlag) {
            case ConcentrationResponseTab:
                DatasetHelpButtonWidget = () => {
                    return (
                        <HelpButtonWidget
                            stateHolder={this}
                            headLevel={'label'}
                            title={'Information on datasets which can be selected for comparison'}
                            contentId="datasetHelp"
                        />
                    );
                };

                DatasetHelpText = () => {
                    if (!this.state.showDatasetHelpText) {
                        return null;
                    }
                    return (
                        <div className="alert alert-info">
                            <p>
                                The short name of the dataset will appear by hovering over the text.
                                Study abbreviations: Dose range finding study = DRF and Definitive
                                study = Def. Note that there is no limit to the number of datasets
                                you can select. More information can be found on the
                                {/*<a href="https://ods.ntp.niehs.nih.gov/seazit/dataset/">*/}
                                <a href={loadBaseUrl('/seazit/dataset/')}>
                                    {/*<a href={state.dynamicUrl + "/seazit/dataset/"}>*/} Datasets
                                    page
                                </a>
                                .
                            </p>
                        </div>
                    );
                };

                EndpointHelpButtonWidget = () => {
                    return (
                        <HelpButtonWidget
                            stateHolder={this}
                            headLevel={'label'}
                            title={'More information on endpoints'}
                            contentId="endpointHelp"
                        />
                    );
                };

                EndpointtHelpText = () => {
                    if (!this.state.showEndpointHelpText) {
                        return null;
                    }
                    return (
                        <div className="alert alert-info">
                            <p>
                                Hover over each endpoint for a description (including the associated
                                ontology terms). Each endpoint is derived from mortality score at
                                two time points (24 and 120 hours post fertilization (hpf)) or in
                                combination with each laboratory specific recording term.
                                MalformedAny refers to the percent of affected embryo (either
                                mortality or malformation). See
                                {/*<a href="https://ods.ntp.niehs.nih.gov/seazit/dataset/">*/}
                                {/*<a href={this.state.dynamicUrl + "/seazit/dataset/"}>*/}
                                <a href={loadBaseUrl('/seazit/dataset/')}> Datasets page</a> for
                                more information.
                            </p>
                            <br />
                            <p>
                                All endpoints must be selected individually and are organized by
                                dataset name.
                            </p>
                        </div>
                    );
                };
                return (
                    <div>
                        {this._renderMultipleDatasetSelector(
                            state,
                            DatasetHelpButtonWidget,
                            DatasetHelpText
                        )}
                        <br />
                        {this._renderMultipleEndpointSelector(
                            state,
                            EndpointHelpButtonWidget,
                            EndpointtHelpText
                        )}
                    </div>
                );
            case BMCTab:
                // stateholder

                DatasetHelpButtonWidget = () => {
                    return (
                        <HelpButtonWidget
                            stateHolder={this}
                            headLevel={'label'}
                            title={'Information on datasets'}
                            contentId="datasetHelp"
                        />
                    );
                };
                DatasetHelpText = () => {
                    if (!this.state.showDatasetHelpText) {
                        return null;
                    }
                    return (
                        <div className="alert alert-info">
                            <p>
                                Study abbreviations: Dose range finding study = DRF and Definitive
                                study = Def. Note that only one dateset can be selected at one time.
                                More information can be found on the
                                {/*<a href="https://ods.ntp.niehs.nih.gov/seazit/dataset/">*/}
                                {/*<a href={this.state.dynamicUrl + "/seazit/dataset/"}>*/}
                                <a href={loadBaseUrl('/seazit/dataset/')}> Datasets page</a>.
                            </p>
                        </div>
                    );
                };

                EndpointHelpButtonWidget = () => {
                    return (
                        <HelpButtonWidget
                            stateHolder={this}
                            headLevel={'label'}
                            title={'More information on endpoints'}
                            contentId="endpointHelp"
                        />
                    );
                };

                EndpointtHelpText = () => {
                    if (!this.state.showEndpointHelpText) {
                        return null;
                    }
                    return (
                        <div className="alert alert-info">
                            <p>
                                Detailed recordings of each laboratory are grouped into
                                corresponding higher level developmental defect phenotype groups. We
                                created two types of developmental defect phenotypes, the general
                                grouping and the granular grouping. See
                                {/*<a href="https://ods.ntp.niehs.nih.gov/seazit/dataset/">*/}
                                {/*<a href={this.state.dynamicUrl + "/seazit/dataset/"}>*/}
                                <a href={loadBaseUrl('/seazit/dataset/')}> Datasets page</a> for
                                more information.
                            </p>
                        </div>
                    );
                };
                return (
                    <div>
                        {this._renderSingleDatasetSelector(
                            state,
                            DatasetHelpButtonWidget,
                            DatasetHelpText
                        )}
                        <br />
                        {this._renderFilterBy(state, EndpointHelpButtonWidget, EndpointtHelpText)}
                        {this._renderMultipleEndpointSelector(state)}
                    </div>
                );

            case IntegrativeAnalysesTab:
                DatasetHelpText = () => {
                    if (!this.state.showHelpText) {
                        return null;
                    }
                    return (
                        <div className="alert alert-info">
                            <p>
                                Study abbreviations: Dose range finding study = DRF and Definitive
                                study = Def. Note: there is no limit to the number of datasets you
                                can select. More information can be found on the
                                {/*<a href="https://ods.ntp.niehs.nih.gov/seazit/dataset/">*/}
                                <a href={loadBaseUrl('/seazit/dataset/')}> Datasets page</a>.
                            </p>
                        </div>
                    );
                };
                DatasetHelpButtonWidget = () => {
                    return (
                        <HelpButtonWidget
                            stateHolder={this}
                            headLevel={'label'}
                            title={'Click to toggle help-text'}
                        />
                    );
                };
                return (
                    <div>
                        {this._renderMultipleDatasetSelector(
                            state,
                            DatasetHelpButtonWidget,
                            DatasetHelpText
                        )}
                    </div>
                );
            default:
                // Default action or other cases
                return null;
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
