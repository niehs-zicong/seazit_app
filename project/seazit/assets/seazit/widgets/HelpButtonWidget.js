import React from 'react';
import BaseWidget from './BaseWidget';

class HelpButtonWidget extends BaseWidget {
    /*
    HelpButtonWidget requires the following state properties:
        - stateHolder.state.showHelpText is one of the enumerations above
    */

    constructor(props) {
        super(props);
        this.handleHelpTextToggle = this.handleHelpTextToggle.bind(this);
    }

    handleHelpTextToggle() {
        let stateHolder = this.props.stateHolder;
        stateHolder.setState({ showHelpText: !stateHolder.state.showHelpText });
    }

    render() {
        return (
            <button
                style={{ fontSize: '0.7em', paddingLeft: 10 }}
                title="Click to toggle help-text"
                onClick={this.handleHelpTextToggle}
            >
                <i className="pull-right fa fa-question-circle" />
            </button>
        );
    }
}

export default HelpButtonWidget;
