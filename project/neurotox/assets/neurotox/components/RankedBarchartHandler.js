import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import Loading from 'utils/Loading';
import BmdTable from './BmdTable';
import SelectivityTable from './SelectivityTable';
import RankedBarchart from './RankedBarchart';
import { submit_download_form } from './RankedBarchart';

import { BMDVIZ_ACTIVITY, BMD_CW } from '../shared';

var tableData_input;

class RankedBarchartHandler extends React.Component {
    constructor(props) {
        super(props);
        // this.parseJSONToCSVStr = this.parseJSONToCSVStr.bind(this);
        this.state = { data: null };
    }

    _updateData(props) {
        // gets data for all readouts at once for specified BMD type
        let url = `/neurotox/api/${BMD_CW[props.bmdType]}/bmds/?format=tsv`,
            cleanRow = function(row) {
                let r = {
                    id: +row.id,
                    readout_id: +row.readout_id,
                    readout_is_viability: row.readout_is_viability == 'True',
                    substance_id: +row.substance_id,
                    bmd: +row.bmd,
                    bmdl: +row.bmdl,
                    bmdu: +row.bmdu,
                    selectivity_ratio: Math.log10(+row.selectivity_ratio),
                    has_viability_bmd: row.has_viability_bmd == 'True',
                    chemical_casrn: row.chemical_casrn,
                    chemical_name: row.chemical_name,
                    chemical_category: row.chemical_category,
                    readout_endpoint: row.readout_endpoint,
                    protocol: row.protocol,
                };
                if (r.bmdl === 0) {
                    r.bmdl = null;
                }
                if (r.bmdu === 0) {
                    r.bmdu = null;
                }
                return r;
            },
            formatData = (error, data) => {
                this.setState({ data });
            };

        d3.tsv(url, cleanRow, formatData);
    }

    _getFilteredData() {
        let nonViableIds = this.props.selectedReadouts.map((d) => parseInt(d)),
            nonViables = _.filter(this.state.data, (d) => _.includes(nonViableIds, d.readout_id)),
            protocols = _.chain(nonViables)
                .map('protocol')
                .uniq()
                .value(),
            viables = _.filter(this.state.data, (d) => {
                return d.readout_is_viability == true && _.includes(protocols, d.protocol);
            }),
            data = _.flattenDeep([viables, nonViables]),
            setNullNameFields = [
                'maximumSelectivity',
                'minimumBmd',
                'minimimumViability',
                'minimimumNonViability',
            ];

        let forPlot = _.chain(data)
            .groupBy('chemical_casrn')
            .values()
            .map((data) => {
                let viables = _.filter(data, (d) => d.readout_is_viability == true),
                    nonViables = _.filter(data, (d) => d.readout_is_viability == false),
                    maximumSelectivity = _.chain(data)
                        .filter((d) => d.selectivity_ratio > 0)
                        .map('selectivity_ratio')
                        .max()
                        .value(),
                    minimumBmd = _.chain(data)
                        .filter((d) => d.bmd > 0)
                        .map('bmd')
                        .min()
                        .value(),
                    minimimumViability = _.chain(viables)
                        .filter((d) => d.bmd > 0)
                        .min((d) => d.bmd)
                        .value(),
                    minimimumNonViability = _.chain(nonViables)
                        .filter((d) => d.bmd > 0)
                        .min((d) => d.bmd)
                        .value();

                return {
                    chemical_casrn: data[0].chemical_casrn,
                    chemical_name: data[0].chemical_name,
                    chemical_category: data[0].chemical_category,
                    viables,
                    nonViables,
                    maximumSelectivity,
                    minimumBmd,
                    minimimumViability,
                    minimimumNonViability,
                };
            })
            .each((d) => {
                setNullNameFields.forEach((name) => {
                    if (!_.isObject(d[name]) && !isFinite(d[name])) {
                        d[name] = null;
                    }
                });
            })
            .value();

        return forPlot;
    }

    _getData() {
        /*
        Plot only contains a subset of data
        this part is for BMC by lab, 
        */
        let data = this._getFilteredData(),
            filterFunc,
            sortByFunc;
        if (this.props.visualization === BMDVIZ_ACTIVITY) {
            filterFunc = (d) => d.minimumBmd !== null;
            sortByFunc = 'minimumBmd';
        } else {
            filterFunc = (d) => {
                return (
                    d.maximumSelectivity !== null &&
                    d.maximumSelectivity > this.props.selectivityCutoff
                );
            };
            sortByFunc = (d) => -d.maximumSelectivity;
        }
        return {
            plotData: _.chain(data)
                .filter(filterFunc)
                .sortBy(sortByFunc)
                .value(),
            tableData: data,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.bmdType !== this.props.bmdType) {
            this._updateData(nextProps);
        }
        return true;
    }

    componentWillMount() {
        this._updateData(this.props);
    }

