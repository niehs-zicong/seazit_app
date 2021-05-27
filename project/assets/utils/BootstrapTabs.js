import React from 'react';
import PropTypes from 'prop-types';

class BootstrapNavTabs extends React.Component {
    renderTab(key) {
        const tab = this.props.tabs[key],
            className = tab.title === this.props.activeTab.title ? 'active' : '';
        return (
            <li role="presentation" className={className} key={key}>
                <a href="#" onClick={tab.select}>
                    {tab.title}
                </a>
            </li>
        );
    }

    render() {
        return (
            <div>
                <ul className="nav nav-tabs" ref="tabs">
                    {Object.keys(this.props.tabs).map(this.renderTab.bind(this))}
                    {this.props.pullRight}
                </ul>
            </div>
        );
    }
}

BootstrapNavTabs.propTypes = {
    tabs: PropTypes.object.isRequired,
    activeTab: PropTypes.shape({
        title: PropTypes.string.isRequired,
        select: PropTypes.func.isRequired,
    }).isRequired,
    pullRight: PropTypes.element,
};

export default BootstrapNavTabs;
