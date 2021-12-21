import React from 'react';
import { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import Loading from 'utils/Loading';
import BmdTable from './BmdTable';
import SelectivityTable from './SelectivityTable';
import RankedBarchart, { submit_download_form } from './RankedBarchart';
import {
    getBmdsUrl,
    BMDVIZ_ACTIVITY,
    BMD_CW,
    svg_download_form,
    data_exportToJsonFile,
    data_exportToCSVFile,
} from '../shared';

var tableData_input;

class RankedBarchartHandler extends React.Component {
    constructor(props) {
        super(props);
        // this.parseJSONToCSVStr = this.parseJSONToCSVStr.bind(this);
        this.state = {
            data: null,
            // assays: [],
            // readouts: [],
        };
    }

    _fetchDoseResponseData(url) {
        d3.json(url, (error, data) => {
            if (error) {
                let err = error.target.responseText.replace('["', '').replace('"]', '');
                this.setState({
                    data: [],
                    error: err,
                });
                return;
            }
            // this.updateData(data, this.props.collapse);
        });
    }

    updateData(data, collapse) {
        this.setKeys(data, collapse);
        let update = this.collapseData(data, collapse);
        let scale = this.getColorScale(update.collapsedData, collapse);
        this.setState({
            ...update,
            scale,
        });
    }

    _updateData(props) {
        // gets data for all readouts at once for specified BMD type
        // let url = `/neurotox/api/${BMD_CW[props.bmdType]}/bmds/?format=tsv`,
        // let url = `/seazit/api/seazit_cr_readout_result/bmds/?format=tsv`,
        // let url = getBmdsUrl(this.state.assays, this.state.readouts);
        let url = `/seazit/api/seazit_cr_readout_result/bmds/?format=json&protocol_ids=1&readouts=Abnormal_heartbeat+Mort@120`;

        //      let url `${URL_CONCRESPMATRIX}?format=json&protocol_ids=${ids}&readouts=${ro}&casrns=${chems}`;
        console.log('url');
        console.log(url);
        d3.json(url, (error, data) => {
            if (error) {
                let err = error.target.responseText.replace('["', '').replace('"]', '');
                this.setState({
                    data: [],
                    error: err,
                });
                return;
            }
            // this.updateData(data, this.props.collapse);
            console.log(data);

            this.updateData(data, this.props.collapse);
        });
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

    _sortData = (inputData) => {
        if (inputData.length === 0) {
            return null;
        }

        let zeroes = _.filter(inputData, (d) => d.minimumBmd <= 0),
            nonzeroes = _.chain(inputData)
                .filter((d) => d.minimumBmd > 0)
                .sortBy('minimumBmd')
                .value();
        return nonzeroes.concat(zeroes);
    };

    render() {
        if (!this.state.data) {
            return <Loading />;
        }

        console.log(this.props.selectedReadouts);
        let chartName = this.props.visualization === BMDVIZ_ACTIVITY ? 'activity' : 'selectivity',
            { plotData, tableData } = this._getData();
        tableData_input = tableData;

        let keys = [
            'chemical_name',
            'chemical_casrn',
            'chemical_category',
            'minimimumViability.bmd',
            'minimimumViability.bmdl',
            'minimimumViability.bmdu',
            'minimimumNonViability.bmd',
            'minimimumNonViability.bmdl',
            'minimimumNonViability.bmdu',
        ];

        return (
            <div>
                <h2>
                    BMC values: sorted by {chartName}{' '}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button
                        onClick={() => svg_download_form('BMC_heatmap01')}
                        class="btn btn-primary"
                    >
                        Export plot
                    </button>
                </h2>
                <RankedBarchart
                    // the visualization function not affect the plot
                    // the selectedAxis is the main function to show tables,
                    // check the RankedBarchart file, selectedAxis part
                    data={plotData}
                    visualization={this.props.visualization}
                    selectedAxis={AXIS_LOG10}
                />
                <p class="help-block">
                    <b>Interactivity note:</b> This barchart is interactive. Click an item to view
                    the concentration-response curves from which the BMC was derived.
                </p>
                <h2>
                    BMC for all chemicals &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button
                        onClick={() => data_exportToCSVFile(this._sortData(tableData_input), keys)}
                        class="btn btn-primary"
                    >
                        Export data CSV
                    </button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button
                        onClick={() => data_exportToJsonFile(tableData_input)}
                        class="btn btn-primary"
                    >
                        Export data Json
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
    // selectedArray: PropTypes.array.isRequired,
    // selectedReadouts: PropTypes.readouts.isRequired,
    visualization: PropTypes.number.isRequired,
    selectivityCutoff: PropTypes.number.isRequired,
};

export default RankedBarchartHandler;
