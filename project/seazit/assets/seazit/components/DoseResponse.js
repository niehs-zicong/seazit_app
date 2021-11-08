import _ from 'lodash';
import * as d3 from 'd3';
import React from 'react';
import PropTypes from 'prop-types';

import Plotly from 'Plotly';

import { NO_COLLAPSE, COLLAPSE_BY_READOUT, COLLAPSE_BY_CHEMICAL, printFloat } from '../shared';

const NO_COLLAPSE_COLORS = {
    responses: '#76B425',
    curvep: '#1451a5',
    hill: '#A52D29',
};

class DoseResponse extends React.Component {
    constructor(props) {
        super(props);
        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        this.state = {
            data: [],
            scale: _.noop,
            collapsedData: [],
            error: null,
        };
    }

    //     _updateData() {
    //
    // //        let url = `/seazit/api/seazit_cr4/doses/?format=tsv`,
    //         let url = `/seazit/api/seazit_cr4/doses/?format=json`,
    // //        let url = `/seazit/api/seazit_cr6/metadata/?format=json`,
    //
    //             cleanRow = function(row) {
    //                 return {
    //                     dose: +row.dose,
    //                     dose_unit: +row.dose_unit,
    //                     protocol_source: +row.protocol_source,
    //                     dose_id: row.dose_id,
    //                 };
    //             },
    //
    //             formatData = (error, data) => {
    //                 this.setState({
    //                     data,
    //                 });
    //             };
    //         d3.tsv(url, cleanRow, formatData);
    //     }

    fetchDoseResponseData(url) {
        d3.json(url, (error, data) => {
            if (error) {
                let err = error.target.responseText.replace('["', '').replace('"]', '');
                this.setState({
                    data: [],
                    error: err,
                });
                return;
            }
            console.log('data');
            console.log(url);
            console.log(data);
        });
    }

    // updateData(data, collapse) {
    //     this.setKeys(data, collapse);
    //     let update = this.collapseData(data, collapse);
    //     let scale = this.getColorScale(update.collapsedData, collapse);
    //     this.setState({
    //         ...update,
    //         scale,
    //     });
    // }

    loadDoseResponse() {
        // this.state.collapsedData.map((d) => this._renderPlot(d, this.state.yrange));
        //    TODO
    }

    componentWillMount() {
        this.fetchDoseResponseData(this.props.url);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.url !== this.props.url) {
            this.fetchDoseResponseData(nextProps.url);
        }
        if (nextProps.collapse !== this.props.collapse) {
            this.updateData(this.state.data, nextProps.collapse);
        }
    }

    componentDidMount() {
        this.loadDoseResponse();
    }

    componentDidUpdate() {
        this.loadDoseResponse();
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
                <p>DoseResponse part zw1</p>
            </div>
        );
    }
}

DoseResponse.propTypes = {
    cols: PropTypes.number.isRequired,
    collapse: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
};

export default DoseResponse;
