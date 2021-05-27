import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import BootstrapModal from 'utils/BootstrapModal';
import { Header, SingleCurveBody } from './DoseResponseModal';

import { printFloat } from '../shared';

let renderBmdModal = function(jsonData) {
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

    let bmdl = jsonData.bmdl ? printFloat(jsonData.bmdl) : 'NR',
        bmdu = jsonData.bmdu ? printFloat(jsonData.bmdu) : 'NR';

    return (
        <button className="btn btn-link" onClick={showModal} style={{ textAlign: 'left' }}>
            {printFloat(jsonData.bmd)}
            <br />
            ({bmdl} – {bmdu})
        </button>
    );
};

class BmdTable extends React.Component {
    _renderRow(d) {
        return (
            <tr key={d.chemical_casrn}>
                <td>{d.chemical_name}</td>
                <td>{d.chemical_casrn}</td>
                <td>{d.chemical_category}</td>
                <td>{renderBmdModal(d.minimimumNonViability)}</td>
                <td>{renderBmdModal(d.minimimumViability)}</td>
            </tr>
        );
    }

    render() {
        if (this.props.data.length === 0) {
            return null;
        }

        let zeroes = _.filter(this.props.data, (d) => d.minimumBmd <= 0),
            nonzeroes = _.chain(this.props.data)
                .filter((d) => d.minimumBmd > 0)
                .sortBy('minimumBmd')
                .value();

        return (
            <div>
                <table ref="table" className="table table-condensed table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: '20%' }}>Chemical</th>
                            <th style={{ width: '20%' }}>CASRN</th>
                            <th style={{ width: '20%' }}>Category</th>
                            <th style={{ width: '20%' }}>
                                Minimum nonviability BMC<br />(BMCL – BMCU)
                            </th>
                            <th style={{ width: '20%' }}>
                                Minimum viability BMC<br />(BMCL – BMCU)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {nonzeroes.map(this._renderRow)}
                        {zeroes.map(this._renderRow)}
                    </tbody>
                </table>
            </div>
        );
    }
}

BmdTable.propTypes = {
    data: PropTypes.array.isRequired,
};

export default BmdTable;
