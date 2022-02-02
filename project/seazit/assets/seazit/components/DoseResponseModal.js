import React from 'react';
import PropTypes from 'prop-types';
import DoseResponse from './DoseResponse';
import DoseResponseGridWidget from '../widgets/DoseResponseGridWidget';

import { getDoseResponsesUrl, NO_COLLAPSE } from '../shared';

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
        // url is the input to locate data.
        // So if we need to compare, we may need to query data
        // for two urls
        console.log(this.props);
        let url = getDoseResponsesUrl(
            [this.props.protocol_id],
            [this.props.readout_id],
            [this.props.casrn]
        );
        console.log('SingleCurveBody');
        console.log(url);
        return <DoseResponse url={url} cols={1} height={400} collapse={NO_COLLAPSE} />;
    }
}
SingleCurveBody.propTypes = {
    protocol_id: PropTypes.number.isRequired,
    readout_id: PropTypes.string.isRequired,
    casrn: PropTypes.string.isRequired,
};

export { Header };
export { SingleCurveBody };
