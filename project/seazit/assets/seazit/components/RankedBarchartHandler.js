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
    // svg_download_form,
    data_exportToJsonFile,
    // data_exportToCSVFile,
    CHEMLIST_80,
    CHEMFILTER_CHEMICIAL,
    NO_COLLAPSE,
    COLLAPSE_BY_READOUT,
    COLLAPSE_BY_CHEMICAL,
    printFloat,
} from '../shared';

class RankedBarchartHandler extends React.Component {
    constructor(props) {
        super(props);
        // console.log(props.stateHolder.state)
        // this.parseJSONToCSVStr = this.parseJSONToCSVStr.bind(this);
        this.state = { data: null };

    }

    fetchBmdData(url) {
        d3.json(url, (error, data) => {
            if (error) {
                let err = error.target.responseText.replace('["', '').replace('"]', '');
                this.setState({
                    data: [],
                    error: err,
                });
                return;
            }
            console.log(this.state.data)
            console.log("data")
            console.log(url)
            console.log(data)

            // this.updateData(data, this.props.collapse);
            this.setState({ data });
            // console.log(this.state.data)

            // this.updateData(data, this.props.collapse);
        });
    }

    // loadBmd() {
    //     // this.state.collapsedData.map((d) => this._renderPlot(d, this.state.yrange));
    // }

    // updateData(data, collapse) {
    //     this.setKeys(data, collapse);
    //     let update = this.collapseData(data, collapse);
    //     let scale = this.getColorScale(update.collapsedData, collapse);
    //     this.setState({
    //         ...update,
    //         scale,
    //     });
    // }

    setDatasetKey(data) {
        data.key = `${data.endpoint_name}|${data.protocol_id}`;
        data.chemicalKey = `${data.casrn}|${data.dtxsid}`;
    }

    data_exportToCSVFile = function(jsonData) {
        if (jsonData.length == 0) {
            return '';
        }
        let medData = _.sortBy(jsonData.bmd_activity_selectivity, 'med_pod_med');
        // console.log('bmd d');
        // console.log(medData);
        let keys = [
            'preferred_name',
            'casrn',
            'use_category1',
            'med_pod_med',
            'min_pod_med',
            'max_pod_med',
            'mort_med_pod_med',
            'mort_min_pod_med',
            'mort_max_pod_med',
        ];
        var filename = 'csvData.csv';
        let columnDelimiter = ',';
        let lineDelimiter = '\n';
        let csvColumnHeader = keys.join(columnDelimiter);
        let csvStr = csvColumnHeader + lineDelimiter;
        medData.forEach((item) => {
            keys.forEach((key, index) => {
                if (index > 0 && index < keys.length) {
                    // if( (index > 0) && (index < keys.length-1) ) {
                    csvStr += columnDelimiter;
                }
                switch (key) {
                    case 'preferred_name':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'casrn':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'use_category1':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'med_pod_med':
                        csvStr += `"${printFloat(Math.pow(10, item[key]) * 1000000)}"`;
                        break;

                    case 'min_pod_med':
                        csvStr += `"${printFloat(Math.pow(10, item[key]) * 1000000)}"`;
                        break;

                    case 'max_pod_med':
                        csvStr += `"${printFloat(Math.pow(10, item[key]) * 1000000)}"`;
                        break;
                    case 'mort_med_pod_med':
                        csvStr += `"${printFloat(Math.pow(10, item[key]) * 1000000)}"`;
                        break;

                    case 'mort_min_pod_med':
                        csvStr += `"${printFloat(Math.pow(10, item[key]) * 1000000)}"`;
                        break;

                    case 'mort_max_pod_med':
                        csvStr += `"${printFloat(Math.pow(10, item[key]) * 1000000)}"`;
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

    componentWillMount() {
        this.fetchBmdData(this.props.url);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.url !== this.props.url) {
            this.fetchBmdData(nextProps.url);
        }
        // if (nextProps.collapse !== this.props.collapse) {
        //     this.updateData(this.state.data, nextProps.collapse);
        // }
    }
    //
    // componentDidMount() {
    //     this.loadBmd();
    // }
    //
    // componentDidUpdate() {
    //     this.loadBmd();
    // }

    render() {
        if (!this.state.data) {
            return <Loading />;
        }
        // let url = getBmdsUrl(this.state.assays, this.state.readouts);
        let chartName = this.props.visualization === BMDVIZ_ACTIVITY ? 'activity' : 'selectivity',
             plotData, tableData;

        if (this.props.visualization === BMDVIZ_ACTIVITY) {
            plotData = this.state.data,
            tableData = this.state.data;
        } else {
            let selectivityCheckedArray = _.chain(this.props.selectivityList)
                .filter((r) => r.isChecked === true)
                .map('name')
                .uniq()
                .value();
            tableData = this.state.data;
            plotData = {
                bmd_activity_selectivity:  this.state.data.bmd_activity_selectivity.filter( i => selectivityCheckedArray.includes( i.final_dev_call ) )
            }
            console.log("zw result")
            console.log(this.state.data)
            console.log(plotData)
         }

        return (
            <div>
                <h2>
                    BMC values: sorted by {chartName}{' '}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {/*<button*/}
                    {/*    onClick={() => svg_download_form('BMC_heatmap01')}*/}
                    {/*    class="btn btn-primary"*/}
                    {/*>*/}
                    {/*    Export plot*/}
                    {/*</button>*/}
                </h2>
                <RankedBarchart
                    // the visualization function not affect the plot
                    // the selectedAxis is the main function to show tables,
                    // check the RankedBarchart file, selectedAxis part
                    data={plotData}
                    visualization={this.props.visualization}
                    selectedAxis={this.props.selectedAxis}
                    selectivityList={this.props.selectivityList}
                />
                <p class="help-block">
                    <b>Interactivity note:</b> This barchart is interactive. Click an item to view
                    the concentration-response curves from which the BMC was derived.
                </p>
                <h2>
                    BMC for all chemicals &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {/*<button*/}
                    {/*    onClick={() => this.data_exportToCSVFile(tableData)}*/}
                    {/*    class="btn btn-primary"*/}
                    {/*>*/}
                    {/*    Export data .csv*/}
                    {/*</button>*/}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {/*<button*/}
                    {/*    onClick={() => this.data_exportToJsonFile(tableData)}*/}
                    {/*    class="btn btn-primary"*/}
                    {/*>*/}
                    {/*    Export data .json*/}
                    {/*</button>*/}
                </h2>
                {this.props.visualization === BMDVIZ_ACTIVITY ? (
                    <BmdTable data={tableData} />
                ) : (
                    // <BmdTable data={tableData} />
                    <SelectivityTable data={tableData} />
                )}
            </div>
        );
    }
}

RankedBarchartHandler.propTypes = {
    // selectedArray: PropTypes.string.isRequired,
    // selectedReadouts: PropTypes.array.isRequired,
    visualization: PropTypes.number.isRequired,
    selectivityCutoff: PropTypes.number.isRequired,
    selectivityList: PropTypes.array.isRequired,
    selectedAxis: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
};

export default RankedBarchartHandler;
