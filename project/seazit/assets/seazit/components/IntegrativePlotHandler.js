import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import _ from 'lodash';
import Loading from 'utils/Loading';
import {svg_download_form, data_exportToJsonFile, BMDVIZ_ACTIVITY} from '../shared';
import Heatmap from './Heatmap';
import DevtoxHeatmap from './DevtoxHeatmap';
import {
    READOUT_TYPE_READOUT,
    READOUT_TYPE_CATEGORY,
    HEATMAP_ACTIVITY,
    HEATMAP_BMC,
    INTVIZ_DevtoxHEATMAP,
    INTVIZ_HEATMAP,
    integrative_Granular,
    integrative_General,
    printFloat,
    renderNoDataAlert,
} from '../shared';


class IntegrativePlotHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            scale: null,
            continuousColorScale: null,

        };
    }

    fetchIntegrativeData(url) {
        d3.json(url, (error, data) => {
            if (error) {
                let err = error.target.responseText.replace('["', '').replace('"]', '');
                this.setState({
                    data: [],
                    error: err,
                });
                return;
            }
            let domain = [1e-5, 1e3],
                scale = d3
                    .scaleLog()
                    .domain(domain)
                    .range([1, 0])
                ,
                continuousColorScale = function (d) {
                    return d3.interpolateViridis(scale(d));
                };

            this.setState({
                data,
                scale,
                continuousColorScale,
            });

        });
    }


    _exportCsv = function (jsonData) {
        if (jsonData.length == 0) {
            return '';
        }
        let filename = 'IntegrativeAnalysesData.csv',
            keys = [
                'protocol_name_long',
                'protocol_name_plot',
                'chemical_category',
                'dtxsid',
                'casrn',
                'preferred_name',
                'use_category1',
                'ontologyGroupName',
                'endPointList',
                'combin_ontology_id',
                'f_max_dev_call',
                'mean_pod',
                'mort_med_pod_med',
                'mean_selectivity',
                'min_lowest_conc',
                'max_highest_conc',
            ];
        let columnDelimiter = ',';
        let lineDelimiter = '\n';

        let csvColumnHeader = keys.join(columnDelimiter);
        let csvStr = csvColumnHeader + lineDelimiter;
        jsonData.forEach((item) => {
            keys.forEach((key, index) => {
                if (index > 0 && index < keys.length) {
                    csvStr += columnDelimiter;
                }
                // the reason I used replcae all function, replace all comma
                // to . , the comma will make my csv format mass.
                switch (key) {
                    case 'protocol_name_long':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'protocol_name_plot':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'chemical_category':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'dtxsid':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'casrn':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'preferred_name':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'use_category1':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'ontologyGroupName':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'endPointList':
                        csvStr += `"${item[key] ? item[key].length : 0}"`;
                        break;
                    case 'combin_ontology_id':
                        csvStr += `"${item[key] ? item[key].length : 0}"`;
                        break;
                    case 'f_max_dev_call':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'mean_pod':
                        csvStr += `"${Math.pow(10, item[key]) * 1000000}"`;
                        break;
                    case 'mort_med_pod_med':
                        csvStr += `"${Math.pow(10, item[key]) * 1000000}"`;

                        break;
                    case 'mean_selectivity':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'min_lowest_conc':
                        csvStr += `"${Math.pow(10, item[key]) * 1000000}"`;

                        break;
                    case 'max_highest_conc':
                        // csvStr += `"${item[key]}"`;
                        csvStr += `"${Math.pow(10, item[key]) * 1000000}"`;


                        break;

                    default:
                        csvStr += '';
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
    }
    _exportCsv2 = function (jsonData) {
        if (jsonData.length == 0) {
            return '';
        }
        let filename = 'IntegrativeAnalysesData.csv',
            keys = {
                'protocol_name_long': 'dataset name (short)',
                'protocol_name_plot': 'dataset name (long)',
                'dtxsid': 'dtxsid',
                'casrn': 'casrn',
                'preferred_name': 'preferred_name',
                'use_category1': 'use category level1',
                'ontologyGroupName': 'ontology group',
                'endPointList': 'n endpoints in the ontology group',
                'combin_ontology_id': 'n ontology terms in the ontology group',
                'final_dev_call': 'activity decision on ontology',
                'mean_pod': ' ontology group bmc (um)',
                'mort_med_pod_med': 'mortality bmc (um)',
                'mean_selectivity': 'selectivity ',
                'min_lowest_conc': 'lowest tested conc (um)',
                'max_highest_conc': 'highest tested conc (um)',
            }
        ;


        let columnDelimiter = ',';
        let lineDelimiter = '\n';

        let csvColumnHeader = keys.join(columnDelimiter);
        let csvStr = csvColumnHeader + lineDelimiter;
        jsonData.forEach((item) => {
            keys.forEach((key, index) => {
                if (index > 0 && index < keys.length) {
                    csvStr += columnDelimiter;
                }
                // the reason I used replcae all function, replace all comma
                // to . , the comma will make my csv format mass.
                switch (key) {
                    case 'protocol_name_long':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'protocol_name_plot':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'chemical_category':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'dtxsid':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'casrn':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'preferred_name':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'use_category1':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'ontologyGroupName':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'endPointList':
                        csvStr += `"${item[key] ? item[key].length : 0}"`;
                        break;
                    case 'combin_ontology_id':
                        csvStr += `"${item[key] ? item[key].length : 0}"`;
                        break;
                    case 'f_max_dev_call':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'mean_pod':
                        csvStr += `"${Math.pow(10, item[key]) * 1000000}"`;
                        break;
                    case 'mort_med_pod_med':
                        csvStr += `"${Math.pow(10, item[key]) * 1000000}"`;
                        break;
                    case 'mean_selectivity':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'min_lowest_conc':
                        csvStr += `"${Math.pow(10, item[key]) * 1000000}"`;

                        break;
                    case 'max_highest_conc':
                        // csvStr += `"${item[key]}"`;
                        csvStr += `"${Math.pow(10, item[key]) * 1000000}"`;


                        break;

                    default:
                        csvStr += '';
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
    }


    componentWillMount() {
        this.fetchIntegrativeData(this.props.url);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.url !== this.props.url) {
            this.fetchIntegrativeData(nextProps.url);
        }
    }

    _getFilteredData() {

        let getFillFunction = function (visualization, continuousColorScale) {
            switch (visualization) {
                case INTVIZ_HEATMAP:
                    return function (data) {
                        switch (data.final_dev_call) {
                            case 'dev tox':
                                return '#d62976';
                            case 'general tox':
                                return '#f9d70b';
                            case 'inconclusive':
                                return '#3BD6C6';
                            case 'inactive':
                                return '#FFFFFF';
                            default:
                                return '#C9C9C9';
                        }

                    };
                case INTVIZ_DevtoxHEATMAP:
                    return function (data) {
                        switch (data.final_dev_call) {
                            case 'dev tox':
                                return data.mean_pod ? continuousColorScale(Math.pow(10, data.mean_pod) * 1000000) : 'red';
                            case 'general tox':
                                return '#000000';
                            case 'inconclusive':
                                return '#000000';
                            case 'inactive':
                                return '#000000';
                            default:
                                return '#000000';
                        }
                    };
                default:
                    throw 'Unknown display type.';
            }
        };
        let getLegendData = function (visualization, scale, colorScale) {
            switch (visualization) {
                case INTVIZ_HEATMAP:
                    return {
                        type: 'discrete',
                        values: [
                            {
                                label: 'selective',
                                fill: '#d62976',
                            },
                            {
                                label: 'toxic',
                                fill: '#f9d70b',
                            },
                            {
                                label: ' inconclusive, more tests are needed',
                                fill: '#3BD6C6',
                            },
                            {
                                label: 'inactive ',
                                fill: '#FFFFFF',
                            },
                            {
                                label: 'not evaluated',
                                fill: '#C9C9C9',
                            },
                        ],
                    };

                // HEATMAP_BMC type is continuous, search that.
                case INTVIZ_DevtoxHEATMAP:
                    return {
                        type: 'continuous',
                        legendScale: scale,
                        colorScaleFunction: colorScale,
                    };
                default:
                    throw 'Unknown display type.';
            }
        };


        let fillFunction = getFillFunction(
                this.props.visualization,
                this.state.continuousColorScale
            ),
            legendData = getLegendData(
                this.props.visualization,
                this.state.scale,
                this.state.continuousColorScale
            );


        let data = this.state.data.integrative_activity_selectivity,
            ontologyGroup = this.props.ontologyGroup,
            selectivityOrder = ["dev tox", "general tox", "inconclusive", "inactive"],
            ontologyGroupName = (this.props.ontologyType == integrative_Granular) ? 'developmental_defect_grouping_granular' : 'developmental_defect_grouping_general';

        data = _.chain(data)
            .filter((i) => ontologyGroup.includes(i[ontologyGroupName]))
            .map((d) => {
                return {
                    protocol_id: d.protocol_id,
                    endpoint_name: d.endpoint_name,
                    casrn: d.casrn,
                    preferred_name: d.preferred_name,
                    use_category1: d.use_category1,
                    dtxsid: d.dtxsid,
                    min_pod_med: d.min_pod_med,
                    med_pod_med: d.med_pod_med,
                    max_pod_med: d.max_pod_med,
                    med_hitconf: d.med_hitconf,
                    n_values: d.n_values,
                    mort_min_pod_med: d.mort_min_pod_med,
                    mort_med_pod_med: d.mort_med_pod_med,
                    mort_max_pod_med: d.mort_max_pod_med,
                    mort_med_hitconf: d.mort_med_hitconf,
                    mort_n_values: d.mort_n_values,
                    min_lowest_conc: d.min_lowest_conc,
                    max_highest_conc: d.max_highest_conc,
                    mean_pod: d.mean_pod,
                    mean_selectivity: d.mean_selectivity,
                    med_mort_hit_confidence: d.med_mort_hit_confidence,
                    n_rep_max_dev_call: d.n_rep_max_dev_call,
                    n_rep: d.n_rep,
                    f_max_dev_call: d.f_max_dev_call,
                    final_dev_call: d.final_dev_call,
                    malformation: d.malformation,
                    endpoint_name_protocol: d.endpoint_name_protocol,
                    combin_ontology: d.combin_ontology,
                    combin_ontology_id: d.combin_ontology_id,
                    protocol_source: d.protocol_source,
                    lab_anonymous_code: d.lab_anonymous_code,
                    study_phase: d.study_phase,
                    test_condition: d.test_condition,
                    protocol_name_long: d.protocol_name_long,
                    protocol_name_plot: d.protocol_name_plot,
                    proposed_ontology_label: d.proposed_ontology_label,
                    ontology_id_number: d.ontology_id_number,
                    recording_name: d.recording_name,
                    developmental_defect_catergories: d.developmental_defect_catergories,
                    defects_mapped_to_body_region: d.defects_mapped_to_body_region,
                    developmental_defect_grouping_granular: d.developmental_defect_grouping_granular,
                    developmental_defect_grouping_general: d.developmental_defect_grouping_general,
                    seazit_recording_id: d.seazit_recording_id,
                    x: d[ontologyGroupName] + ": " + d.protocol_name_plot,
                    y: d.preferred_name,
                    fill: null,
                    fillFlag: false,
                    ontologyGroupName: d[ontologyGroupName],
                    title: d[ontologyGroupName] + "+" + d.protocol_name_plot + '+' + d.preferred_name,

                };
            })
            .sortBy('med_pod_med')
            .value();

        // console.log("data  before and after ")
        // console.log(this.state.data.integrative_activity_selectivity)
        // console.log(data)

        // find xgroups names, and join datasetLabname and ontologyGroup into xGroup.
        let a = this.props.ontologyGroup;
        let b = this.props.datasetLabName;
        let xgroups = [];
        a.forEach(k => {
            b.forEach(i => {
                xgroups.push(k + ": " + i)
            })
        })
        let ygroups = _.chain(data)
            .map('y')
            .uniq()
            .value();

        switch (this.props.visualization) {
            case INTVIZ_HEATMAP: {
                for (const x of xgroups) {
                    for (const y of ygroups) {
                        let result = _.filter(data, {x: x, y: y})

                        let endpoints = _.chain(result)
                                .map('endpoint_name')
                                .uniq()
                                .value();
                            let devtoxEndpoints = _.chain(result)
                                .filter((i) => i.final_dev_call === 'dev tox')
                                .map('endpoint_name')
                                .uniq()
                                .value();

                            //find top level selectivityOrder function.
                            let topFinal = _.chain(result)
                                .map('final_dev_call')
                                .uniq()
                                .filter((d) => _.includes(selectivityOrder, d))
                                .sort((a, b) => selectivityOrder.indexOf(a) - selectivityOrder.indexOf(b))
                                .first()
                                .value();


                        if (result.length == 0) {
                            data.push({
                                x: x,
                                y: y,
                                fill: '#C9C9C9',
                                fillFlag: true,
                                mean_selectivity: null,
                                mean_pod: null,
                                final_dev_call: null,
                                titile: x + '+' + y,
                            })
                        } else {

                            result = _.chain(result)
                                .filter((i) => i.final_dev_call === topFinal)
                                .sortBy('mean_pod')
                                .first()
                                .forEach((value, index, array) => {
                                    array.fill = fillFunction(array)
                                    array.endPointList = endpoints
                                    array.devtoxEndPointList = devtoxEndpoints
                                    array.fillFlag = true
                                })
                                .value();
                        }

                    }
                }
                data = _.chain(data)
                    .filter((i) => i.fillFlag === true)
                    .value();
                return {
                    data,
                    legendData,
                };
                break;
            }

            case INTVIZ_DevtoxHEATMAP: {

                for (const x of xgroups) {
                    for (const y of ygroups) {
                        let result = _.filter(data, {x: x, y: y})

                        let endpoints = _.chain(result)
                            .map('endpoint_name')
                            .uniq()
                            .value();
                        let devtoxEndpoints = _.chain(result)
                            .filter((i) => i.final_dev_call === 'dev tox')
                            .map('endpoint_name')
                            .uniq()
                            .value();
                        //find top level selectivityOrder function.
                        let topFinal = _.chain(result)
                            .map('final_dev_call')
                            .uniq()
                            .filter((d) => _.includes(selectivityOrder, d))
                            .sort((a, b) => selectivityOrder.indexOf(a) - selectivityOrder.indexOf(b))
                            .first()
                            .value();


                        if (result.length == 0) {
                            data.push({
                                x: x,
                                y: y,
                                fill: '#C9C9C9',
                                fillFlag: true,
                                mean_selectivity: null,
                                mean_pod: null,
                                final_dev_call: null,
                                titile: x + '+' + y,
                            })
                        } else {
                            result = _.chain(result)
                                .filter((i) => i.final_dev_call === topFinal)
                                .sortBy('mean_pod')
                                .first()
                                .forEach((value, index, array) => {
                                    array.fill = fillFunction(array)
                                    array.endPointList = endpoints
                                    array.devtoxEndPointList = devtoxEndpoints
                                    array.fillFlag = true
                                })
                                .value();
                        }
                    }
                }
                data = _.chain(data)
                    .filter((i) => i.fillFlag === true)
                    .values()
                    .value();

                return {
                    data,
                    legendData,
                };
                break;
            }
            default:
                throw 'Error: Unknown display type.';
        }
    };

    render() {
        if (!this.state.data) {
            return <Loading/>;
        }
        let d;
        d = this._getFilteredData();
        // console.log("this.props")
        // console.log(this.props)

        // this is result, with color name is fill data.
        if (d.data.length === 0) {
            return renderNoDataAlert();
        }

        if (this.props.visualization == INTVIZ_HEATMAP) {

            return (
                <div>
                    <h2>
                        Download buttons:
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <button onClick={() => this._exportCsv(d.data)} className="btn btn-primary">
                            Export CSV
                        </button>

                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button onClick={() => svg_download_form('IA_heatmap01')} className="btn btn-primary">
                            Export SVG
                        </button>
                    </h2>
                    <Heatmap data={d.data}
                             legendData={d.legendData}
                    />
                </div>
            );
        } else {
            return (
                <div>
                    <h2>
                        Download buttons:
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <button onClick={() => this._exportCsv(d.data)} className="btn btn-primary">
                            Export CSV
                        </button>

                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button onClick={() => svg_download_form('IA_heatmap01')} className="btn btn-primary">
                            Export SVG
                        </button>
                    </h2>
                    <DevtoxHeatmap data={d.data}
                                   legendData={d.legendData}
                    />
                </div>
            );
        }

    }

}

IntegrativePlotHandler.propTypes = {
    assays: PropTypes.array.isRequired,
    casrns: PropTypes.array.isRequired,
    ontologyType: PropTypes.number.isRequired,
    ontologyGroup: PropTypes.array.isRequired,
    visualization: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    datasetLabName: PropTypes.array.isRequired,
};

export default IntegrativePlotHandler;
