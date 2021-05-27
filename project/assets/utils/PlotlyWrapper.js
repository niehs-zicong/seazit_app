import React from 'react';
import Plotly from 'Plotly';

class PlotlyWrapper extends React.Component {
    render() {
        return <div ref="plot" />;
    }

    renderPlotly(data, layout) {
        if (this.refs.plot && this.refs.plot.children.length > 0) {
            Plotly.update(this.refs.plot, data, layout);
        } else {
            Plotly.newPlot(this.refs.plot, data, layout);
        }
    }

    componentWillUnmount() {
        Plotly.purge(this.refs.plot);
    }
}

export default PlotlyWrapper;
