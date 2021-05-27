import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import BaseWidget from './BaseWidget';

import { renderSelectMultiWidget } from '../shared';

class ReadoutCategoryWidget extends BaseWidget {
    _renderReadoutGroupSelector(state) {
        let options = _.chain(state.tbl_readouts)
            .map('provider_category')
            .uniq()
            .map((r) => {
                return {
                    key: r,
                    label: r,
                };
            })
            .sortBy('label')
            .value();

        return renderSelectMultiWidget(
            'readoutCategories',
            'endpoint category',
            options,
            state.readoutCategories,
            this.handleSelectMultiChange
        );
    }

    render() {
        let state = this.props.stateHolder.state;
        return this._renderReadoutGroupSelector(state);
    }
}

ReadoutCategoryWidget.propTypes = {
    stateHolder: PropTypes.instanceOf(React.Component).isRequired,
};

export default ReadoutCategoryWidget;
