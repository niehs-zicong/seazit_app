import React from 'react';
import { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import Loading from 'utils/Loading';
import BmdTable from './BmdTable';
import RankedBarchart, { submit_download_form } from './RankedBarchart';
import {
    getBmdsUrl,
    BMDVIZ_ACTIVITY,
    BMDVIZ_SELECTIVITY,
    BMD_CW, // svg_download_form,
    data_exportToJsonFile,
    CHEMLIST_80,
    CHEMFILTER_CHEMICIAL,
    NO_COLLAPSE,
    COLLAPSE_BY_READOUT,
    COLLAPSE_BY_CHEMICAL,
    printFloat,
    integrative_Granular,
    pod_med_processed,
    svg_download_form,
    INTVIZ_HEATMAP,
    renderNoDataAlert,
} from '../shared';
import HelpButtonWidget from '../widgets/HelpButtonWidget';
import styles from '../style.css';
import Heatmap from './Heatmap';
import DevtoxHeatmap from './DevtoxHeatmap';

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
            this.setState({ data });
        });
    }

    setDatasetKey(data) {
        data.key = `${data.endpoint_name}|${data.protocol_id}`;
        data.chemicalKey = `${data.casrn}|${data.dtxsid}`;
    }

    _getFilteredData() {
        let selectivityCheckedArray, data, plotData;

        if (this.props.visualization === BMDVIZ_ACTIVITY) {
            data = _.chain(this.state.data.bmd_activity_selectivity)
                .map((d) => {
                    return {
                        ...d,
                        y: d.casrn,
                    };
                })
                .sortBy('med_pod_med')
                .value();
        } else {
            selectivityCheckedArray = _.chain(this.props.selectivityList)
                .filter((r) => r.isChecked === true)
                .map('name')
                .uniq()
                .value();
            data = _.chain(this.state.data.bmd_activity_selectivity)
                .filter((i) => selectivityCheckedArray.includes(i.final_dev_call))
                .map((d) => {
                    return {
                        ...d,
                        y: d.casrn,
                        // ontologyGroupName: d[ontologyGroupType],
                        // title:
                        //     d[ontologyGroupType] + '+' + d.protocol_name_plot + '+' + d.preferred_name,
                    };
                })
                .sortBy('mean_selectivity')
                .reverse()
                .value();
        }
        console.log(this.state.data.bmd_activity_selectivity);
        console.log(data);

        //
        plotData = _.chain(data)
            .groupBy('casrn')
            .map((k) => {
                let endpoint_names = _.chain(k)
                        .map('endpoint_name')
                        .uniq()
                        .value(),
                    minimimumNonViability = _.chain(k)
                        .min((d) => pod_med_processed(d.med_pod_med))
                        .value(),
                    minimimumViability = _.chain(k)
                        .min((d) => pod_med_processed(d.mort_med_pod_med))
                        .value();
                let devtoxEndpoints = _.chain(k)
                    .filter((i) => i.final_dev_call === 'dev tox')
                    .map('endpoint_name')
                    .uniq()
                    .value();

                return {
                    casrn: k[0].casrn,
                    data: k,
                    minimimumNonViability: {
                        ...minimimumNonViability,
                        endpoint_names_list: endpoint_names,
                    },
                    minimimumViability: {
                        ...minimimumViability,
                        endpoint_names_list: endpoint_names,
                    },
                    related_endpoint_names: endpoint_names,
                    related_devtoxEndpoints: devtoxEndpoints,
                    protocol_id: minimimumNonViability.protocol_id,
                    preferred_name: minimimumNonViability.preferred_name,
                    use_category1: minimimumNonViability.use_category1,
                    malformation: minimimumNonViability.malformation,
                    combin_ontology: minimimumNonViability.combin_ontology,
                    combin_ontology_id: minimimumNonViability.combin_ontology_id,
                    mean_pod: minimimumNonViability.mean_pod,
                    mean_selectivity: minimimumNonViability.mean_selectivity,
                    n_values: minimimumNonViability.n_values,
                };
            })
            .value();
        console.log('data');

        console.log(data);
        // if (this.props.visualization === BMDVIZ_ACTIVITY) {
        //     plotData = _.chain(plotData)
        //         .sortBy('med_pod_med')
        //         .value();
        // } else {
        //     plotData = _.chain(plotData)
        //         .sortBy('mean_selectivity')
        //         .reverse()
        //         .value();
        // }
        console.log('plotData');
        console.log(plotData);
        return plotData;
    }

    _exportCsv = function(jsonData) {
        if (jsonData.length == 0) {
            return '';
        }
        let medData = _.sortBy(jsonData.bmd_activity_selectivity, 'med_pod_med');
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
                        csvStr += `"${printFloat(pod_med_processed(item[key]))}"`;
                        break;

                    case 'min_pod_med':
                        csvStr += `"${printFloat(pod_med_processed(item[key]))}"`;
                        break;

                    case 'max_pod_med':
                        csvStr += `"${printFloat(pod_med_processed(item[key]))}"`;
                        break;
                    case 'mort_med_pod_med':
                        csvStr += `"${printFloat(pod_med_processed(item[key]))}"`;
                        break;

                    case 'mort_min_pod_med':
                        csvStr += `"${printFloat(pod_med_processed(item[key]))}"`;
                        break;

                    case 'mort_max_pod_med':
                        csvStr += `"${printFloat(pod_med_processed(item[key]))}"`;
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

    UNSAFE_componentWillUpdate(nextProps) {
        if (nextProps.url !== this.props.url) {
            this.fetchBmdData(nextProps.url);
        }
    }

    _renderHelpText() {
        if (!this.state.showHelpText) {
            return null;
        }
        if (this.props.visualization === INTVIZ_HEATMAP) {
            return (
                <div className="alert alert-info">
                    <p>
                        Test substances are ranked from top to bottom (y-axis of the chart) by
                        lowest BMC (most active) to highest. The Use categories of test substances
                        are color coded next to each test substance name. If more than one
                        non-mortality endpoint was selected, the endpoint with the lowest BMC is
                        included. Each BMC for ranking is the median value of the BMC from the
                        triplicate testing and is shown as the colored dot. The range of lowest BMC
                        and the highest BMC is shown as the colored bar.
                    </p>

                    <p>
                        Additionally, the BMC values of the corresponding mortality (median, min and
                        max) are shown as the black dot and the black dashed line, respectively. If
                        the substance is inactive in either the non-mortality endpoints or the
                        mortality endpoint, no dots or bars will be shown.
                    </p>
                    <p>
                        The BMC values of all substances of the endpoint with the lowest median BMC
                        are listed below in tabular form (“-“ for inactive).
                    </p>
                </div>
            );
        } else {
            return (
                <div className="alert alert-info">
                    <p>
                        Specificity values for each test substance appear on the right-side of the
                        chart and are ranked by most to least specific. The use categories of test
                        substances are color coded next to each test substance name. The user can
                        select more than one non-mortality endpoint.
                    </p>

                    <p>
                        BMC value of the altered phenotype with the lowest summarized BMC among the
                        selected non-mortality endpoints is shown as the colored dot, and the
                        corresponding mortality (if active) is shown as the black dot (median) and
                        the black bar (min-max BMC). If the substance is inactive in either the
                        non-mortality endpoints or the mortality endpoint, no dots or bars will be
                        shown.
                    </p>
                    <p>
                        The BMC values of test substances with specific effect (default, but other
                        types can be toggled) listed below in tabular form (“-“ for inactive).
                    </p>
                </div>
            );
        }
    }

    _renderButtons(d) {
        return (
            <div>
                <div className={styles.buttonRow}>
                    <h2>
                        <button
                            onClick={() => this._exportCsv(d)}
                            className={`fa fa-download ${styles['pointer-button']}`}
                        ></button>
                        <span> Data</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button
                            onClick={() => svg_download_form('BMC_heatmap01')}
                            className={`fa fa-camera ${styles['pointer-button']}`}
                        ></button>
                        <span> Image</span>
                    </h2>
                </div>
                <br />
            </div>
        );
    }

    render() {
        if (!this.state.data) {
            return <Loading />;
        }
        // let url = getBmdsUrl(this.state.assays, this.state.readouts);
        let chartName = this.props.visualization === BMDVIZ_ACTIVITY ? 'activity' : 'specificity',
            tableName =
                this.props.visualization === BMDVIZ_ACTIVITY
                    ? 'all chemicals'
                    : 'selected chemicals',
            title =
                this.props.visualization === BMDVIZ_ACTIVITY
                    ? 'More information on BMC by activity'
                    : 'More information on BMC by specificity',
            plotData = this._getFilteredData();

        return (
            <div>
                <h2 className={`${styles.labelHorizontal} ${styles.labelNormal}`}>
                    BMC values: sorted by {chartName}
                    <HelpButtonWidget stateHolder={this} headLevel={'h2'} title={title} />
                </h2>
                {/*<br/>*/}
                {this._renderHelpText()}

                {this._renderButtons(plotData)}

                <RankedBarchart
                    data={plotData}
                    visualization={this.props.visualization}
                    selectedAxis={this.props.selectedAxis}
                    selectivityList={this.props.selectivityList}
                />
                <p class="help-block">
                    <b>Interactivity note:</b> This barchart is interactive. Click an item to view
                    the concentration-response curves from which the BMC was derived.
                </p>
                <div>
                    <h2 className={`${styles.labelHorizontal} ${styles.labelNormal}`}>
                        BMC for {tableName}
                        <HelpButtonWidget stateHolder={this} headLevel={'h2'} title={title} />
                    </h2>
                </div>

                {/*{this.props.visualization === BMDVIZ_ACTIVITY ? (<BmdTable data={plotData}/>) : (*/}
                {/*    <SelectivityTable data={plotData}/>)}*/}
                <BmdTable data={plotData} visualization={this.props.visualization} />
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
