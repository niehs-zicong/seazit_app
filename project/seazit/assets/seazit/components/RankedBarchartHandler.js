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
        let chartName = 'activity',
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
                    BMC for all chemicals &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
    // selectedArray: PropTypes.string.isRequired,
    // selectedReadouts: PropTypes.array.isRequired,
    visualization: PropTypes.number.isRequired,
    selectivityCutoff: PropTypes.number.isRequired,
    selectedAxis: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
};

export default RankedBarchartHandler;
