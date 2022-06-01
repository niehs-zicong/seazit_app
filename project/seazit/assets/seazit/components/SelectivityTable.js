import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import BootstrapModal from 'utils/BootstrapModal';
import { Header, SingleCurveBody } from './DoseResponseModal';

import { printFloat } from '../shared';
import { forEach } from 'underscore';

let renderMedPodModal = function(jsonData, flag) {
    if (!jsonData) {
        // match button padding-left
        return <span style={{ paddingLeft: 12 }}>-</span>;
    }
    // console.log(jsonData)
    let showModal = () => {
        new BootstrapModal(Header, SingleCurveBody, {
            // title: `${d.preferred_name} (${d.chemical_casrn}): ${d.readout_endpoint}`,
            title: jsonData.preferred_name + `: ` + jsonData.endpoint_name,
            protocol_id: jsonData.protocol_id,
            readout_id:
                flag == 'pod_med'
                    ? jsonData.endpoint_name + '_' + jsonData.protocol_id
                    : 'Mortality@120' + '_' + jsonData.protocol_id,
            casrn: jsonData.casrn,
        });
    };
    let med_result, min_med_result, max_med_result;

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

class SelectivityTable extends React.Component {
    _renderHyperLinkModel(d) {
        console.log(d);
        let jsonData2 = ['ZP:1', 'ZP:2', 'ZP:3'];
    }

    _renderRow(d) {
        return (
            <tr key={d.casrn}>
                <td>{d.preferred_name}</td>
                <td>{d.casrn}</td>
                <td>{d.use_category1}</td>
                <td>{d.malformation}</td>
                <td>
                    {d.combin_ontology.map((value, index) => {
                        return <li key={`index-${index}`}>{value}</li>;
                    })}
                </td>
                <td>
                    {d.combin_ontology_id.map((value, index) => {
                        return (
                            <li key={`index-${index}`}>
                                <a
                                    href={`https://www.ebi.ac.uk/ols/ontologies/zp/terms?iri=http%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F${value
                                        .toString()
                                        .split(':')
                                        .join('_')}`}
                                    target="_blank"
                                >
                                    {value}
                                </a>
                            </li>
                        );
                    })}
                </td>
                <td>{printFloat(Math.pow(10, d.mean_pod) * 1000000)}</td>
                <td>{printFloat(d.mean_selectivity)}</td>
                <td>{d.n_values}</td>
                <td>{renderMedPodModal(d, 'mort_pod_med')}</td>
            </tr>
        );
    }

    render() {
        if (this.props.data.length === 0) {
            return null;
        }
        let medData = this.props.data;
        return (
            <div>
                <table id="IA_table01" ref="table" className="table table-condensed table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: '20%' }}>Chemical</th>
                            <th style={{ width: '20%' }}>CASRN</th>
                            <th style={{ width: '20%' }}>Category</th>
                            <th style={{ width: '20%' }}>Malformation</th>
                            <th style={{ width: '20%' }}>Ontology term</th>
                            <th style={{ width: '20%' }}>Ontology ID</th>
                            <th style={{ width: '20%' }}>Malformation BMC</th>
                            <th style={{ width: '20%' }}>Selectivity</th>
                            <th style={{ width: '20%' }}>Number of curves evaluated</th>
                            <th style={{ width: '20%' }}>
                                Mortality BMC
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

SelectivityTable.propTypes = {
    data: PropTypes.array.isRequired,
};

export default SelectivityTable;
