import React from 'react';
import BaseWidget from './BaseWidget';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';

const StylesTooltip3 = withStyles({
    tooltip: {
        // tooltip default color: rgba(97, 97, 97, 0.9)
        // font     color: "#fff",
        //
        // border: "2px solid black", // Add this line for the border
        // backgroundColor: "white"
    },
})(Tooltip);

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

        if (this.props.contentId !== stateHolder.state.helpButtonContentId) {
            stateHolder.setState({
                showHelpText: true,
                helpButtonContentId: this.props.contentId,
            });
        } else {
            stateHolder.setState({
                showHelpText: !stateHolder.state.showHelpText,
            });
        }
    }

    calculatePixelSize(headingLevel) {
        const fontSizeMapping = {
            h1: 1.6,
            h2: 1.5,
            h3: 1.3,
            h4: 1.2,
            label: 1.1,
        };
        const defaultFontSize = 16; // Default font size in pixels
        const headingFontSize = fontSizeMapping[headingLevel] || 1.0; // Default to 1.0 if not found
        return headingFontSize * defaultFontSize;
    }

    render() {
        const pixelSize = this.calculatePixelSize(this.props.headLevel);
        return (
            <div>
                <StylesTooltip3 title={this.props.title} arrow placement="right-end">
                    <button
                        style={{
                            paddingLeft: 15,
                            cursor: 'pointer', // Add cursor style here
                        }}
                        onClick={this.handleHelpTextToggle}
                    >
                        <div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={pixelSize}
                                height={pixelSize}
                                fill="#31708f"
                                className="bi bi-info-circle"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                            </svg>
                        </div>
                    </button>
                </StylesTooltip3>
            </div>
        );
    }
}

HelpButtonWidget.propTypes = {
    headLevel: PropTypes.string,
    title: PropTypes.string.isRequired,
};

export default HelpButtonWidget;
