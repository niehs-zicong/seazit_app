import $ from '$';
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import BaseWidget from './BaseWidget';
import OntologyTypeWidget from './OntologyTypeWidget';

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
    }

    mapFun = (r) => {
        return {
            ...r,
            key: r.seazit_protocol_id,
            label: r.protocol_name_long,
        };
    };

    _renderSingleDatasetSelector(state) {
        let options = _.chain(state.protocol_data)
            .map(this.mapFun)
            .sortBy('seazit_protocol_id')
            .value();

        return renderSelectSingleWidget(
            'assays',
            'dataset',
            options,
            state.assays,
            this.handleSelectChange
        );
    }

    _renderMultipleDatasetSelector(state) {
        let options = _.chain(state.protocol_data)
            .map(this.mapFun)
            .sortBy('seazit_protocol_id')
            .value();

        return renderSelectMultiWidget(
            'assays',
            'dataset',
            options,
            state.assays,
            this.handleSelectMultiChange
        );
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

    _renderMultipleEndpointSelector(state) {
        //console.log(state.assays);
        let assays = Array.isArray(state.assays)
                ? state.assays.map((item) => Number(item))
                : [Number(state.assays)],
            opts,
            ontologyGroup,
            endPointFilterFun,
            groupBy;
        //console.log(assays);
        switch (state.tabFlag) {
            case ConcentrationResponseTab:
                groupBy = 'category';
                endPointFilterFun = (r) => {
                    return r;
                };
                break;
            case BMCTab:
                endPointFilterFun = (r) => {
                    return (
                        r.endpoint_name !== 'Mortality@120' ||
                        r.endpoint_name !== 'Mortality@24' ||
                        r.endpoint_name.includes('@24')
                    );
                };
                if (state.ontologyType === integrative_Granular) {
                    groupBy = 'developmental_defect_grouping_granular';
                } else {
                    groupBy = 'developmental_defect_grouping_general';
                }
                break;
            case IntegrativeAnalysesTab:
                endPointFilterFun = (r) => {
                    return (
                        r.endpoint_name !== 'Mortality@120' ||
                        r.endpoint_name !== 'Mortality@24' ||
                        r.endpoint_name.includes('@24')
                    );
                };
                if (state.ontologyType === integrative_Granular) {
                    groupBy = 'developmental_defect_grouping_granular';
                } else {
                    groupBy = 'developmental_defect_grouping_general';
                }
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
                    key: r.endpoint_name_protocol.toString(),
                    category: r.protocol_name_plot,
                    label: r.endpoint_name,
                    description: r.endpoint_description,
                };
            })
            // .uniqBy('key')
            .sortBy('label')
            .sortBy(function(e) {
                return (
                    'Mortality@24' !== e.label &&
                    'Mortality@120' !== e.label &&
                    'MalformedAny+Mort@120' !== e.label
                );
            })
            .groupBy(groupBy)
            .mapValues((group) => _.uniqBy(group, 'key'))
            .value();
        // //console.log('state.Seazit_ui_panel', state.Seazit_ui_panel, opts);
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
