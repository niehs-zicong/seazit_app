import React from 'react';
import DoseResponseMain from './DoseResponseMain';
import BmdByLabMain from './BmdByLabMain';
import IntegrativeAnalysesMain from './IntegrativeAnalysesMain';

// Tab key constants — match the URL hash values (#cr, #bmc, #int)
const TAB_CR = 'cr';
const TAB_BMC = 'bmc';
const TAB_INT = 'int';

const VALID_TABS = [TAB_CR, TAB_BMC, TAB_INT];

// Nav element IDs set in base.html
const NAV_IDS = {
    [TAB_CR]: 'nav-tab-cr',
    [TAB_BMC]: 'nav-tab-bmc',
    [TAB_INT]: 'nav-tab-int',
};

function getTabFromHash() {
    const hash = window.location.hash.replace('#', '');
    return VALID_TABS.includes(hash) ? hash : TAB_CR;
}

class SeazitApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: getTabFromHash(),
        };
        this.switchTab = this.switchTab.bind(this);
        this.handleHashChange = this.handleHashChange.bind(this);
    }

    componentDidMount() {
        // Wire nav tab link clicks to in-page switching
        VALID_TABS.forEach((tabKey) => {
            const el = document.getElementById(NAV_IDS[tabKey]);
            if (el) {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchTab(tabKey);
                });
            }
        });

        // Handle browser back/forward button
        window.addEventListener('hashchange', this.handleHashChange);

        // Set initial active class on nav
        this.updateNavActiveClass(this.state.activeTab);
    }

    componentWillUnmount() {
        window.removeEventListener('hashchange', this.handleHashChange);
    }

    handleHashChange() {
        const tabKey = getTabFromHash();
        this.setState({ activeTab: tabKey });
        this.updateNavActiveClass(tabKey);
    }

    switchTab(tabKey) {
        // Update URL hash (triggers hashchange, which updates state)
        window.location.hash = tabKey;
    }

    updateNavActiveClass(activeTab) {
        VALID_TABS.forEach((tabKey) => {
            const el = document.getElementById(NAV_IDS[tabKey]);
            if (el) {
                if (tabKey === activeTab) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.activeTab !== this.state.activeTab) {
            // Fire a resize event so Plotly/D3 plots re-measure their container
            // after being switched from display:none to display:block
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 50);
        }
    }

    render() {
        const { activeTab } = this.state;
        return (
            <div>
                <div style={{ display: activeTab === TAB_CR ? 'block' : 'none' }}>
                    <DoseResponseMain />
                </div>
                <div style={{ display: activeTab === TAB_BMC ? 'block' : 'none' }}>
                    <BmdByLabMain />
                </div>
                <div style={{ display: activeTab === TAB_INT ? 'block' : 'none' }}>
                    <IntegrativeAnalysesMain />
                </div>
            </div>
        );
    }
}

export default SeazitApp;
