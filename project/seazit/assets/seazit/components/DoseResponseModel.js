import React from 'react';
import PropTypes from 'prop-types';
import DoseResponse from './DoseResponse';
import DoseResponseGridWidget from '../widgets/DoseResponseGridWidget';

import {getDoseResponsesUrl, NO_COLLAPSE} from '../shared';

class Header extends React.Component {
    render() {
        return <h4>{this.props.title}</h4>;
    }
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
};

class SingleCurveBody extends React.Component {
    render() {
        let url = getDoseResponsesUrl(
            [this.props.protocol_id],
            [this.props.readout_id],
            [this.props.casrn]
        );
        return <DoseResponse
            url={url}
            cols={1}
            height={400}
            collapse={NO_COLLAPSE}
            devtoxreadout_ids={this.props.devtoxreadout_ids}
        />;
    }
}

SingleCurveBody.propTypes = {
    protocol_id: PropTypes.number.isRequired,
    readout_id: PropTypes.string.isRequired,
    casrn: PropTypes.array.isRequired,
    devtoxreadout_ids: PropTypes.string.isRequired,
};


class MultipleCurveBody extends React.Component {
    constructor(props) {
        super(props);
        // take 75% of the screen width since main body is col-9 size; assume
        // each plot is ~400px for a reasonable start, make sure it's at least 1
        let initialCols = Math.max(1, Math.floor(0.75 * window.innerWidth / 400));
        this.state = {
            // DoseResponseGridWidget
            vizColumns: initialCols,
            vizHeight: 350,
        };
    }

    render() {
        let url = getDoseResponsesUrl(
            [this.props.protocol_id],
            [this.props.readout_ids],
            [this.props.casrns]
        );
        console.log("this.props")
        console.log(this.props)
        return (
            <div className="row-fluid">
                <div className="col-sm-2">
                    <DoseResponseGridWidget stateHolder={this}/>
                </div>
                <div className="col-sm-10">
                    <DoseResponse
                        url={url}
                        cols={this.state.vizColumns}
                        height={this.state.vizHeight}
                        collapse={NO_COLLAPSE}
                        devtoxreadout_ids={this.props.devtoxreadout_ids}
                    />
                </div>
            </div>
        );
    }
}

MultipleCurveBody.propTypes = {
    protocol_id: PropTypes.number.isRequired,
    readout_ids: PropTypes.array.isRequired,
    casrns: PropTypes.array.isRequired,
    devtoxreadout_ids: PropTypes.array.isRequired,
};

export {Header};
export {SingleCurveBody};
export {MultipleCurveBody};
