import $ from '$';
import _ from 'lodash';
import React from 'react';
import BaseWidget from './BaseWidget';
import styles from '../style.css';

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
import HelpButtonWidget from './HelpButtonWidget';

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

        this.state = {
            showHelpText: false,
        };
        this.handleChemlistChange = this.handleChemlistChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
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

    _renderHelpText() {
        if (!this.state.showHelpText) {
            return null;
        }
        return (
            <div className="alert alert-info">
                <p>
                    More information on use categories and test substance name can be found on{' '}
                    <a href="https://ods.ntp.niehs.nih.gov/seazit/dataset/">Datasets page</a>.
                </p>
            </div>
        );
    }

    _renderFilterBy(state) {
        return (
            <div>
                <label className={styles.labelHorizontal}>
                    Filter test substance by:
                    <HelpButtonWidget
                        stateHolder={this}
                        headLevel={'label'}
                        title={'More information on use categories and test substance names'}
                    />
                </label>
                {this._renderHelpText()}

                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="chemicalFilterBy"
                            onChange={this.handleRadioChange}
                            value={CHEMFILTER_CATEGORY}
                            checked={state.chemicalFilterBy === CHEMFILTER_CATEGORY}
                        />
                        Use category
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
                        Name (CASRN)
                    </label>
                </div>
            </div>
        );
    }

    _renderSelector(state) {
        let opts;
        if (state.chemicalFilterBy === CHEMFILTER_CHEMICIAL) {
            opts = _.chain(state.Seazit_chemical_info)
                .filter((r) => r.use_category1 !== 'Vehicle Control') // Filter out data with use_category1 equal to 'Vehicle Control'
                .groupBy('preferred_name')
                .values()
                .map((r) => r[0])
                .sortBy('preferred_name')
                .map((r) => {
                    return {
                        // category: 'Chemical Names',
                        category: r.use_category1,
                        key: r.casrn,
                        label: `${r.preferred_name} (${r.casrn})`,
                    };
                })
                .groupBy('category')
                .value();
            return renderSelectMultiOptgroupWidget(
                'chemicals',
                'chemical',
                opts,
                state.chemicals,
                this.handleSelectMultiChange
            );
        } else {
            opts = _.chain(state.Seazit_chemical_info)
                .filter((r) => r.use_category1 !== 'Vehicle Control') // Filter out data with use_category1 equal to 'Vehicle Control'
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
                'category',
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
            </div>
        );
    }
}

export default ChemicalWidget;
