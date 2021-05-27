import React from 'react';
import Plotly from 'Plotly';
import * as d3 from 'd3';
import PlotlyWrapper from 'utils/PlotlyWrapper';

class BmdChemicalPca extends PlotlyWrapper {
    constructor(props) {
        super(props);
        this.state = {};
    }

    _getUrl(bmdType) {
        return `/neurotox/api/${bmdType}/pca_chemical/?format=json`;
    }

    shouldComponentUpdate(nextProps, nextState) {
        let url = this._getUrl(nextProps.bmdType);
        d3.json(url, (d) => {
            Plotly.purge(this.refs.plot);
            this.renderPlotly(d.data, d.layout);
        });
        return false;
    }

    componentDidMount() {
        let url = this._getUrl(this.props.bmdType);
        d3.json(url, (d) => {
            this.renderPlotly(d.data, d.layout);
        });
    }
}

export default BmdChemicalPca;
