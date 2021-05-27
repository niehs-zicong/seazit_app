import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import BootstrapModal from 'utils/BootstrapModal';
import { Header, SingleCurveBody } from './DoseResponseModal';

import { printFloat, SELECTIVITY_FOOTNOTE } from '../shared';

let showSelectivityValue = function(d) {
        if (d.maximumSelectivity && !d.minimimumNonViability.has_viability_bmd) {
            return (
                <span>
                    ≥{printFloat(d.maximumSelectivity)}
                    <sup>†</sup>
                </span>
            );
        } else if (d.maximumSelectivity) {
            return printFloat(d.maximumSelectivity);
        } else {
            return '-';
        }
    },
    renderBmdModal = function(jsonData) {
        if (!jsonData) {
            // match button padding-left
            return <span style={{ paddingLeft: 12 }}>-</span>;
        }

        let showModal = () => {
            new BootstrapModal(Header, SingleCurveBody, {
                title: `${jsonData.chemical_name} (${jsonData.chemical_casrn}): ${
                    jsonData.readout_endpoint
                }`,
                readout_id: jsonData.readout_id,
                casrn: jsonData.chemical_casrn,
            });
        };

        return (
            <button className="btn btn-link" onClick={showModal}>
                {printFloat(jsonData.bmd)}
            </button>
        );
    };

class SelectivityTable extends React.Component {
    _renderRow(d) {
        return (
            <tr key={d.chemical_casrn}>
                <td>{d.chemical_name}</td>
                <td>{d.chemical_casrn}</td>
                <td>{d.chemical_category}</td>
                <td>{renderBmdModal(d.minimimumNonViability)}</td>
                <td>{renderBmdModal(d.minimimumViability)}</td>
                <td>{showSelectivityValue(d)}</td>
            </tr>
        );
    }

    render() {
        if (this.props.data.length === 0) {
            return null;
        }

        let selectives = _.chain(this.props.data)
                .filter((d) => d.maximumSelectivity > 0)
                .sortBy((d) => -d.maximumSelectivity)
                .value(),
            noNonViabilityBmd = this.props.data.filter((d) => d.maximumSelectivity === null);

        return (
            <div>
                <table ref="table" className="table table-condensed table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: '20%' }}>Chemical</th>
                            <th style={{ width: '15%' }}>CASRN</th>
                            <th style={{ width: '17%' }}>Category</th>
                            <th style={{ width: '16%' }}>Minimum nonviability BMC</th>
                            <th style={{ width: '16%' }}>Minimum viability BMC</th>
                            <th style={{ width: '16%' }}>Selectivity ratio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectives.map(this._renderRow)}
                        {noNonViabilityBmd.map(this._renderRow)}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="6">
                                *&nbsp;Chemical is a known developmental neurotoxicant from
                                literature<br />
                                <sup>†</sup>&nbsp;{SELECTIVITY_FOOTNOTE}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    }
}

SelectivityTable.propTypes = {
    data: PropTypes.array.isRequired,
};

export default SelectivityTable;
