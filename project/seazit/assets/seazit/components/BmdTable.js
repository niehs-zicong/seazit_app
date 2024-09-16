import React from 'react';
import PropTypes from 'prop-types';
import BootstrapModal from 'utils/BootstrapModal';
import { Header, SingleCurveBody } from './BootstrapBodyPart';
import { BMDVIZ_ACTIVITY, BMDVIZ_SELECTIVITY, pod_med_processed, printFloat } from '../shared';
import _ from 'lodash';

class BmdTable extends React.Component {
    constructor(props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
    }

    tableStyle = () => ({
        width: '20%',
        textAlign: 'center',
        verticalAlign: 'middle',
    });

    renderRow(d) {
        switch (this.props.visualization) {
            case BMDVIZ_ACTIVITY:
                return (
                    <tr key={d.casrn}>
                        <td>{d.preferred_name}</td>
                        <td>{d.casrn}</td>
                        <td>{d.use_category1}</td>
                        <td>{this.renderMortalityModal(d, 'NonMortality')}</td>
                        <td>{this.renderMortalityModal(d, 'Mortality')}</td>
                        <td>{d.n_values}</td>
                    </tr>
                );

            case BMDVIZ_SELECTIVITY:
                return (
                    <tr key={d.casrn}>
                        <td>{d.preferred_name}</td>
                        <td>{d.casrn}</td>
                        <td>{d.use_category1}</td>
                        <td>{d.malformation}</td>
                        <td>
                            <ul>
                                {Array.isArray(d.combin_ontology) &&
                                !d.combin_ontology.includes(null)
                                    ? d.combin_ontology.map((value, index) => {
                                          return <li key={`index-${index}`}>{value}</li>;
                                      })
                                    : '-'}
                            </ul>
                        </td>
                        <td>
                            <ul>
                                {Array.isArray(d.combin_ontology_id) &&
                                !d.combin_ontology_id.includes(null)
                                    ? d.combin_ontology_id.map((value, index) => {
                                          return (
                                              <li key={index}>
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
                                      })
                                    : '-'}
                            </ul>
                        </td>
                        <td>{d.n_values}</td>
                        <td>{printFloat(pod_med_processed(d.mean_pod))}</td>
                        <td>{this.renderMortalityModal(d, 'Mortality')}</td>
                        <td>{printFloat(d.mean_selectivity)}</td>
                    </tr>
                );

            default:
                return null;
        }
    }

    renderMortalityModal = function(jsonData, flag) {
        if (!jsonData) {
            // match button padding-left
            return <span style={{ paddingLeft: 12 }}>-</span>;
        }
        // console.log( jsonData,jsonData.minimimumNonViability, jsonData.minimimumViability)
        let showModal = () => {
            // console.log( jsonData)
            new BootstrapModal(Header, SingleCurveBody, {
                // title: `${d.preferred_name} (${d.chemical_casrn}): ${d.readout_endpoint}`,
                title:
                    flag == 'NonMortality'
                        ? jsonData.preferred_name +
                          `: ` +
                          jsonData.minimimumNonViability.endpoint_name
                        : jsonData.preferred_name + `: ` + 'Mortality@120',
                protocol_id: jsonData.protocol_id,
                readout_id:
                    flag == 'NonMortality'
                        ? jsonData.minimimumNonViability.endpoint_name + '_' + jsonData.protocol_id
                        : 'Mortality@120' + '_' + jsonData.protocol_id,
                casrn: jsonData.casrn,
                CheckBoxDisable: flag == 'NonMortality' ? false : true,
            });
        };
        let med_result, min_med_result, max_med_result, d;

        if (flag == 'NonMortality') {
            d = jsonData.minimimumNonViability;
            (med_result = d.med_pod_med ? printFloat(pod_med_processed(d.med_pod_med)) : '-'),
                (min_med_result = d.min_pod_med
                    ? printFloat(pod_med_processed(d.min_pod_med))
                    : ''),
                (max_med_result = d.max_pod_med
                    ? printFloat(pod_med_processed(d.max_pod_med))
                    : '');
        } else {
            d = jsonData.minimimumViability;
            (med_result = d.mort_med_pod_med
                ? printFloat(pod_med_processed(d.mort_med_pod_med))
                : '-'),
                (min_med_result = d.mort_min_pod_med
                    ? printFloat(pod_med_processed(d.mort_min_pod_med))
                    : ''),
                (max_med_result = d.mort_max_pod_med
                    ? printFloat(pod_med_processed(d.mort_max_pod_med))
                    : '');
        }
        return (
            <button className="btn btn-link" onClick={showModal} style={{ textAlign: 'left' }}>
                {med_result}
                <br />({min_med_result} – {max_med_result})
            </button>
        );
    };

    render() {
        if (this.props.data.length === 0) {
            return null;
        }
        let medData = this.props.data;

        switch (this.props.visualization) {
            case BMDVIZ_ACTIVITY:
                return (
                    <div>
                        <table id="IA_table01" ref="table" className=" table-condensed table-hover">
                            <thead>
                                <tr>
                                    <th style={this.tableStyle()}>Test substance</th>
                                    <th style={this.tableStyle()}>CASRN</th>
                                    <th style={this.tableStyle()}>Use category</th>
                                    <th style={this.tableStyle()}>
                                        Non-Mortality median BMC
                                        <br />
                                        (Min – Max)
                                    </th>
                                    <th style={this.tableStyle()}>
                                        Mortality median BMC
                                        <br />
                                        (Min – Max)
                                    </th>
                                    <th style={this.tableStyle()}>
                                        Number of concentration response curves evaluated
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="centered-table-body">
                                {medData.map(this.renderRow)}
                            </tbody>
                        </table>
                    </div>
                );

            case BMDVIZ_SELECTIVITY:
                return (
                    <div>
                        <table id="IA_table01" ref="table" className="table-condensed table-hover">
                            <thead>
                                <tr>
                                    <th style={this.tableStyle()}>Test substance</th>
                                    <th style={this.tableStyle()}>CASRN</th>
                                    <th style={this.tableStyle()}>Use category</th>
                                    <th style={this.tableStyle()}>Laboratory specific term</th>
                                    <th style={this.tableStyle()}>Ontology term</th>
                                    <th style={this.tableStyle()}>Ontology ID</th>
                                    <th style={this.tableStyle()}>
                                        Number of concentration response curves evaluated
                                    </th>
                                    <th style={this.tableStyle()}>Non-Mortality summarized BMC</th>
                                    <th style={this.tableStyle()}>
                                        Mortality BMC
                                        <br />
                                        (Min – Max)
                                    </th>
                                    <th style={this.tableStyle()}>Specificity</th>
                                </tr>
                            </thead>
                            <tbody className="centered-table-body">
                                {medData.map(this.renderRow)}
                            </tbody>
                        </table>
                    </div>
                );

            default:
                return null;
        }
    }
}

BmdTable.propTypes = {
    data: PropTypes.array.isRequired,
    visualization: PropTypes.number.isRequired,
};

export default BmdTable;
