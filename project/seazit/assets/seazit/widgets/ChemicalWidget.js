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

    // _getSelectedChemicals(substances, categories, chemList) {
    //     return _.chain(substances)
    //         .filter((r) => {
    //             return _.includes(categories, r.chemical__category_id);
    //         })
    //         .map('chemical__casrn')
    //         .uniq()
    //         .value();
    // }

    handleChemlistChange(e) {
        // let d = {},
        //     state = this.props.stateHolder.state,
        //     value = parseInt(e.target.value);
        //
        // d[e.target.name] = value;
        //
        // // also update chemicals based on chemfilters
        // d['chemicals'] = this._getSelectedChemicals(state.tbl_substances, state.categories, value);
        //
        // this.props.stateHolder.setState(d);
    }

    handleCategoryChange(e) {
        let d = {},
            vals = $(e.target).val(),
            state = this.props.stateHolder.state;
        d[e.target.name] = vals;
        // also update chemicals based on chemfilters
        // d['casrn'] =  _.chain(state.Seazit_chemical_info)
        d['chemicals'] = _.chain(state.Seazit_chemical_info)

            .filter((r) => {
                return _.includes(vals, r.use_category1);
            })
            .map('casrn')
            .uniq()
            .value();
        this.props.stateHolder.setState(d);
    }

    _renderFilterBy(state) {
        return (
            <div>
                <label>Filter chemicals by: </label>
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
        let opts;

        if (state.chemicalFilterBy === CHEMFILTER_CHEMICIAL) {
            opts = _.chain(state.Seazit_chemical_info)
                .groupBy('preferred_name')
                .values()
                .map((r) => r[0])
                .sortBy('preferred_name')
                .map((r) => {
                    return {
                        category: 'Chemical Names',
                        key: r.casrn,
                        label: `${r.preferred_name} (${r.casrn})`,
                    };
                })
                .groupBy('category')
                .value();

            return renderSelectMultiOptgroupWidget(
                // return renderSelectMultiWidget(
                'chemicals',
                'chemical',
                opts,
                state.chemicals,
                this.handleSelectMultiChange
            );
            // return renderSelectMultiWidget(
            //     'chemicals',
            //     'chemical',
            //     opts,
            //     state.chemicals,
            //     this.handleCategoryChange
            // )
        } else {
            opts = _.chain(state.Seazit_chemical_info)
                .groupBy('use_category1')
                .values()
                .map((r) => r[0])
                .sortBy('use_category1')
                // .uniq()
                .map((r) => {
                    return {
                        key: r.use_category1,
                        label: r.use_category1,
                    };
                })
                // .sortBy('key')
                .value();
            return renderSelectMultiWidget(
                'categories',
                'category zw3',
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
