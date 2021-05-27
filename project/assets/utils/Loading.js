import React from 'react';

class Loading extends React.Component {
    render() {
        return (
            <div>
                <b>Loading... </b>
                <i className="fa fa-cog fa-spin fa-fw" />
            </div>
        );
    }
}

export default Loading;
