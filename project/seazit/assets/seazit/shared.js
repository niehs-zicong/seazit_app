import _ from 'lodash';
import * as d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';
import Tooltip from '@material-ui/core/Tooltip';
import { Header, MultipleCurveBody, SingleCurveBody } from './components/DoseResponseModel';
import BootstrapModal from 'utils/BootstrapModal';

const AXIS_LINEAR = 1,
    AXIS_LOG10 = 2,
    AXIS_SQRT = 3,
    BMD_CURVEP = 1,
    BMD_HILL = 2,
    BMD_CW = {
        1: 'curvep',
        2: 'hill',
    },
    integrative_Granular = 1,
    integrative_General = 2,
    CATEGORY_COLORS = {
        'Assay specific control': '#ee7621',
        Botanical: '#fff590',
        Drug: '#3182bd',
        'Drug*': '#9ecae1',
        'Flame Retardant': '#E7BA52',
        Fungicide: '#F9D70B',
        Herbicide: '#3BD6C6',
        Industrial: '#31A354',
        'Industrial-PFAS': '#69BE77',
        'Industrial*': '#A1D99B',
        'Insect repellent': '#971C53',
        'Insect repellant': '#971C53',
        Insecticide: '#D62976',
        Miscellaneous: '#EECCAA',
        Negative: '#636363',
        PAH: '#756bb1',
        Pesticide: '#AD494A',
        'Pesticide*': '#d6616b',
    },
    CHEMFILTER_CATEGORY = 1,
    CHEMFILTER_CHEMICIAL = 2,
    CHEMLIST_80 = 1,
    CHEMLIST_91 = 2,
    CHEMLIST_ALL = 3,
    ConcentrationResponseTab = 1,
    BMCTab = 2,
    IntegrativeAnalysesTab = 3,
    COLLAPSE_BY_CHEMICAL = 'COLLAPSE_BY_CHEMICAL',
    COLLAPSE_BY_READOUT = 'COLLAPSE_BY_READOUT',
    NO_COLLAPSE = 'NO_COLLAPSE',
    COLLAPSE_WITH_Mortality120 = 'COLLAPSE_WITH_Mortality120',
    URL_CHEMXLSX = '/static_seazit/resources/seazit/NTP%20Chemical%20Library.xlsx',
    URL_METADATA = '/seazit/api/seazit_metadata/metadata/?format=json',
    // ConcentrationResponse URL
    URL_CR = '/seazit/api/seazit_result/crResult/',
    // BMC by lab URL
    URL_BMD = '/seazit/api/seazit_result/bmcByLabResult/',
    URL_INTEGRATIVE = '/seazit/api/seazit_result/integrativeResult/',
    INTVIZ_HEATMAP = 1,
    INTVIZ_DevtoxHEATMAP = 2,
    BMDVIZ_ACTIVITY = 1,
    BMDVIZ_SELECTIVITY = 2,
    HEATMAP_ACTIVITY = 1,
    HEATMAP_BMC = 2,
    READOUT_TYPE_READOUT = 1,
    READOUT_TYPE_CATEGORY = 2,
    SELECTIVITY_FOOTNOTE =
        'Selectivity is estimated and true value may be higher; viability BMC could not be calculated and was therefore estimated to equal the maximum tested dose.',
    loadMetadata = function(component) {
        d3.json(URL_METADATA, (d) => {
            // console.log('d');
            // console.log(d);
            component.setState({
                metadataLoaded: true,
                protocol_data: d.protocol_data,
                Seazit_chemical_info: d.Seazit_chemical_info,
                Seazit_ui_panel: d.Seazit_ui_panel,
                Seazit_ui_panel2: d.Seazit_ui_panel2,
                Seazit_ontology: d.Seazit_ontology,
            });
        });
    },
    data_exportToJsonFile = function(jsonData) {
        let filename = 'jsonData.json';

        let dataStr = JSON.stringify(jsonData);
        let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', filename);
        linkElement.click();
    },
    renderSelectMultiWidget = function(name, label, options, values, handleChange) {
        let size = Math.min(options.length, 11);
        return (
            <div>
                <label>Select {label}(s):</label>
                <select
                    name={name}
                    className="form-control"
                    multiple={true}
                    size={size}
                    onChange={handleChange}
                    value={values}
                >
                    {options.map((d) => {
                        if (d.description) {
                            return (
                                <Tooltip title={d.description} placement="top">
                                    <option key={d.key} value={d.key}>
                                        {d.label}
                                    </option>
                                </Tooltip>
                            );
                        } else {
                            return (
                                <option key={d.key} value={d.key}>
                                    {d.label}
                                </option>
                            );
                        }
                    })}
                </select>
            </div>
        );
    },
    renderSelectSingleWidget = function(name, label, options, values, handleChange) {
        return (
            <div>
                <label>Select one {label}:</label>
                <select
                    name={name}
                    className="row form-control"
                    onChange={handleChange}
                    size={Math.min(options.length, 11)}
                    value={values}
                >
                    {options.map((d) => {
                        if (d.description) {
                            return (
                                <Tooltip title={d.description} placement="top">
                                    <option key={d.key} value={d.key}>
                                        {d.label}
                                    </option>
                                </Tooltip>
                            );
                        } else {
                            return (
                                <option key={d.key} value={d.key}>
                                    {d.label}
                                </option>
                            );
                        }
                    })}
                </select>
            </div>
        );
    },
    renderSelectMultiOptgroupWidget = function(name, label, options, values, handleChange) {
        let size = 10;
        return (
            <div>
                <label>Select {label}(s):</label>
                <select
                    name={name}
                    className="form-control"
                    multiple={true}
                    size={size}
                    onChange={handleChange}
                    value={values}
                >
                    {_.map(options, (value, category) => {
                        // console.log("selecttions", options, value, category)
                        return (
                            <optgroup key={category} label={category}>
                                {value.map((d) => (
                                    <option title={d.description} key={d.key} value={d.key}>
                                        {d.label}
                                    </option>
                                ))}
                            </optgroup>
                        );
                    })}
                </select>
            </div>
        );
    },
    insertIntoDom = function(Component, el) {
        ReactDOM.render(React.createElement(Component), el);
    },
    getDoseResponsesUrl = function(protocol_ids, readout_ids, casrns) {
        if (protocol_ids.length === 0 || readout_ids.length === 0 || casrns.length === 0) {
            return null;
        }
        let ids = protocol_ids.join(','),
            ro = readout_ids.join(','),
            chems = casrns.join(',');
        // return url, ro is the readout_id
        // console.log(ids, ro, chems);
        return `${URL_CR}?format=json&protocol_ids=${ids}&readouts=${ro}&casrns=${chems}`;
    },
    getBmdsUrl = function(protocol_id, readout_ids) {
        if (protocol_id.length === 0 || readout_ids.length === 0) {
            return null;
        }
        let id = protocol_id,
            ro = readout_ids.join(',');
        // return url, ro is the readout_id
        // Mortality@120
        return `${URL_BMD}?format=json&protocol_ids=${id}&readouts=${ro}`;
    },
    getIntegrativeUrl = function(protocol_ids, casrns) {
        if (protocol_ids.length === 0 || casrns.length === 0) {
            return null;
        }
        let ids = protocol_ids.join(','),
            chems = casrns.join(',');
        // return url, ro is the readout_id
        // console.log(ids, ro, chems);
        return `${URL_INTEGRATIVE}?format=json&protocol_ids=${ids}&casrns=${chems}`;
    },
    printFloat = function(v) {
        if (v <= 0) {
            return '-';
        } else if (v <= 0.01 || v >= 1000) {
            return v.toExponential(2).toUpperCase();
        } else {
            return v.toFixed(2);
        }
    },
    pod_med_processed = function(v) {
        if (typeof v === 'number') {
            return Math.pow(10, v) * 1000000;
        }
    },
    svg_download_form = function(id) {
        var svg = document.getElementById(id);

        var today = new Date();
        var filename =
            today.getFullYear() +
            '-' +
            (today.getMonth() + 1) +
            '-' +
            today.getDate() +
            '-' +
            today.getHours() +
            '-' +
            today.getMinutes() +
            '-' +
            today.getSeconds() +
            '.svg';
        var svg_xml = new XMLSerializer().serializeToString(svg);
        var element = document.createElement('a');
        element.setAttribute(
            'href',
            'data:text/plain;charset=utf-8,' + encodeURIComponent(svg_xml)
        );
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },
    integrativeHandleCellClick = function(d) {
        if (d.endPointList) {
            if (d.endPointList && d.endPointList.length > 1) {
                new BootstrapModal(Header, MultipleCurveBody, {
                    title: d.title,
                    protocol_id: d.protocol_id,
                    readout_ids: _.map(d.endPointList, function(x) {
                        return x + '_' + d.protocol_id;
                    }),
                    // if button checked, we will add mortality@120 to each plot
                    casrns: [d.casrn],
                    devtoxreadout_ids: d.devtoxEndPointList,
                });
            } else {
                new BootstrapModal(Header, SingleCurveBody, {
                    title: d.title,
                    protocol_id: d.protocol_id,
                    readout_id: d.endpoint_name + '_' + d.protocol_id,
                    casrn: d.casrn,
                    devtoxreadout_ids: d.devtoxEndPointList,
                    // devtoxreadout_ids: d.devtoxEndPointList+ '_' + d.protocol_id,
                });
            }
        }
    },
    BMCHandleCellClick = function(d) {
        if (d.endPointList) {
            if (d.endPointList && d.endPointList.length > 1) {
                new BootstrapModal(Header, MultipleCurveBody, {
                    title: d.title,
                    protocol_id: d.protocol_id,
                    readout_ids: _.map(d.endPointList, function(x) {
                        return x + '_' + d.protocol_id;
                    }),
                    // if button checked, we will add mortality@120 to each plot
                    casrns: [d.casrn],
                    devtoxreadout_ids: d.devtoxEndPointList,
                });
            } else {
                new BootstrapModal(Header, SingleCurveBody, {
                    title: d.title,
                    protocol_id: d.protocol_id,
                    readout_id: d.endpoint_name + '_' + d.protocol_id,
                    casrn: d.casrn,
                    devtoxreadout_ids: d.devtoxEndPointList,
                    // devtoxreadout_ids: d.devtoxEndPointList+ '_' + d.protocol_id,
                });
            }
        }
    },
    renderNoDataAlert = function() {
        return (
            <div className="alert alert-info">
                <p>
                    This combination of <b>endpoints</b> and <b>chemicals</b> returned no data.
                </p>
            </div>
        );
    },
    renderNoSelected = function(d) {
        return (
            <div className="alert alert-info">
                <ul>
                    {d.hasReadouts !== undefined && !d.hasReadouts ? (
                        <li>
                            No <b>readouts</b> are selected. Please select at least one readout (you
                            must first select one or more assays).
                        </li>
                    ) : null}
                    {d.hasReadoutCategories !== undefined && !d.hasReadoutCategories ? (
                        <li>
                            No <b>endpoint categories</b> are selected. Please select at least one
                            endpoint-category.
                        </li>
                    ) : null}
                    {d.hasChems !== undefined && !d.hasChems ? (
                        <li>
                            No <b>chemicals</b> are selected. Please select at least one chemical or
                            chemical-category.
                        </li>
                    ) : null}
                </ul>
            </div>
        );
    };