    // Export To Downloadable CSV File for all specified keys by names.
    _tableData_download = () => {
        var today = new Date();
        var filename =
            today.getFullYear() +
            '-' +
            (today.getMonth() + 1) +
            '-' +
            today.getDate() +
            '-' +
            today.getHours() +
            '-' +
            today.getMinutes() +
            '-' +
            today.getSeconds() +
            '.csv';
        console.log('tableData_input');
        console.log(tableData_input);
        let jsonData = tableData_input;
        if (jsonData.length == 0) {
            return '';
        }
        // let keys = Object.keys(jsonData[0]);
        // let keys= ["chemical_casrn", "chemical_category", "chemical_name"];
        let keys = [
            'chemical_casrn',
            'chemical_category',
            'chemical_name',
            'minimimumViability.bmd',
            'minimimumViability.bmdl',
            'minimimumViability.bmdu',
            'minimimumNonViability.bmd',
            'minimimumNonViability.bmdl',
            'minimimumNonViability.bmdu',
        ];
        let columnDelimiter = ',';
        let lineDelimiter = '\n';

        let csvColumnHeader = keys.join(columnDelimiter);
        let csvStr = csvColumnHeader + lineDelimiter;
        jsonData.forEach((item) => {
            keys.forEach((key, index) => {
                if (index > 0 && index < keys.length) {
                    // if( (index > 0) && (index < keys.length-1) ) {
                    csvStr += columnDelimiter;
                }
                // the reason I used replcae all function, replace all comma
                // to . , the comma will make my csv format mass.
                switch (key) {
                    case 'chemical_casrn':
                        csvStr += `"${item[key]}"`;

                        break;
                    case 'chemical_category':
                        csvStr += `"${item[key]}"`;

                        break;
                    case 'chemical_name':
                        csvStr += `"${item[key]}"`;

                        break;
                    case 'minimimumViability.bmd':
                        if (item['minimimumViability'] && item['minimimumViability']['bmd']) {
                            csvStr += item['minimimumViability']['bmd'];
                        } else {
                            csvStr += 'null';
                        }
                        break;
                    case 'minimimumViability.bmdl':
                        if (item['minimimumViability'] && item['minimimumViability']['bmdl']) {
                            csvStr += item['minimimumViability']['bmdl'];
                        } else {
                            csvStr += 'null';
                        }
                        break;
                    case 'minimimumViability.bmdu':
                        if (item['minimimumViability'] && item['minimimumViability']['bmdu']) {
                            csvStr += item['minimimumViability']['bmdu'];
                        } else {
                            csvStr += 'null';
                        }
                        break;
                    case 'minimimumNonViability.bmd':
                        if (item['minimimumNonViability'] && item['minimimumNonViability']['bmd']) {
                            csvStr += item['minimimumNonViability']['bmd'];
                        } else {
                            csvStr += 'null';
                        }
                        break;
                    case 'minimimumNonViability.bmdl':
                        if (
                            item['minimimumNonViability'] &&
                            item['minimimumNonViability']['bmdl']
                        ) {
                            csvStr += item['minimimumNonViability']['bmdl'];
                        } else {
                            csvStr += 'null';
                        }
                        break;
                    case 'minimimumNonViability.bmdu':
                        if (
                            item['minimimumNonViability'] &&
                            item['minimimumNonViability']['bmdu']
                        ) {
                            csvStr += item['minimimumNonViability']['bmdu'];
                        } else {
                            csvStr += 'null';
                        }
                        break;
                    default:
                        csvStr += 'undefined';
                }
            });
            csvStr += lineDelimiter;
        });
        csvStr = encodeURIComponent(csvStr);

        let dataUri = 'data:text/csv;charset=utf-8,' + csvStr;
        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', filename);
        linkElement.click();
    };

    // Export To Downloadable JSON File
    // _tableData_download()
    // {
    //   var today = new Date();
    //   var filename = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'-'+
    //           today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds()
    //            + ".json";
    //   var element = document.createElement('a');
    //   let dataStr = JSON.stringify(tableData_input);
    //   let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    //   element.setAttribute('href', dataUri);
    //   element.setAttribute('download', filename);
    //   element.style.display = 'none';
    //   document.body.appendChild(element);
    //   element.click();
    //   document.body.removeChild(element);
    // }

    render() {
        if (!this.state.data) {
            return <Loading />;
        }

        let chartName = this.props.visualization === BMDVIZ_ACTIVITY ? 'activity' : 'selectivity',
            { plotData, tableData } = this._getData();
        tableData_input = tableData;

        return (
            <div>
                <h2>
                    BMC values: sorted by {chartName}{' '}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button onClick={submit_download_form} class="btn btn-primary">
                        Export plot
                    </button>
                </h2>
                <RankedBarchart
                    // the visualization function not affect the plot
                    // the selectedAxis is the main function to show tables,
                    // check the RankedBarchart file, selectedAxis part
                    data={plotData}
                    visualization={this.props.visualization}
                    selectedAxis={this.props.selectedAxis}
                />
                <p class="help-block">
                    <b>Interactivity note:</b> This barchart is interactive. Click an item to view
                    the concentration-response curves from which the BMC was derived.
                </p>
                <h2>
                    BMC for all chemicals &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button onClick={this._tableData_download} class="btn btn-primary">
                        Export data
                    </button>
                </h2>
                {this.props.visualization === BMDVIZ_ACTIVITY ? (
                    <BmdTable data={tableData} />
                ) : (
                    <SelectivityTable data={tableData} />
                )}
            </div>
        );
    }
}

RankedBarchartHandler.propTypes = {
    selectedReadouts: PropTypes.array.isRequired,
    bmdType: PropTypes.number.isRequired,
    visualization: PropTypes.number.isRequired,
    selectivityCutoff: PropTypes.number.isRequired,
    selectedAxis: PropTypes.number.isRequired,
};

export default RankedBarchartHandler;
