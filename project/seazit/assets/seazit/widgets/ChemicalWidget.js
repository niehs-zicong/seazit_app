import $ from '$';
import _ from 'lodash';
import React from 'react';
import BaseWidget from './BaseWidget';

import {
    CHEMFILTER_CATEGORY,
    CHEMFILTER_CHEMICIAL,
    CHEMLIST_80,
    CHEMLIST_91,
    CHEMLIST_ALL,
    URL_CHEMXLSX,
    renderSelectMultiWidget,
    renderSelectMultiOptgroupWidget,
} from '../shared';

class ChemicalWidget extends BaseWidget {
    /*
    ChemicalWidget requires the following state properties:
        - chemList (enum)
        - chemicalFilterBy (enum)
        - chemicals (list of str)
        - categories (list of str)
    */

    constructor(props) {
        super(props);
        this.handleChemlistChange = this.handleChemlistChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
    }

    _getSelectedChemicals(substances, categories, chemList) {
        return _.chain(substances)
            .filter((r) => {
                return _.includes(categories, r.chemical__category_id);
            })
            .filter((r) => {
                if (chemList === CHEMLIST_80) {
                    return r.chemical__ntp80;
                } else if (chemList === CHEMLIST_91) {
                    return r.chemical__ntp91;
                } else {
                    return true;
                }
            })
            .map('chemical__casrn')
            .uniq()
            .value();
    }

    handleChemlistChange(e) {
        let d = {},
            state = this.props.stateHolder.state,
            value = parseInt(e.target.value);

        d[e.target.name] = value;

        // also update chemicals based on chemfilters
        d['chemicals'] = this._getSelectedChemicals(state.tbl_substances, state.categories, value);

        this.props.stateHolder.setState(d);
    }

    handleCategoryChange(e) {
        let d = {},
            vals = $(e.target).val(),
            state = this.props.stateHolder.state;

        d[e.target.name] = vals;

        // also update chemicals based on chemfilters
        d['chemicals'] = this._getSelectedChemicals(state.tbl_substances, vals, state.chemList);

        this.props.stateHolder.setState(d);
    }

    _renderFilterBy(state) {
        return (
            <div>
                <label>Filter chemicals zw1 by: </label>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="chemicalFilterBy"
                            onChange={this.handleRadioChange}
                            value={CHEMFILTER_CATEGORY}
                            checked={state.chemicalFilterBy === CHEMFILTER_CATEGORY}
                        />
                        Category
                    </label>

                    <span style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>|</span>

                    <label>
                        <input
                            type="radio"
                            name="chemicalFilterBy"
                            onChange={this.handleRadioChange}
                            value={CHEMFILTER_CHEMICIAL}
                            checked={state.chemicalFilterBy === CHEMFILTER_CHEMICIAL}
                        />
                        Name
                    </label>
                </div>
            </div>
        );
    }

    _renderSelector(state) {
        let filterInChemlist = (r) => {
                switch (state.chemList) {
                    case CHEMLIST_80:
                        return r.chemical__ntp80;
                    case CHEMLIST_91:
                        return r.chemical__ntp91;
                    default:
                        return true;
                }
            },
            opts;

        if (state.chemicalFilterBy === CHEMFILTER_CHEMICIAL) {
            opts = _.chain(state.Seazit_chemical_info)
                .groupBy('preferred_name')
                .values()
                .map((r) => r[0])
                // .filter(filterInChemlist)
                .sortBy('preferred_name')
                // .sortBy('chemical__category_id')
                .map((r) => {
                    return {
                        // category: null,
                        key: r.casrn,
                        label: `${r.preferred_name} (${r.casrn})`,
                    };
                })
                .groupBy('category')
                .value();

            return renderSelectMultiOptgroupWidget(
                'chemicals',
                'chemical zw5',
                opts,
                state.chemicals,
                this.handleSelectMultiChange
            );
        } else {
            opts = _.chain(state.tbl_substances)
                .filter(filterInChemlist)
                .map('chemical__category_id')
                .uniq()
                .map((r) => {
                    return {
                        key: r,
                        label: r,
                    };
                })
                .sortBy('key')
                .value();

            return renderSelectMultiWidget(
                'categories',
                'category zw4',
                opts,
                state.categories,
                this.handleCategoryChange
            );
        }
    }

    render() {
        let state = this.props.stateHolder.state;

        return (
            <div className="clearfix">
                {this._renderFilterBy(state)}
                {this._renderSelector(state)}
                <p className="help-block">
                    <a
                        className="btn btn-default btn-sm pull-right"
                        style={{ marginTop: 5 }}
                        href={URL_CHEMXLSX}
                    >
                        <i className="fa fa-file-excel-o" />
                        &nbsp; View categories
                    </a>
                    * compounds with evidence of NT/DNT in literature
                </p>
            </div>
        );
    }
}

export default ChemicalWidget;
