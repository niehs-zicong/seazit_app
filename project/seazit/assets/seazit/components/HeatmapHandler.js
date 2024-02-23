import React, { useState } from 'react';
import Modal from 'react-modal';
//import Popup from 'reactjs-popup';
import HelpButtonWidget from '../widgets/HelpButtonWidget';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import _ from 'lodash';
import Loading from 'utils/Loading';
import Heatmap from './Heatmap';
import DevtoxHeatmap from './DevtoxHeatmap';
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
    exportCsv,
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
        ////console.log(url);
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
                continuousColorScale = function(d) {
                    // console.log('d  and scale(d)')
                    // console.log(d)
                    console.log(scale(d));
                    console.log(d3.interpolateViridis(scale(d)));
                    return d3.interpolateViridis(scale(d));
                };

            this.setState({
                data,
                scale,
                continuousColorScale,
            });
        });
    }

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
        let getLegendData = function(visualization, scale, colorScale, colorCategory) {
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
            labDataset = this.props.labDataset,
            selectivityOrder = ['dev tox', 'general tox', 'inconclusive', 'inactive'],
            ontologyGroupType =
                ontologyGroup == integrative_Granular
                    ? 'developmental_defect_grouping_granular'
                    : 'developmental_defect_grouping_general';

        // find xgroups names, and join datasetLabname and ontologyGroup into xGroup.

        function transformDataItem(d, ontologyGroupType) {
            return {
                ...d,
                x: `${d[ontologyGroupType]}: ${d.protocol_name_plot}`,
                y: d.preferred_name,
                ontologyGroupName: d[ontologyGroupType],
                title: `${d[ontologyGroupType]}+${d.protocol_name_plot}+${d.preferred_name}`,
            };
        }

        function createXGroups(ontologyGroup, labDataset) {
            return _.uniqBy(
                ontologyGroup.flatMap((k) =>
                    labDataset.map((item) => ({
                        x: `${k}: ${item.protocol_name_plot}`,
                        ontologyGroupName: k,
                        ...item, // Include the rest of the data from labDataset
                    }))
                ),
                'x'
            );
        }

        function createYGroups(data) {
            //console.log(data)
            return _.chain(data)
                .map((item) => ({
                    casrn: item.casrn,
                    dtxsid: item.dtxsid,
                    preferred_name: item.preferred_name,
                    use_category1: item.use_category1,
                    y: item.y,
                }))
                .uniqBy('y') // Assuming you want unique combinations of x, y, z
                .value();
        }

        function processHeatmapDataItem(result, selectivityOrder, sortByKey, fillFunction) {
            const endpoints = _.chain(result)
                .map('endpoint_name')
                .uniq()
                .value();

            const devtoxEndpoints = _.chain(result)
                .filter((i) => i.final_dev_call === 'dev tox')
                .map('endpoint_name')
                .uniq()
                .value();

            const topFinal = _.chain(result)
                .map('final_dev_call')
                .uniq()
                .filter((d) => _.includes(selectivityOrder, d))
                .sort((a, b) => selectivityOrder.indexOf(a) - selectivityOrder.indexOf(b))
                .first()
                .value();

            const processedItem = _.chain(result)
                .filter((i) => i.final_dev_call === topFinal)
                .sortBy(sortByKey)
                .first()
                .value();

            processedItem.fill = fillFunction(processedItem);
            processedItem.endPointList = endpoints;
            processedItem.devtoxEndPointList = devtoxEndpoints;
            return processedItem;
        }

        function processHeatmapData(
            data,
            xgroups,
            ygroups,
            fillFunction,
            selectivityOrder,
            sortByKey
        ) {
            const processedData = [];

            for (const xItem of xgroups) {
                const x = xItem.x;
                for (const yItem of ygroups) {
                    const y = yItem.y;
                    const result = _.filter(data, { x: x, y: y });
                    if (result.length === 0) {
                        processedData.push({
                            ...yItem,
                            ...xItem,
                            fill: '#C9C9C9',
                        });
                    } else {
                        // //console.log(result)

                        const processedItem = processHeatmapDataItem(
                            result,
                            selectivityOrder,
                            sortByKey,
                            fillFunction
                        );
                        // //console.log(processedItem)
                        processedData.push(processedItem);
                    }
                }
            }
            return processedData;
        }

        // Main code

        data = _.chain(data)
            .filter((item) => ontologyGroup.includes(item[ontologyGroupType]))
            .map((d) => transformDataItem(d, ontologyGroupType))
            .sortBy('med_pod_med')
            .value();
        const xgroups = createXGroups(ontologyGroup, labDataset);
        const ygroups = createYGroups(data);
        // console.log(data, xgroups, ygroups)
        switch (this.props.visualization) {
            case INTVIZ_HEATMAP:
                return {
                    data: processHeatmapData(
                        data,
                        xgroups,
                        ygroups,
                        fillFunction,
                        selectivityOrder,
                        'mean_pod'
                    ),
                    legendData,
                };
            case INTVIZ_DevtoxHEATMAP:
                return {
                    data: processHeatmapData(
                        data,
                        xgroups,
                        ygroups,
                        fillFunction,
                        selectivityOrder,
                        'mean_pod'
                    ),
                    legendData,
                };
            default:
                throw 'Error: Unknown display type.';
        }
    }

    componentDidMount() {
        this.fetchIntegrativeData(this.props.url);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.url !== this.props.url) {
            this.setState({ data: null }); // Reset data to trigger loading state

            this.fetchIntegrativeData(this.props.url);
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
        // //console.log(d.data);
        const title =
            this.props.visualization === INTVIZ_HEATMAP
                ? 'More information on developmental toxicity classifications'
                : 'More information on BMC and specificity';

        const svgId = this.props.visualization === INTVIZ_HEATMAP ? 'IA_heatmap01' : 'IA_heatmap02';
        const csvfileName = 'IntegrativeAnalysesData.csv';
        const csvfileHeader = [
            {
                title: 'dataset name (long)',
                key: 'protocol_name_long',
            },
            {
                title: 'dataset name (short)',
                key: 'protocol_name_plot',
            },
            {
                title: 'dtxsid',
                key: 'dtxsid',
            },
            {
                title: 'casrn',
                key: 'casrn',
            },
            {
                title: 'test substance',
                key: 'preferred_name',
            },
            {
                title: 'use category',
                key: 'use_category1',
            },
            {
                title: 'selected phenotype term',
                key: 'ontologyGroupName',
            },
            {
                title: 'n endpoints in selected phenotype term',
                key: 'endPointList',
                method: 'length',
            },
            {
                title: 'n endpoints specific in selected phenotype term',
                key: 'devtoxEndPointList',
                method: 'length',
            },
            {
                title: 'phenotype term bmc (microM)',
                key: 'mean_pod',
                method: 'processMedPodMed',
            },
            {
                title: 'developmental toxicity classification',
                key: 'final_dev_call',
                method: 'map',
            },
            {
                title: 'mortality bmc (microM)',
                key: 'mort_med_pod_med',
                method: 'processMedPodMed',
            },
            {
                title: 'specificity',
                key: 'mean_selectivity',
            },
            {
                title: 'lowest tested conc (microM)',
                method: 'processMedPodMed',
                key: 'min_lowest_conc',
            },
            {
                title: 'highest tested conc (microM)',
                method: 'processMedPodMed',
                key: 'max_highest_conc',
            },
        ];
        //console.log(d.data)
        return (
            <div>
                <h4 className={`${styles.labelHorizontal} ${styles.labelNormal}`}>
                    {/*<h4>*/}
                    Developmental Toxicity Heatmap{' '}
                    <HelpButtonWidget stateHolder={this} headLevel={'h2'} title={title} />
                </h4>
                <div>
                    <h4 className={` ${styles.labelNormal}`}>
                        <button
                            onClick={() => exportCsv(d.data, csvfileName, csvfileHeader)}
                            className={`fa fa-download ${styles['pointer-button']}`}
                        ></button>
                        <span> Data</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button
                            onClick={() => svg_download_form(svgId)}
                            className={`fa fa-camera ${styles['pointer-button']}`}
                        ></button>
                        <span> Image</span>
                    </h4>
                </div>
            </div>
        );
    }

    _renderMain(d) {
        // //console.log(this.props);

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
            return <Loading />;
        }
        let d;
        d = this._getFilteredData();
        // this is res, ult, with color name is fill data.
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
    labDataset: PropTypes.array.isRequired,
};

export default HeatmapHandler;
