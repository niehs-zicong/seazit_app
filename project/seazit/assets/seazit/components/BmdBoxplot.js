import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Plotly from 'Plotly';
import * as d3 from 'd3';
import PlotlyWrapper from 'utils/PlotlyWrapper';
import { READOUT_TYPE_READOUT, READOUT_TYPE_CATEGORY, renderNoDataAlert } from '../shared';

let getBoxplotData = function(data, props) {
    let { casrns, readouts, readoutCategories, readoutType } = props,
        readout_ids = readouts.map((d) => parseInt(d)),
        boxes,
        layout,
        title;

    switch (readoutType) {
        case READOUT_TYPE_READOUT: {
            title = 'BMC distribution by readout';
            boxes = _.chain(data)
                .filter((d) => d.bmd > 0)
                .filter((d) => _.includes(casrns, d.chemical_casrn))
                .filter((d) => _.includes(readout_ids, d.readout_id))
                .groupBy('readout_id')
                .values()
                .map(function(d) {
                    return {
                        boxmean: true,
                        boxpoints: 'all',
                        jitter: 0.35,
                        name: d[0].readout_endpoint,
                        pointpos: 0,
                        type: 'box',
                        y: _.map(d, 'bmd'),
                    };
                })
                .value();
            break;
        }
        case READOUT_TYPE_CATEGORY: {
            title = 'BMC distribution by endpoint category';
            boxes = _.chain(data)
                .filter((d) => d.bmd > 0)
                .filter((d) => _.includes(casrns, d.chemical_casrn))
                .filter((d) => _.includes(readoutCategories, d.provider_category))
                .groupBy('provider_category')
                .values()
                .map(function(d) {
                    return {
                        boxmean: true,
                        boxpoints: 'all',
                        jitter: 0.35,
                        name: d[0].provider_category,
                        pointpos: 0,
                        type: 'box',
                        y: _.map(d, 'bmd'),
                    };
                })
                .value();
            break;
        }
        default: {
            throw 'Unknown readoutType';
        }
    }

    layout = {
        title,
        yaxis: {
            title: 'BMC (µM)',
            autorange: true,
            showgrid: true,
            type: 'log',
            nticks: 100,
        },
        margin: {
            l: 50,
            r: 100,
            b: 150,
            t: 30,
        },
        showlegend: false,
        height: 800,
    };

    return {
        data: boxes,
        layout,
    };
};

class BmdBoxplot extends PlotlyWrapper {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            noDataSelected: true,
        };
    }

    _updateData(bmdType) {
        let url = `/neurotox/api/${bmdType}/bmds/?format=tsv`,
            cleanRow = function(row) {
                return {
                    id: +row.id,
                    bmd: +row.bmd,
                    substance_id: +row.substance_id,
                    chemical_casrn: row.chemical_casrn,
                    chemical_name: row.chemical_name,
                    provider_category: `${row.protocol_provider}: ${row.readout_category}`,
                    readout_endpoint: row.readout_endpoint,
                    readout_id: +row.readout_id,
                };
            },
            formatData = (error, data) => {
                this.setState({
                    data,
                });
            };

        d3.tsv(url, cleanRow, formatData);
    }

    renderPlot() {
        let d = getBoxplotData(this.state.data, this.props);

        if (this.refs.plot) {
            Plotly.purge(this.refs.plot);
        }

        if (
            (d.data.length > 0 && this.state.noDataSelected === true) ||
            (d.data.length === 0 && this.state.noDataSelected === false)
        ) {
            this.setState({ noDataSelected: !this.state.noDataSelected });
            return;
        } else if (d.data.length > 0) {
            this.renderPlotly(d.data, d.layout);
        }
    }

    componentWillMount() {
        this._updateData(this.props.bmdType);
    }

    componentDidUpdate() {
        this.renderPlot();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.bmdType !== this.props.bmdType) {
            this._updateData(nextProps.bmdType);
        }
        return true;
    }

    render() {
        if (this.state.noDataSelected) {
            return renderNoDataAlert();
        }
        return <div id="IA_Boxplot01" ref="plot" />;
    }
}

BmdBoxplot.propTypes = {
    casrns: PropTypes.array.isRequired,
    readouts: PropTypes.array.isRequired,
    readoutType: PropTypes.number.isRequired,
    bmdType: PropTypes.string.isRequired,
    readoutCategories: PropTypes.array.isRequired,
};

export default BmdBoxplot;
