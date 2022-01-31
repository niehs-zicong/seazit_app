import _ from 'lodash';
import * as d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';

const AXIS_LINEAR = 1,
    AXIS_LOG10 = 2,
    AXIS_SQRT = 3,
    BMD_CURVEP = 1,
    BMD_HILL = 2,
    BMD_CW = {
        1: 'curvep',
        2: 'hill',
    },
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
    COLLAPSE_BY_CHEMICAL = 'COLLAPSE_BY_CHEMICAL',
    COLLAPSE_BY_READOUT = 'COLLAPSE_BY_READOUT',
    NO_COLLAPSE = 'NO_COLLAPSE',
    URL_CHEMXLSX = '/static_seazit/resources/seazit/NTP%20Chemical%20Library.xlsx',
    URL_METADATA = '/seazit/api/seazit_cr_protocol/metadata/?format=json',
    URL_CONCRESPMATRIX = '/seazit/api/seazit_cr_readout_result/drs/',
    URL_BMD = '/seazit/api/seazit_cr_readout_result/bmds/',
    INTVIZ_OBAMA = 1,
    INTVIZ_BOXPLOT = 2,
    INTVIZ_ASSAY_PCA = 3,
    INTVIZ_CHEMICAL_PCA = 4,
    INTVIZ_HEATMAP = 5,
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
            console.log('d');
            console.log(d);
            component.setState({
                metadataLoaded: true,
                protocol_data: d.protocol_data,
                Seazit_chemical_info: d.Seazit_chemical_info,
                Seazit_ui_panel: d.Seazit_ui_panel,
            });
        });
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
                        return (
                            <option key={d.key} value={d.key}>
                                {d.label}
                            </option>
                        );
                    })}
                </select>
            </div>
        );
    },
    renderSelectSingleWidget = function(name, label, options, values, handleChange) {
        return (
            <div>
                <label>Select one {label}(s):</label>
                <select
                    name={name}
                    className="form-control"
                    onChange={handleChange}
                    size={Math.min(options.length, 11)}
                    value={values}
                >
                    {options.map((d) => {
                        return (
                            <option key={d.key} value={d.key}>
                                {d.label}
                            </option>
                        );
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
                        return (
                            <optgroup key={category} label={category}>
                                {value.map((d) => (
                                    <option key={d.key} value={d.key}>
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
        return `${URL_CONCRESPMATRIX}?format=json&protocol_ids=${ids}&readouts=${ro}&casrns=${chems}`;
    },
    getBmdsUrl = function(protocol_id, readout_id) {
        if (protocol_id.length === 0 || readout_id.length === 0) {
            return null;
        }

        let id = protocol_id,
            // ro = readout_id.join(',');
            ro = readout_id;

        // return url, ro is the readout_id
        return `${URL_BMD}?format=json&protocol_ids=${id}&readouts=${ro}`;
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
    CATEGORY_COLORS,
    CHEMFILTER_CATEGORY,
    CHEMFILTER_CHEMICIAL,
    CHEMLIST_80,
    CHEMLIST_91,
    CHEMLIST_ALL,
    COLLAPSE_BY_CHEMICAL,
    COLLAPSE_BY_READOUT,
    NO_COLLAPSE,
    HEATMAP_ACTIVITY,
    HEATMAP_BMC,
    INTVIZ_OBAMA,
    INTVIZ_BOXPLOT,
    INTVIZ_ASSAY_PCA,
    INTVIZ_CHEMICAL_PCA,
    INTVIZ_HEATMAP,
    BMDVIZ_ACTIVITY,
    BMDVIZ_SELECTIVITY,
    READOUT_TYPE_READOUT,
    READOUT_TYPE_CATEGORY,
    SELECTIVITY_FOOTNOTE,
    URL_CHEMXLSX,
    getDoseResponsesUrl,
    getBmdsUrl,
    loadMetadata,
    renderSelectMultiWidget,
    renderSelectSingleWidget,
    renderSelectMultiOptgroupWidget,
    insertIntoDom,
    printFloat,
    renderNoDataAlert,
    renderNoSelected,
};