export {
    AXIS_LINEAR,
    AXIS_LOG10,
    AXIS_SQRT,
    BMD_CURVEP,
    BMD_HILL,
    BMD_CW,
    integrative_Granular,
    integrative_General,
    CATEGORY_COLORS,
    CHEMFILTER_CATEGORY,
    CHEMFILTER_CHEMICIAL,
    ConcentrationResponseTab,
    BMCTab,
    IntegrativeAnalysesTab,
    CHEMLIST_80,
    CHEMLIST_91,
    CHEMLIST_ALL,
    COLLAPSE_BY_CHEMICAL,
    COLLAPSE_BY_READOUT,
    COLLAPSE_WITH_Mortality120,
    NO_COLLAPSE,
    HEATMAP_ACTIVITY,
    HEATMAP_BMC,
    INTVIZ_DevtoxHEATMAP,
    INTVIZ_HEATMAP,
    BMDVIZ_ACTIVITY,
    BMDVIZ_SELECTIVITY,
    READOUT_TYPE_READOUT,
    READOUT_TYPE_CATEGORY,
    SELECTIVITY_FOOTNOTE,
    URL_CHEMXLSX,
    getDoseResponsesUrl,
    getBmdsUrl,
    getIntegrativeUrl,
    loadMetadata,
    renderSelectMultiWidget,
    renderSelectSingleWidget,
    renderSelectMultiOptgroupWidget,
    insertIntoDom,
    printFloat,
    renderNoDataAlert,
    renderNoSelected,
    data_exportToJsonFile,
    svg_download_form,
    integrativeHandleCellClick,
    BMCHandleCellClick,
    pod_med_processed,
};
