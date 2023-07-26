import _ from 'lodash';
import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './graph.css';
import Loading from 'utils/Loading';

import Plotly from 'plotly.js-dist';
// import FileReaderInput from 'react-file-reader';

import {
    printFloat,
    pod_med_processed,
    integrativeHandleCellClick,
    NO_COLLAPSE,
    URL_SANKEYDATA,
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
            console.log('URL_SANKEYDATA');
            console.log(d);
            this.updateData(d);
        });
    }

    updateData(data) {
        // let Sankeydata = loadSankeydata(this);

        console.log(data);
        console.log(this.props.cells);

        let cells = this.props.cells,
            ontology = data.Seazit_ontology.filter(
                (item) =>
                    item.developmental_defect_grouping_general ===
                        cells.developmental_defect_grouping_general &&
                    item.protocol_source === cells.protocol_source
            ),
            flowsData = data.Seazit_ontology_sankey_flow,
            nodesData = data.Seazit_ontology_sankey_nodes,
            // flowsData = flows,
            // nodesData = nodes,
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
        this.renderPlot(plotData, nodesData);
    }

    renderPlot(d, nodes) {
        //
        // if (this.refs[d.key] === undefined) {
        //     return;
        // }
        let getStyledLabel = (label) => {
            if (label == this.props.cells.ontologyGroupName) {
                return `<span style='color: red; font-size: 20px; font-weight: bold;text-shadow: none; '>${label}</span>`;
            } else {
                return `<span style=' font-size: 20px; font-weight: bold;text-shadow: none;'>${label}</span>`;
            }
        };
        console.log(d);
        let fig = {
            node_name: nodes.map((item) => getStyledLabel(item.node_name)),
            node_color: nodes.map((item) => item.node_color),
            source_id: d.map((item) => parseInt(item.source_id)),
            target_id: d.map((item) => parseInt(item.target_id)),
            source_name: d.map((item) => item.source_name),
            target_name: d.map((item) => item.target_name),
            value: d.map((item) => item.value),
            flow_color: d.map((item) => item.flow_color),
        };
        console.log('fig', fig);

        var data = {
            type: 'sankey',
            node: {
                pad: 15,
                thickness: 20,
                line: {
                    color: 'black',
                    width: 0.5,
                },
                label: fig.node_name,
                color: fig.node_color,
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
            title: ` Sankey Plot <span style='color: red;font-weight: bold;'>${this.props.cells.ontologyGroupName}</span>`,
            width: 2000,
            height: 400,
            hoverlabel: {
                font: {
                    size: 30,
                },
            },
            font: {
                size: 20,
            },
        };

        Plotly.newPlot('SankeyPlot', [data], layout);
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

        let colNum = Math.ceil(12 / this.props.cols);

        return <div className={'row-fluid'} id="SankeyPlot"></div>;
    }
}

SankeyPlot.propTypes = {
    cells: PropTypes.array.isRequired,
};

export default SankeyPlot;
