import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import Loading from 'utils/Loading';

class Fetch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            json: null,
        };
    }

    componentWillMount() {
        fetch(this.props.url, { credentials: 'same-origin' })
            .then((response) => response.json())
            .then((json) => this.setState({ json, loaded: true }));
    }

    componentWillUnmount() {
        this.setState({ loaded: false });
    }

    render() {
        let DataComponent = this.props.component;
        return this.state.loaded ? (
            <div>
                <DataComponent data={this.props.processData(this.state.json)} />
            </div>
        ) : (
            <Loading />
        );
    }
}

Fetch.propTypes = {
    url: PropTypes.string,
    component: PropTypes.func.isRequired,
    processData: PropTypes.func.isRequired,
};

export default Fetch;
