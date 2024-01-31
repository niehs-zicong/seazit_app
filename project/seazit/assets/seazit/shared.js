import _ from 'lodash';
import * as d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';
import Tooltip from '@material-ui/core/Tooltip';
import { Header, MultipleCurveBody, SingleCurveBody } from './components/BootstrapBodyPart';
import BootstrapModal from 'utils/BootstrapModal';
import styles from './style.css';

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
        Insecticide: '#d62976',
        Fungicide: '#f9d70b',
        Herbicide: '#3BD6C6',
        'Positive Control': '#ee7621',
        Preservative: '#c89f73',
        'Industrial Compound': '#31a354',
        PAH: '#756bb1',
        'Flame Retardant': '#e7ba52',
        Drug: '#3182bd',
        'Vehicle Control': '#ee7621',
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
    URL_SANKEYDATA = '/seazit/api/seazit_sankeydata/sankeydata/?format=json',
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
    loadMetadata = function(component) {
        d3.json(URL_METADATA, (d) => {
            // //console.log('d');
            // //console.log(d);
            component.setState({
                metadataLoaded: true,
                protocol_data: d.protocol_data,
                Seazit_chemical_info: d.Seazit_chemical_info,
                Seazit_ui_panel: d.Seazit_ui_panel,
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
    renderSelectMultiWidget = function(
        name,
        label,
        options,
        values,
        handleChange,
        helpButtonWidget = null,
        renderHelpText = null
    ) {
        let size = Math.min(options.length, 11);
        //console.log(options);
        return (
            <div>
                <label className={styles.labelHorizontal}>
                    Select {label}(s):
                    {helpButtonWidget && helpButtonWidget()}
                </label>
                {renderHelpText && renderHelpText()}
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
    renderSelectSingleWidget = function(
        name,
        label,
        options,
        values,
        handleChange,
        helpButtonWidget = null,
        renderHelpText = null
    ) {
        return (
            <div>
                <label className={styles.labelHorizontal}>
                    Select one {label}:{helpButtonWidget && helpButtonWidget()}
                </label>
                {renderHelpText && renderHelpText()}

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
    renderSelectMultiOptgroupWidget = function(
        name,
        label,
        options,
        values,
        handleChange,
        helpButtonWidget = null,
        renderHelpText = null
    ) {
        let size = 10;
        //console.log(options);

        return (
            <div>
                <label className={styles.labelHorizontal}>
                    Select {label}(s):{helpButtonWidget && helpButtonWidget()}
                </label>
                {renderHelpText && renderHelpText()}

                <select
                    name={name}
                    className="form-control"
                    multiple={true}
                    size={size}
                    onChange={handleChange}
                    value={values}
                >
                    {_.map(options, (value, category) => {
                        //console.log(value);

                        return (
                            <optgroup key={category} label={category}>
                                {value.map((d) => {
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
        // //console.log(ids, ro, chems);
        return `${URL_CR}?format=json&protocol_ids=${ids}&readouts=${ro}&casrns=${chems}`;
    },
    getBmdsUrl = function(protocol_id, readout_ids) {
        if (protocol_id.length === 0 || readout_ids.length === 0) {
            return null;
        }
        // //console.log(protocol_id, readout_ids)
        let newReadout = 'Mortality@120' + '_' + protocol_id;
        readout_ids.push(newReadout); // Modifying the array by adding a new element
        // //console.log(protocol_id, readout_ids)

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
        // //console.log(ids, ro, chems);
        return `${URL_INTEGRATIVE}?format=json&protocol_ids=${ids}&casrns=${chems}`;
    },
    getSankeyPlotUrl = function(protocol_ids, casrns) {
        if (protocol_ids.length === 0 || casrns.length === 0) {
            return null;
        }
        let ids = protocol_ids.join(','),
            chems = casrns.join(',');
        // return url, ro is the readout_id
        // //console.log(ids, ro, chems);
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
    exportCsv = function(jsonData, filename, headerMappings) {
        if (jsonData.length === 0) {
            return '';
        }
        //console.log(jsonData);
        const columnDelimiter = ',';
        const lineDelimiter = '\n';

        // Extract keys and sections from headerMappings
        const selectedKeys = headerMappings.map((mapping) => ({
            key: mapping.key,
            section: mapping.section,
            method: mapping.method,
        }));

        //console.log(selectedKeys);

        const csvColumnHeader = headerMappings
            .map((mapping) => mapping.title)
            .join(columnDelimiter);
        let csvStr = csvColumnHeader + lineDelimiter;

        const extractValue = (item, key, section, method) => {
            // Handle nested properties within a specific section
            if (section) {
                const sectionKeys = section.split('.');
                let sectionData = item;
                for (const sectionKey of sectionKeys) {
                    sectionData = sectionData[sectionKey];
                    if (sectionData === undefined) {
                        return '';
                    }
                }
                return applyMethod(sectionData[key], method);
            } else {
                // Handle flat properties
                return applyMethod(item[key], method);
            }
        };

        const applyMethod = (value, method) => {
            // Apply the specified method to the value
            switch (method) {
                case 'processMedPodMed':
                    const processedValue = pod_med_processed(value);

                    if (processedValue !== undefined) {
                        return printFloat(processedValue);
                    } else {
                        return processedValue;
                    }

                case 'length':
                    // return value.length;
                    return value && value.length !== undefined ? value.length : 0;

                case 'cat':
                    return Array.isArray(value) ? value.join(' | ') : value;
                case 'map':
                    const mapList = [
                        {
                            name: 'dev tox',
                            label: 'specific',
                        },
                        {
                            name: 'general tox',
                            label: 'non-specific',
                        },
                        {
                            name: 'inconclusive',
                            label: 'inconclusive, more tests are needed',
                        },
                        {
                            name: 'inactive',
                            label: 'non-toxic',
                        },
                    ];
                    const mappedValue = mapList.find((item) => item.name === value);
                    return mappedValue ? mappedValue.label : value;
                default:
                    return value;
            }
        };

        jsonData.forEach((item) => {
            selectedKeys.forEach(({ key, section, method }, index) => {
                if (index > 0 && index < selectedKeys.length) {
                    csvStr += columnDelimiter;
                }
                let value = extractValue(item, key, section, method);
                csvStr += `"${value}"`;
            });
            csvStr += lineDelimiter;
        });
        csvStr = encodeURIComponent(csvStr);

        const dataUri = 'data:text/csv;charset=utf-8,' + csvStr;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', filename);
        linkElement.click();
    },
    integrativeHandleCellClick = function(d) {
        //console.log(d);
        const headingHtml = `
        ${d.devtoxEndPointList.length} of ${d.endPointList.length} endpoints are associated with ${d.ontologyGroupName}
    `;
        if (d.endPointList) {
            if (d.endPointList && d.endPointList.length > 1) {
                new BootstrapModal(Header, MultipleCurveBody, {
                    title: d.title,
                    // ontologyGroupName: d.ontologyGroupName,
                    protocol_id: d.protocol_id,
                    readout_ids: _.map(d.endPointList, function(x) {
                        return x + '_' + d.protocol_id;
                    }),
                    // if button checked, we will add mortality@120 to each plot
                    casrns: [d.casrn],
                    devtoxEndPointList: d.devtoxEndPointList,
                    fill: d.fill,
                    heading: headingHtml,
                });
            } else {
                new BootstrapModal(Header, SingleCurveBody, {
                    title: d.title,
                    // ontologyGroupName: d.ontologyGroupName,
                    protocol_id: d.protocol_id,
                    readout_id: d.endpoint_name + '_' + d.protocol_id,
                    casrn: d.casrn,
                    devtoxEndPointList: d.devtoxEndPointList,
                    fill: d.fill,
                    heading: headingHtml,
                });
            }
        }
    },
    BMCHandleCellClick = function(d, clickType) {
        //console.log('SingleCurveBody', d);
        const headingHtml = `
        ${d.endpoint_name} endpoint has the lowest BMC in selected endpoints
    `;
        switch (clickType) {
            case 'nonviabilityData':
                new BootstrapModal(Header, SingleCurveBody, {
                    // title: d.preferred_name + `: ` + d.endpoint_name,
                    title: d.endpoint_name + `+` + d.protocol_name_plot + `+` + d.preferred_name,
                    protocol_id: d.protocol_id,
                    readout_id: d.endpoint_name + '_' + d.protocol_id,
                    casrn: d.casrn,
                    final_dev_call: d.final_dev_call,
                    heading: headingHtml,
                });
                break;
            case 'viabilityData':
                new BootstrapModal(Header, SingleCurveBody, {
                    // title: d.preferred_name + `: ` + 'Mortality@120',
                    title:
                        d.endpoint_name +
                        `+` +
                        d.protocol_name_plot +
                        `+` +
                        d.preferred_name +
                        `+ ` +
                        'Mortality@120',
                    protocol_id: d.protocol_id,
                    readout_id: 'Mortality@120' + '_' + d.protocol_id,
                    casrn: d.casrn,
                    CheckBoxDisable: true,
                    final_dev_call: d.final_dev_call,
                    // heading: headingHtml,
                });
                break;
            // Add more cases if needed for different click types
            default:
                break;
        }
    },
    renderNoDataAlert = function() {
        return (
            <div className="alert alert-info">
                <p>
                    This combination of <b>phenotype terms</b> and <b>test substances</b> returned
                    no data.
                </p>
            </div>
        );
    },
    renderNoSelected = function(d) {
        //console.log(d);
        return (
            <div className="alert alert-info">
                <ul>
                    {d.hasAssay !== undefined && !d.hasAssay ? (
                        <li>
                            No <b>endpoints</b> are selected. Please select at least one endpoint
                            (you must first select one dataset).
                        </li>
                    ) : null}

                    {d.hasAssay && !d.hasReadouts ? (
                        <li>
                            No <b>endpoints</b> are selected. Please select at least one endpoint.
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
    URL_CHEMXLSX,
    URL_SANKEYDATA,
    getDoseResponsesUrl,
    getBmdsUrl,
    getIntegrativeUrl,
    getSankeyPlotUrl,
    loadMetadata,
    renderSelectMultiWidget,
    renderSelectSingleWidget,
    renderSelectMultiOptgroupWidget,
    insertIntoDom,
    printFloat,
    exportCsv,
    renderNoDataAlert,
    renderNoSelected,
    data_exportToJsonFile,
    svg_download_form,
    integrativeHandleCellClick,
    BMCHandleCellClick,
    pod_med_processed,
};
