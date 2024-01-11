import React, {useState} from 'react';
import Modal from 'react-modal';
//import Popup from 'reactjs-popup';
import HelpButtonWidget from '../widgets/HelpButtonWidget';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import _ from 'lodash';
import Loading from 'utils/Loading';
import Heatmap from './Heatmap';
import DevtoxHeatmap from './DevtoxHeatmap';
// import styles from '../style.css';
import styles from '../style.css';

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

class HeatmapHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            scale: null,
            continuousColorScale: null,
            open: false,
            INTVIZ_HEATMAP_COLORS: [
                {
                    key: 'dev tox',
                    label: 'specific',
                    fill: '#d62976',
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
            DEVTOX_HEATMAP_COLORS: [
                {
                    key: 'dev tox',
                    label: 'specific',
                    fill: '#FFFFFF',
                },
                {
                    key: 'general tox',
                    label: 'non-specific, non-toxic, inconclusive',

                    fill: '#FFFFFF',
                },
                {
                    key: 'inconclusive',
                    label: 'non-specific, non-toxic, inconclusive',

                    fill: '#FFFFFF',
                },
                {
                    key: 'inactive',
                    label: 'non-specific, non-toxic, inconclusive',
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
            let domain = [1e-3, 1e3],
                scale = d3
                    .scaleLog()
                    .domain(domain)
                    .range([1, 0]),
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
        if (jsonData.length === 0) {
            return '';
        }
        const filename = 'IntegrativeAnalysesData.csv';

        const headerMappings = {
            protocol_name_long: 'dataset name (short)',
            protocol_name_plot: 'dataset name (long)',
            chemical_category: 'use category level1',
            dtxsid: 'dtxsid',
            casrn: 'casrn',
            preferred_name: 'preferred_name',
            use_category1: 'use category level1',
            ontologyGroupName: 'ontology group',
            endPointList: 'n endpoints in the ontology group',
            combin_ontology_id: 'n ontology terms in the ontology group',
            f_max_dev_call: 'activity decision on ontology',
            mean_pod: 'ontology group bmc (um)',
            mort_med_pod_med: 'mortality bmc (um)',
            mean_selectivity: 'selectivity',
            min_lowest_conc: 'lowest tested conc (um)',
            max_highest_conc: 'highest tested conc (um)',
        };

        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const headerKeys = Object.keys(headerMappings);

        const csvColumnHeader = headerKeys.map((key) => headerMappings[key]).join(columnDelimiter);
        let csvStr = csvColumnHeader + lineDelimiter;

        jsonData.forEach((item) => {
            headerKeys.forEach((key, index) => {
                if (index > 0 && index < headerKeys.length) {
                    csvStr += columnDelimiter;
                }
                let value = item[key] || '';
                if (key === 'endPointList' || key === 'combin_ontology_id') {
                    value = value ? value.length : 0;
                }
                if (
                    key === 'mean_pod' ||
                    key === 'mort_med_pod_med' ||
                    key === 'min_lowest_conc' ||
                    key === 'max_highest_conc'
                ) {
                    value = pod_med_processed(value);
                }
                csvStr += `"${value}"`;
            });
            csvStr += lineDelimiter;
        });
        csvStr = encodeURIComponent(csvStr);

        const dataUri = 'data:text/csv;charset=utf-8,' + csvStr;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', filename);
        linkElement.click();
    };

    _getFilteredData() {
        let getFillFunction = function (visualization, continuousColorScale, colorCategory) {
            switch (visualization) {
                case INTVIZ_HEATMAP:
                    return function (data) {
                        var color;
                        for (var i of colorCategory) {
                            if (data.final_dev_call == i['key']) {
                                color = i['fill'];
                                return color;
                            }
                        }
                    };
                case INTVIZ_DevtoxHEATMAP:
                    return function (data) {
                        switch (data.final_dev_call) {
                            // case 'dev tox':
                            //     return data.mean_pod
                            //         ? continuousColorScale(pod_med_processed(data.mean_pod))
                            //         : 'red';
                            case 'dev tox':
                                return '#FFFFFF';
                            case 'general tox':
                                return '#FFFFFF';
                            case 'inconclusive':
                                return '#FFFFFF';
                            case 'inactive':
                                return '#FFFFFF';
                            default:
                                return '#FFFFFF';
                        }
                    };
                default:
                    throw 'Unknown display type.';
            }
        };
        let getLegendData = function (visualization, scale, colorScale, colorCategory) {
            switch (visualization) {
                case INTVIZ_HEATMAP:
                    return {
                        values: colorCategory,
                    };

                // HEATMAP_BMC type is continuous, search that.
                case INTVIZ_DevtoxHEATMAP:
                    return {
                        legendScale: scale,
                        values: colorCategory,

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
            ontologyGroupType =
                this.props.ontologyType == integrative_Granular
                    ? 'developmental_defect_grouping_granular'
                    : 'developmental_defect_grouping_general';
        console.log(data)

        console.log(ontologyGroup)

        data = _.chain(data)
            .filter((i) => ontologyGroup.includes(i[ontologyGroupType]))
            .map((d) => {
                return {
                    ...d,
                    x: d[ontologyGroupType] + ': ' + d.protocol_name_plot,
                    y: d.preferred_name,
                    ontologyGroupName: d[ontologyGroupType],
                    title:
                        d[ontologyGroupType] + '+' + d.protocol_name_plot + '+' + d.preferred_name,
                };
            })
            .sortBy('med_pod_med')
            .value();

        // find xgroups names, and join datasetLabname and ontologyGroup into xGroup.
        const xgroups = this.props.ontologyGroup.flatMap((k) =>
            this.props.datasetLabName.map((i) => `${k}: ${i}`)
        );

        let ygroups = _.chain(data)
            .map('y')
            .uniq()
            .value();

        function processHeatmapData(data, xgroups, ygroups, fillFunction, selectivityOrder, sortByKey) {
            const processedData = [];


            //

            // note for this part.
            //


            for (const x of xgroups) {
                for (const y of ygroups) {
                    let result = _.filter(data, {x: x, y: y});
                    let endpoints = _.chain(result)
                        .map('endpoint_name')
                        .uniq()
                        .value();
                    let devtoxEndpoints = _.chain(result)
                        .filter((i) => i.final_dev_call === 'dev tox')
                        .map('endpoint_name')
                        .uniq()
                        .value();

                    let topFinal = _.chain(result)
                        .map('final_dev_call')
                        .uniq()
                        .filter((d) => _.includes(selectivityOrder, d))
                        .sort((a, b) => selectivityOrder.indexOf(a) - selectivityOrder.indexOf(b))
                        .first()
                        .value();
                    // console.log(result)
                    // console.log(devtoxEndpoints)
                    // console.log(topFinal)
                    if (result.length === 0) {
                        processedData.push({
                            x: x,
                            y: y,
                            fill: '#C9C9C9',
                            // mean_selectivity: null,
                            // mean_pod: null,
                            // final_dev_call: null,
                            // title: x + '+' + y,
                        });
                    } else {
                        const processedItem = _.chain(result)
                            .filter((i) => i.final_dev_call === topFinal)
                            .sortBy(sortByKey)
                            .first()
                            .value();

                        processedItem.fill = fillFunction(processedItem);
                        processedItem.endPointList = endpoints;
                        processedItem.devtoxEndPointList = devtoxEndpoints;
                        processedData.push(processedItem);
                    }
                }
            }
            console.log("plotData")
            console.log(data)
            console.log(processedData)

            return processedData;
        }


        switch (this.props.visualization) {
            case INTVIZ_HEATMAP:
                return {
                    data: processHeatmapData(data, xgroups, ygroups, fillFunction, selectivityOrder, 'mean_pod'),
                    legendData,
                };
            case INTVIZ_DevtoxHEATMAP:
                return {
                    data: processHeatmapData(data, xgroups, ygroups, fillFunction, selectivityOrder, 'mean_pod'),
                    legendData,
                };
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

    _renderHelpText() {
        if (!this.state.showHelpText) {
            return null;
        }
        if (this.props.visualization === INTVIZ_HEATMAP) {
            return (
                <div className="alert alert-info">
                    <ul>
                        <li>
                            specific = a test substance produces quantifiable alteration(s) in
                            phenotypes at a concentration lower than that which causes overt
                            toxicity (i.e., mortality)
                        </li>
                        <li>
                            non-specific = a test substance produces both altered phenotypes and
                            mortality at similar concentrations
                        </li>
                        <li>
                            non-toxic = no changes to phenotype or survival occurred at the
                            concentrations evaluated
                        </li>
                        <li>
                            inconclusive = specificity couldn’t be determined based on differences
                            among plate replicates and requires more testing
                        </li>
                        <li>
                            not evaluated = a phenotype that was not assessed in a particular
                            laboratory
                        </li>
                    </ul>
                </div>
            );
        } else {
            return (
                <div className="alert alert-info">
                    <p>
                        Benchmark concentration (BMC) of a selected endpoint is indicative of
                        potency; darker shades indicative lower BMC value which is a more potent
                        effect. Specificity is the fold change of the BMC values between the
                        mortality and a certain altered phenotype. The fold change value is
                        log10-transformed; higher specificity represents a more specific phenotypic
                        effect compared to mortality. The higher the specificity, the larger the
                        circle.
                    </p>
                </div>
            );
        }
    }

    _renderButtons(d) {
        const title =
            this.props.visualization === INTVIZ_HEATMAP
                ? 'More information on developmental toxicity classifications'
                : 'More information on BMC and specificity';

        const svgId = this.props.visualization === INTVIZ_HEATMAP ? 'IA_heatmap01' : 'IA_heatmap02';

        return (
            <div>
                <h4 className={`${styles.labelHorizontal} ${styles.labelNormal}`}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Developmental Toxicity Heatmap <HelpButtonWidget stateHolder={this} headLevel={'h2'} title={title}/>
                </h4>
                <br/>
                <div className={styles.buttonRow}>
                    <h2>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button
                            onClick={() => this._exportCsv(d.data)}
                            className={`fa fa-download ${styles['pointer-button']}`}
                        ></button>
                        <span> Data</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button
                            onClick={() => svg_download_form(svgId)}
                            className={`fa fa-camera ${styles['pointer-button']}`}
                        ></button>
                        <span> Image</span>
                    </h2>
                </div>
            </div>

        );
    }

    _renderMain(d) {
        // console.log(this.props);

        if (this.props.visualization === INTVIZ_HEATMAP) {
            return (
                <Heatmap
                    data={d.data}
                    legendData={d.legendData}
                    ontologyType={this.props.ontologyType}
                />
            );
        } else {
            return (
                <DevtoxHeatmap
                    data={d.data}
                    legendData={d.legendData}
                    ontologyType={this.props.ontologyType}
                />
            );
        }
    }

    render() {
        if (!this.state.data) {
            return <Loading/>;
        }
        let d;
        d = this._getFilteredData();
        // this is result, with color name is fill data.
        if (d.data.length === 0) {
            return renderNoDataAlert();
        }

        return (
            <div>
                {this._renderButtons(d)}
                {this._renderHelpText()}
                {this._renderMain(d)}
            </div>
        );
    }
}

HeatmapHandler.propTypes = {
    assays: PropTypes.array.isRequired,
    casrns: PropTypes.array.isRequired,
    ontologyType: PropTypes.number.isRequired,
    ontologyGroup: PropTypes.array.isRequired,
    visualization: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    datasetLabName: PropTypes.array.isRequired,
};

export default HeatmapHandler;
