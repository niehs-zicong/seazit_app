import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import _ from 'lodash';
import Loading from 'utils/Loading';
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
    pod_med_processed,
    svg_download_form,
    data_exportToJsonFile,
    BMDVIZ_ACTIVITY,
} from '../shared';

class IntegrativePlotHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            scale: null,
            continuousColorScale: null,
            INTVIZ_HEATMAP_COLORS: [
                {
                    key: 'dev tox',
                    label: 'specific',
                    fill: '#d62976',
                    // fill: 'black'
                },
                {
                    key: 'general tox',
                    label: 'non-specific',
                    fill: '#f9d70b',
                },
                {
                    key: 'inconclusive',
                    label: ' inconclusive, more tests are needed',
                    fill: '#3BD6C6',
                },
                {
                    key: 'inactive',
                    label: 'non-toxic ',
                    fill: '#FFFFFF',
                },
                {
                    key: 'default',
                    label: 'not evaluated',
                    fill: '#C9C9C9',
                },
            ],
        };
    }

    fetchIntegrativeData(url) {
        //console.log(url);
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
                    .range([1, 0]),
                continuousColorScale = function(d) {
                    return d3.interpolateViridis(scale(d));
                };

            this.setState({
                data,
                scale,
                continuousColorScale,
            });
        });
    }

    _exportCsv = function(jsonData) {
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
        //         keys = {
        //     'protocol_name_long': 'dataset name (short)',
        //     'protocol_name_plot': 'dataset name (long)',
        //     'dtxsid': 'dtxsid',
        //     'casrn': 'casrn',
        //     'preferred_name': 'preferred_name',
        //     'use_category1': 'use category level1',
        //     'ontologyGroupName': 'ontology group',
        //     'endPointList': 'n endpoints in the ontology group',
        //     'combin_ontology_id': 'n ontology terms in the ontology group',
        //     'final_dev_call': 'activity decision on ontology',
        //     'mean_pod': ' ontology group bmc (um)',
        //     'mort_med_pod_med': 'mortality bmc (um)',
        //     'mean_selectivity': 'selectivity ',
        //     'min_lowest_conc': 'lowest tested conc (um)',
        //     'max_highest_conc': 'highest tested conc (um)',
        // }

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
                        csvStr += `"${pod_med_processed(item[key])}"`;
                        break;
                    case 'mort_med_pod_med':
                        csvStr += `"${pod_med_processed(item[key])}"`;
                        break;
                    case 'mean_selectivity':
                        csvStr += `"${item[key]}"`;
                        break;
                    case 'min_lowest_conc':
                        csvStr += `"${pod_med_processed(item[key])}"`;
                        break;
                    case 'max_highest_conc':
                        csvStr += `"${pod_med_processed(item[key])}"`;
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
    };

    _getFilteredData() {
        let getFillFunction = function(visualization, continuousColorScale, colorCategory) {
            switch (visualization) {
                case INTVIZ_HEATMAP:
                    return function(data) {
                        var color;
                        for (var i of colorCategory) {
                            if (data.final_dev_call == i['key']) {
                                color = i['fill'];
                                return color;
                            }
                        }
                    };
                case INTVIZ_DevtoxHEATMAP:
                    return function(data) {
                        switch (data.final_dev_call) {
                            case 'dev tox':
                                return data.mean_pod
                                    ? continuousColorScale(pod_med_processed(data.mean_pod))
                                    : 'red';
                            // case 'general tox':
                            //     return '#000000';
                            // case 'inconclusive':
                            //     return '#000000';
                            // case 'inactive':
                            //     return '#000000';
                            default:
                                return '#000000';
                        }
                    };
                default:
                    throw 'Unknown display type.';
            }
        };
        let getLegendData = function(visualization, scale, colorScale, colorCategory) {
            switch (visualization) {
                case INTVIZ_HEATMAP:
                    return {
                        type: 'discrete',
                        values: colorCategory,
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
                this.state.continuousColorScale,
                this.state.INTVIZ_HEATMAP_COLORS
            ),
            legendData = getLegendData(
                this.props.visualization,
                this.state.scale,
                this.state.continuousColorScale,
                this.state.INTVIZ_HEATMAP_COLORS
            );

        let data = this.state.data.integrative_activity_selectivity,
            ontologyGroup = this.props.ontologyGroup,
            selectivityOrder = ['dev tox', 'general tox', 'inconclusive', 'inactive'],
            ontologyGroupName =
                this.props.ontologyType == integrative_Granular
                    ? 'developmental_defect_grouping_granular'
                    : 'developmental_defect_grouping_general';

        data = _.chain(data)
            .filter((i) => ontologyGroup.includes(i[ontologyGroupName]))
            .map((d) => {
                return {
                    ...d,
                    x: d[ontologyGroupName] + ': ' + d.protocol_name_plot,
                    y: d.preferred_name,
                    fill: null,
                    fillFlag: false,
                    ontologyGroupName: d[ontologyGroupName],
                    ontologyGroup: ontologyGroup,
                    title:
                        d[ontologyGroupName] + '+' + d.protocol_name_plot + '+' + d.preferred_name,
                };
            })
            .sortBy('med_pod_med')
            .value();

        // find xgroups names, and join datasetLabname and ontologyGroup into xGroup.
        let a = this.props.ontologyGroup;
        let b = this.props.datasetLabName;
        let xgroups = [];
        a.forEach((k) => {
            b.forEach((i) => {
                xgroups.push(k + ': ' + i);
            });
        });
        let ygroups = _.chain(data)
            .map('y')
            .uniq()
            .value();

        switch (this.props.visualization) {
            case INTVIZ_HEATMAP: {
                for (const x of xgroups) {
                    for (const y of ygroups) {
                        let result = _.filter(data, { x: x, y: y });

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
                            .sort(
                                (a, b) => selectivityOrder.indexOf(a) - selectivityOrder.indexOf(b)
                            )
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
                            });
                        } else {
                            result = _.chain(result)
                                .filter((i) => i.final_dev_call === topFinal)
                                .sortBy('mean_pod')
                                .first()
                                .forEach((value, index, array) => {
                                    array.fill = fillFunction(array);
                                    array.endPointList = endpoints;
                                    array.devtoxEndPointList = devtoxEndpoints;
                                    array.fillFlag = true;
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
                        let result = _.filter(data, { x: x, y: y });

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
                            .sort(
                                (a, b) => selectivityOrder.indexOf(a) - selectivityOrder.indexOf(b)
                            )
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
                            });
                        } else {
                            result = _.chain(result)
                                .filter((i) => i.final_dev_call === topFinal)
                                .sortBy('mean_pod')
                                .first()
                                .forEach((value, index, array) => {
                                    array.fill = fillFunction(array);
                                    array.endPointList = endpoints;
                                    array.devtoxEndPointList = devtoxEndpoints;
                                    array.fillFlag = true;
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
    }

    componentWillMount() {
        this.fetchIntegrativeData(this.props.url);
    }

    UNSAFE_componentWillUpdate(nextProps) {
        if (nextProps.url !== this.props.url) {
            this.fetchIntegrativeData(nextProps.url);
        }
    }

    render() {
        if (!this.state.data) {
            return <Loading />;
        }
        let d;
        d = this._getFilteredData();
        // this is result, with color name is fill data.
        if (d.data.length === 0) {
            return renderNoDataAlert();
        }
        //console.log('zw', this.props);
        //console.log(this.props.ontologyGroup);
        //console.log(this.props.ontologyType);
        //console.log(d.data);

        if (this.props.visualization == INTVIZ_HEATMAP) {
            return (
                <div>
                    <h2>
                        Download buttons: &nbsp;&nbsp;&nbsp;&nbsp;
                        <button onClick={() => this._exportCsv(d.data)} className="btn btn-primary">
                            Export CSV
                        </button>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button
                            onClick={() => svg_download_form('IA_heatmap01')}
                            className="btn btn-primary"
                        >
                            Export SVG
                        </button>
                    </h2>
                    <Heatmap
                        data={d.data}
                        legendData={d.legendData}
                        ontologyType={this.props.ontologyType}
                    />
                </div>
            );
        } else {
            return (
                <div>
                    <h2>
                        Download buttons: &nbsp;&nbsp;&nbsp;&nbsp;
                        <button onClick={() => this._exportCsv(d.data)} className="btn btn-primary">
                            Export CSV
                        </button>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button
                            onClick={() => svg_download_form('IA_heatmap02')}
                            className="btn btn-primary"
                        >
                            Export SVG
                        </button>
                    </h2>
                    <DevtoxHeatmap data={d.data} legendData={d.legendData} />
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
