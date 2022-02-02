import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import BootstrapModal from 'utils/BootstrapModal';
import { Header, SingleCurveBody } from './DoseResponseModal';

import { printFloat } from '../shared';

let renderMedPodModal = function(jsonData, flag) {
    if (!jsonData) {
        // match button padding-left
        return <span style={{ paddingLeft: 12 }}>-</span>;
    }
    let showModal = () => {
        new BootstrapModal(Header, SingleCurveBody, {
            // title: `${d.preferred_name} (${d.chemical_casrn}): ${d.readout_endpoint}`,
            title: `zw`,
            protocol_id: jsonData.protocol_id,

            // TODO. Sort colorful dot and black dot. Black dot is mortilaty@120.
            readout_id: jsonData.endpoint_name + '_' + jsonData.protocol_id,
            casrn: jsonData.casrn,
        });
    };
    let med_result, min_med_result, max_med_result;
    let result;

    if (flag == 'pod_med') {
        (med_result = jsonData.med_pod_med
            ? printFloat(Math.pow(10, jsonData.med_pod_med) * 1000000)
            : '-'),
            (min_med_result = jsonData.min_pod_med
                ? printFloat(Math.pow(10, jsonData.min_pod_med) * 1000000)
                : ''),
            (max_med_result = jsonData.max_pod_med
                ? printFloat(Math.pow(10, jsonData.max_pod_med) * 1000000)
                : '');
    } else {
        (med_result = jsonData.mort_med_pod_med
            ? printFloat(Math.pow(10, jsonData.mort_med_pod_med) * 1000000)
            : '-'),
            (min_med_result = jsonData.mort_min_pod_med
                ? printFloat(Math.pow(10, jsonData.mort_min_pod_med) * 1000000)
                : ''),
            (max_med_result = jsonData.mort_max_pod_med
                ? printFloat(Math.pow(10, jsonData.mort_max_pod_med) * 1000000)
                : '');
    }
    return (
        <button className="btn btn-link" onClick={showModal} style={{ textAlign: 'left' }}>
            {med_result}
            <br />({min_med_result} – {max_med_result})
        </button>
    );
};

class BmdTable extends React.Component {
    _renderRow(d) {
        return (
            <tr key={d.casrn}>
                <td>{d.preferred_name}</td>
                <td>{d.casrn}</td>
                <td>{d.use_category1}</td>
                {/*<td>{d.med_pod_med}</td>*/}
                <td>{renderMedPodModal(d, 'pod_med')}</td>
                <td>{renderMedPodModal(d, 'mort_pod_med')}</td>
            </tr>
        );
    }

    render() {
        if (this.props.data.length === 0) {
            return null;
        }
        console.log(this.props.data);

        let medData, pod_medData, mort_pod_medData;
        medData = _.sortBy(this.props.data.bmc_min_max_result, 'med_pod_med');
        return (
            <div>
                <table id="IA_table01" ref="table" className="table table-condensed table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: '20%' }}>Chemical</th>
                            <th style={{ width: '20%' }}>CASRN</th>
                            <th style={{ width: '20%' }}>Category</th>
                            <th style={{ width: '20%' }}>
                                Non-Mortality BMC (Median)
                                <br />
                                (Min – Max)
                            </th>
                            <th style={{ width: '20%' }}>
                                Mortality BMC (Median)
                                <br />
                                (Min – Max)
                            </th>
                        </tr>
                    </thead>
                    <tbody>{medData.map(this._renderRow)}</tbody>
                </table>
            </div>
        );
    }
}

BmdTable.propTypes = {
    data: PropTypes.array.isRequired,
};

export default BmdTable;
