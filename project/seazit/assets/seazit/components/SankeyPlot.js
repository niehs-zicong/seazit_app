import _ from 'lodash';
import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'utils/Loading';
import HelpButtonWidget from '../widgets/HelpButtonWidget';
import Plotly from 'Plotly';
// import FileReaderInput from 'react-file-reader';

import {
    printFloat,
    pod_med_processed,
    NO_COLLAPSE,
    URL_SANKEYDATA,
    integrative_General,
    integrative_Granular,
    INTVIZ_HEATMAP,
} from '../shared';

class SankeyPlot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // loadMetadata
            // sankeydataLoaded: false,
            // sankeydata: null,
            ontologydata: [],
            nodesData: [],
            scale: _.noop,
            error: null,
            labelsDict: {},
        };
    }

    fetchSankeyData() {
        d3.json(URL_SANKEYDATA, (d) => {
            ////console.log('URL_SANKEYDATA');
            ////console.log(d);
            this.updateData(d);
        });
    }

    updateData(data) {
        let cells = this.props.cells,
            ontology = data.Seazit_ontology.filter(
                (item) =>
                    item.developmental_defect_grouping_general ===
                        cells.developmental_defect_grouping_general &&
                    item.protocol_source === cells.protocol_source
            ),
            flowsData = data.Seazit_ontology_sankey_flow,
            nodesData = data.Seazit_ontology_sankey_nodes,
            plotData,
            filterDataFun = (dataA, dataB) => {
                // Filter dataA based on some condition
                let result = _.filter(dataA, (a) => {
                    return _.some(
                        dataB,
                        (b) =>
                            (_.isEqual(a.target_name, b.proposed_ontology_label) &&
                                _.isEqual(a.source_name, b.recording_name)) ||
                            (_.isEqual(a.target_name, b.developmental_defect_grouping_granular) &&
                                _.isEqual(a.source_name, b.proposed_ontology_label)) ||
                            (_.isEqual(a.target_name, b.developmental_defect_grouping_general) &&
                                _.isEqual(a.source_name, b.developmental_defect_grouping_granular))
                    );
                });
                return result;
            },
            joinDataFun = (dataA, dataB) => {
                const result = _.map(dataA, (itemA) => {
                    const matchedItem = _.find(dataB, { node_name: itemA.source_name });
                    if (matchedItem) {
                        return _.assign({}, itemA, matchedItem);
                    }
                    return itemA;
                });
                return result;
            },
            valueCountsFun = (data) => {
                data.forEach((i) => {
                    const count = data.filter((item) => item.target_id === i.source_id).length;
                    i.value = count > 0 ? count : 1;
                });
                return data;
            };

        plotData = filterDataFun(flowsData, ontology);
        plotData = joinDataFun(plotData, nodesData);
        plotData = valueCountsFun(plotData);
        //console.log(plotData)

        this.renderPlot(plotData, nodesData);
    }

    renderPlot(links, nodes) {
        // console.log(links, nodes)
        //
        // if (this.refs[d.key] === undefined) {
        //     return;
        // }
        let ontologyType =
            this.props.cells.ontologyType == integrative_Granular ? 'granular' : 'general';
        let getStyledLabel = (node_name, node_level) => {
            const style = {
                'font-weight': 'bold',
                'font-size': '15px',
                'text-shadow': 'none',
                color:
                    node_name === this.props.cells.ontologyGroupName && node_level === ontologyType
                        ? 'red'
                        : 'inherit',
            };

            const styleString = Object.entries(style)
                .map(([key, value]) => `${key}: ${value}`)
                .join(';');
            return `<span style='${styleString}'>${node_name}</span>`;
        };

        let getNodeLevelLabel = (node_level) => {
            const style = {
                'font-weight': 'bold',
                'font-size': '15px',
                'text-shadow': 'none',
            };
            const contentMap = {
                recording: 'Laboratory Specific Recording Term:',
                term: 'Phenotype Ontology Term:',
                granular: 'Granular Phenotype Term:',
                general: 'General Phenotype Term:',
            };

            const content = contentMap[node_level] || '';
            const styleString = Object.entries(style)
                .map(([key, value]) => `${key}: ${value}`)
                .join(';');
            return `<span style='${styleString}'>${content}</span>`;
        };

        let fig = {
            node_name: nodes.map((item) => getStyledLabel(item.node_name, item.node_level)),
            node_hovertext: nodes.map((item) => getNodeLevelLabel(item.node_level)),
            node_color: nodes.map((item) => item.node_color),
            source_id: links.map((item) => parseInt(item.source_id)),
            target_id: links.map((item) => parseInt(item.target_id)),
            source_name: links.map((item) => item.source_name),
            target_name: links.map((item) => item.target_name),
            value: links.map((item) => item.value),
            flow_color: links.map((item) => item.flow_color),
        };

        var data = {
            type: 'sankey',
            orientation: 'h', // Horizontal orientation
            node: {
                pad: 15,
                thickness: 20,
                line: {
                    color: 'black',
                    width: 0.5,
                },
                label: fig.node_name,
                color: fig.node_color,
                customdata: fig.node_hovertext,
                hovertemplate: '%{customdata}<br />%{label}',
            },

            link: {
                source: fig.source_id,
                target: fig.target_id,
                color: fig.flow_color,
                value: fig.value,
            },
        };
        // Define the layout options for the Sankey plot
        var layout = {
            // title: ` Sankey Diagram of <span style='color: red;font-weight: bold;'>${this.props.cells.ontologyGroupName}</span>`,
            // i use width to be 2400 to avoid node label overlapping.
            autosize: true,
            font: {
                size: 20,
            },
            hoverlabel: {
                font: {
                    size: 20,
                },
            },
        };

        // Now filteredNodes contains only the nodes relevant to your link data
        Plotly.newPlot('SankeyPlot', [data], layout);
    }

    _renderHelpText() {
        if (!this.state.showHelpText) {
            return null;
        }
        return (
            <div className="alert alert-info">
                <p>
                    Relationship of zebrafish developmental phenotype terminologies starting with
                    the laboratory specific reporting term, Zebrafish Phenotype ontology, granular
                    and general developmental phenotype terms.
                </p>
                <p>
                    The numbers included in the hover over boxes indicate the number of ontology
                    terms associated with the altered phenotype. Red text indicates the final
                    phenotype selected under Select developmental phenotype group.
                </p>
                <p>
                    Background color refers to the hierarchical relationship of all zebrafish
                    phenotype ontologies included in both DRF and Def studies and are described on
                    the datasets page.
                </p>
            </div>
        );
    }

    componentWillMount() {
        // loadSankeydata(this);
    }

    componentDidMount() {
        this.fetchSankeyData();
    }

    componentWillUnmount() {
        Plotly.purge('SankeyPlot');
    }

    render() {
        if (this.state.error) {
            return (
                <div className="alert alert-warning">
                    <p>
                        <b>{this.state.error}</b>
                    </p>
                </div>
            );
        }

        return (
            <div>
                <h4 className="label-horizontal">
                    &nbsp;&nbsp;&nbsp; Sankey Diagram
                    <HelpButtonWidget
                        stateHolder={this}
                        headLevel={'h2'}
                        title={'More information on ontology and phenotype terms'}
                    />
                </h4>
                {this._renderHelpText()}
                <br />
                <div className="row  " id="SankeyPlot"></div>
            </div>
        );
    }
}

SankeyPlot.propTypes = {
    cells: PropTypes.array.isRequired,
};

export default SankeyPlot;
