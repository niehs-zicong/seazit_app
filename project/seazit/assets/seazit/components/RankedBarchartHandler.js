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
    CHEMLIST_80,
    CHEMFILTER_CHEMICIAL,
    NO_COLLAPSE,
    COLLAPSE_BY_READOUT,
    COLLAPSE_BY_CHEMICAL,
} from '../shared';

class RankedBarchartHandler extends React.Component {
    constructor(props) {
        super(props);
        // console.log(props)

        // this.parseJSONToCSVStr = this.parseJSONToCSVStr.bind(this);
        this.state = {
            // loadMetadata
            metadataLoaded: false,
            metadata: null,

            // HelpButtonWidget
            showHelpText: false,

            // ChemicalSelectorWidget
            chemList: CHEMLIST_80,
            // chemicalFilterBy: CHEMFILTER_CATEGORY,
            chemicalFilterBy: CHEMFILTER_CHEMICIAL,

            chemicals: [],
            categories: [],

            // ReadoutSelectorWidget
            assays: [],
            readouts: [],

            // PlotCollapseWidget
            plotCollapse: NO_COLLAPSE,

            // DoseResponseGridWidget
            // vizColumns: initialCols,
            vizHeight: 350,
            data: null,
        };
    }

    fetchBmdData(url) {
        // console.log('this.state zw2  '  );
        // console.log(this.state);
        // console.log(this.props);

        // let url = `/seazit/api/seazit_cr_readout_result/bmds/?format=json&protocol_ids=1&readouts=Mortality@24_1`;
        // let url = this.props.url;
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
            this.setState({ data });
            // this.updateData(data, this.props.collapse);
        });
    }

    loadBmd() {
        // this.state.collapsedData.map((d) => this._renderPlot(d, this.state.yrange));
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

    setDatasetKey(data) {
        data.key = `${data.endpoint_name}|${data.protocol_id}`;
        data.chemicalKey = `${data.casrn}|${data.dtxsid}`;
    }

    _getFilteredData() {
        // console.log(this.state.data)
        // _.each(this.state.data.bmc_readout_result, (d) => this.setDatasetKey(d));
        // _.each(this.state.data.readout_result, (d) => this.setDatasetKey(d));
        // console.log(this.state.data)
        //
        // let nonViableIds = this.props.selectedReadouts.map((d) => parseInt(d)),
        //     nonViables = _.filter(this.state.data, (d) => _.includes(nonViableIds, d.readout_id)),
        //     protocols = _.chain(nonViables)
        //         .map('protocol')
        //         .uniq()
        //         .value(),
        //     viables = _.filter(this.state.data, (d) => {
        //         return d.readout_is_viability == true && _.includes(protocols, d.protocol);
        //     }),
        //     data = _.flattenDeep([viables, nonViables]),
        //     setNullNameFields = [
        //         'maximumSelectivity',
        //         'minimumBmd',
        //         'minimimumViability',
        //         'minimimumNonViability',
        //     ];
        // let forPlot = _.chain(data)
        //     .groupBy('chemical_casrn')
        //     .values()
        //     .map((data) => {
        //         let viables = _.filter(data, (d) => d.readout_is_viability == true),
        //             nonViables = _.filter(data, (d) => d.readout_is_viability == false),
        //             maximumSelectivity = _.chain(data)
        //                 .filter((d) => d.selectivity_ratio > 0)
        //                 .map('selectivity_ratio')
        //                 .max()
        //                 .value(),
        //             minimumBmd = _.chain(data)
        //                 .filter((d) => d.bmd > 0)
        //                 .map('bmd')
        //                 .min()
        //                 .value(),
        //             minimimumViability = _.chain(viables)
        //                 .filter((d) => d.bmd > 0)
        //                 .min((d) => d.bmd)
        //                 .value(),
        //             minimimumNonViability = _.chain(nonViables)
        //                 .filter((d) => d.bmd > 0)
        //                 .min((d) => d.bmd)
        //                 .value();
        //
        //         return {
        //             chemical_casrn: data[0].chemical_casrn,
        //             chemical_name: data[0].chemical_name,
        //             chemical_category: data[0].chemical_category,
        //             viables,
        //             nonViables,
        //             maximumSelectivity,
        //             minimumBmd,
        //             minimimumViability,
        //             minimimumNonViability,
        //         };
        //     })
        //     .each((d) => {
        //         setNullNameFields.forEach((name) => {
        //             if (!_.isObject(d[name]) && !isFinite(d[name])) {
        //                 d[name] = null;
        //             }
        //         });
        //     })
        //     .value();
        //
        // return forPlot;
    }

    _getData() {
        /*
        Plot only contains a subset of data
        this part is for BMC by lab,
        */
        console.log(this.state);
        console.log(this.props);

        let data = this._getFilteredData(),
            filterFunc,
            sortByFunc;
        // if (this.props.visualization === BMDVIZ_ACTIVITY) {
        //     filterFunc = (d) => d.minimumBmd !== null;
        //     sortByFunc = 'minimumBmd';
        // } else {
        //     filterFunc = (d) => {
        //         return (
        //             d.maximumSelectivity !== null &&
        //             d.maximumSelectivity > this.props.selectivityCutoff
        //         );
        //     };
        //     sortByFunc = (d) => -d.maximumSelectivity;
        // }
        return {
            plotData: _.chain(data)
                .filter(filterFunc)
                .sortBy(sortByFunc)
                .value(),
            tableData: data,
        };
    }

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

        // let chartName = this.props.visualization === BMDVIZ_ACTIVITY ? 'activity' : 'selectivity',
        let chartName = 'zw1',
            // { plotData, tableData } = this._getData();
            plotData = this.state.data,
            tableData = this.state.data;

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
                />
                <p class="help-block">
                    <b>Interactivity note:</b> This barchart is interactive. Click an item to view
                    the concentration-response curves from which the BMC was derived.
                </p>
                <h2>
                    BMC for all chemicals zw2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {/*<button*/}
                    {/*    onClick={() => data_exportToCSVFile(this._sortData(tableData_input), keys)}*/}
                    {/*    class="btn btn-primary"*/}
                    {/*>*/}
                    {/*    Export data CSV*/}
                    {/*</button>*/}
                    {/*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*/}
                    {/*<button*/}
                    {/*    onClick={() => data_exportToJsonFile(tableData_input)}*/}
                    {/*    class="btn btn-primary"*/}
                    {/*>*/}
                    {/*    Export data Json*/}
                    {/*</button>*/}
                </h2>
                {/*{this.props.visualization === BMDVIZ_ACTIVITY ? (*/}
                {/*    <BmdTable data={tableData} />*/}
                {/*) : (*/}
                {/*    <SelectivityTable data={tableData} />*/}
                {/*)}*/}
            </div>
        );
    }
}

RankedBarchartHandler.propTypes = {
    // selectedArray: PropTypes.string.isRequired,
    // selectedReadouts: PropTypes.array.isRequired,
    visualization: PropTypes.number.isRequired,
    selectivityCutoff: PropTypes.number.isRequired,
    selectedAxis: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
};

export default RankedBarchartHandler;
