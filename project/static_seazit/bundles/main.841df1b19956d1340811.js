webpackJsonp(
    [1],
    {
        1210: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            Object.defineProperty(t, '__esModule', { value: !0 }),
                (t.renderBmdByLab = t.renderDoseResponse = t.renderQualityControl = t.renderDatasets = void 0);
            var r = n(1211),
                o = a(r),
                l = n(1215),
                i = a(l),
                u = n(1216),
                s = a(u),
                c = n(1224),
                d = a(c),
                f = n(21),
                p = function(e) {
                    return (0, f.insertIntoDom)(o.default, e);
                },
                h = function(e) {
                    return (0, f.insertIntoDom)(i.default, e);
                },
                m = function(e) {
                    return (0, f.insertIntoDom)(d.default, e);
                },
                y = function(e) {
                    return (0, f.insertIntoDom)(s.default, e);
                };
            (t.renderDatasets = p),
                (t.renderQualityControl = h),
                (t.renderDoseResponse = y),
                (t.renderBmdByLab = m);
        },
        1211: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                u = n(9),
                s = a(u),
                c = n(251),
                d = a(c),
                f = n(146),
                p = a(f),
                h = (function(e) {
                    function t(e) {
                        r(this, t);
                        var n = o(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                        return (n.state = { showHelpText: !1 }), n;
                    }
                    return (
                        l(t, e),
                        i(t, [
                            {
                                key: '_renderHelpText',
                                value: function() {
                                    return this.state.showHelpText
                                        ? s.default.createElement(
                                              'div',
                                              { className: 'alert alert-info' },
                                              s.default.createElement(
                                                  'h2',
                                                  null,
                                                  'Help text for Datasets'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  'This page allows for the visualization of DMSO response variability for each endpoint in each dataset. This information was used by the NTP to assign a benchmark threshold (BMR) for in vitro and alternative animal model endpoints. When needed, the responses on each plate were normalized using the vehicle control responses on each plate (either median or mean response on a plate) and were shifted so that baseline response was 0. Therefore, response > 0 (<0) means response increased (decreased) after chemical exposure compared with responses in the vehicle control wells.'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  s.default.createElement('b', null, 'BMRs:')
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  { style: { paddingLeft: '1em' } },
                                                  'We used three methods for deriving BMRs: a) 3 standard deviations (SD) of normalized responses in all the vehicle control wells across plates (',
                                                  s.default.createElement(
                                                      'a',
                                                      {
                                                          href:
                                                              'https://doi.org/10.1016/j.neuro.2016.02.003',
                                                      },
                                                      'Ryan et al. 2016'
                                                  ),
                                                  '), b) intrinsic response variation across chemicals by bootstrap (',
                                                  s.default.createElement(
                                                      'a',
                                                      {
                                                          href:
                                                              'https://doi.org/10.1093/toxsci/kfy258',
                                                      },
                                                      ' Hsieh et al., 2018'
                                                  ),
                                                  '), c) intrinsic response variation across chemicals by linear-fit with vehicle control responses as random noise. In general, a) and c) approaches were used for the in vitro data and b) approach was used for the alternative animal models.'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  'Data can be visualized in 2 ways: by endpoint and by plate. Filters on the left allow for selection of datasets and endpoints. This page also allows for the visualization of concentration response curves of technical duplicate chemicals found on NTP plates: deltamethrin, methyl mercuric (II) chloride, saccharin sodium salt hydrate, and triphenyl phosphate.'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  'When the ',
                                                  s.default.createElement(
                                                      'b',
                                                      null,
                                                      '“by endpoint”'
                                                  ),
                                                  ' tab is selected for a given dataset and endpoint(s):'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  { style: { paddingLeft: '1em' } },
                                                  'A table (top) provides information about the DMSO (vehicle) control data including if the outlier test was used to remove outliers in DMSO data (column: outlier test used), the mean and SD (columns: mean & SD), the number of outliers if the outlier test is applied (column: n outliers), total number of DMSO data points (column: n), the BMR for each endpoint (column: BMR), direction of and the method used for deriving BMR (column: direction & BMR method). If the BMR is blank, it means a reliable BMR cannot be found based on the available methods. The distribution of the DMSO responses (below) is also shown for each endpoint selected. Each black dot represents the normalized response of DMSO in each well of all the plates. When not removing outlier responses in DMSO (by unchecking checkbox at the bottom of left side of screen), outliers will be labeled as a black cross and the SD will increase accordingly.',
                                                  s.default.createElement('br', null),
                                                  'Note: Outliers are defined as data points with responses either larger than 3*interquartile range (IQR) or smaller than 3*IQR. IQR is calculated using all the DMSO data points per endpoint. As a rule, if over 5% of the DMSO data points were considered outliers, an outlier test was not applied if using 3SD approach for generating the BMR.'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  'When the ',
                                                  s.default.createElement('b', null, '“by plate”'),
                                                  ' tab is selected for a given dataset and endpoint(s):'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  { style: { paddingLeft: '1em' } },
                                                  'A table (top) provides information specific to each plate-endpoint pair, including plate name (column: plate), mean, SD (columns: mean & SD), the number of outliers if the outlier test is applied (column: n outliers), total number of DMSO data points (column: n). To view a specific plate- endpoint pair, select the appropriate row in the table; the relevant end-points are highlighted in red in the distribution chart (below). Switch to the ‘descriptive statistics’ tab for general plate information of the selected plate, including the number of chemicals used on this plate (column: nchemical), number of concentrations used on this plate (column: nconc), concentration range (min, max, first quartile Q1, third quartile Q3), and availability of the vehicle control. Switch to the ‘plate map’ tab for more detailed experimental design of the selected plate. Hover over the heatmap for row, column, well information (i.e., a chemical & its concentration used). The heatmap is colored by well response that are either raw or normalized and can be toggled with radio button on the left side of the panel. When investigating a plate that is associated with mortality/development endpoints, underlying intermediate endpoints (incidences) can be reviewed when raw readout type is selected. A blank cell means there is no recorded response possibly due to technical issues or mortality.'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  'When the ',
                                                  s.default.createElement(
                                                      'b',
                                                      null,
                                                      '“curves of duplicates”'
                                                  ),
                                                  ' tab is selected:'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  { style: { paddingLeft: '1em' } },
                                                  'The chemical specific response (y-axis, normalized response) data points are plotted (red = duplicate 1; blue = duplicate 2) for each concentration tested (x-axis; log 10 (molar concentration)). The numerical value next to each dot represents the number of replicates (e.g., number of animals per concentration). For some datasets (UCSanDiego, UKonstanz, USEPA), only duplicate 1 is plotted since duplicate 2 was not included in the original shipping plate.'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  s.default.createElement(
                                                      'i',
                                                      null,
                                                      'Options for editing or saving images are provided by toggling over the upper right side of each image. If the edit/save toolbar is not available, it was a custom visualization created specifically for this application. Please take a screenshot to save, or if you need a higher resolution image, please contact us.'
                                                  )
                                              )
                                          )
                                        : null;
                                },
                            },
                            {
                                key: 'render',
                                value: function() {
                                    return s.default.createElement(
                                        'div',
                                        { className: 'row-fluid' },
                                        s.default.createElement(
                                            'div',
                                            { className: 'col-md-12' },
                                            s.default.createElement(
                                                'h1',
                                                null,
                                                'Datasets',
                                                s.default.createElement(p.default, {
                                                    stateHolder: this,
                                                })
                                            ),
                                            this._renderHelpText()
                                        ),
                                        s.default.createElement(
                                            'div',
                                            { className: 'col-md-12' },
                                            s.default.createElement(d.default, null)
                                        )
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(s.default.Component);
            t.default = h;
        },
        1215: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                u = n(9),
                s = a(u),
                c = n(251),
                d = a(c),
                f = n(146),
                p = a(f),
                h = (function(e) {
                    function t(e) {
                        r(this, t);
                        var n = o(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                        return (n.state = { showHelpText: !1 }), n;
                    }
                    return (
                        l(t, e),
                        i(t, [
                            {
                                key: '_renderHelpText',
                                value: function() {
                                    return this.state.showHelpText
                                        ? s.default.createElement(
                                              'div',
                                              { className: 'alert alert-info' },
                                              s.default.createElement('h2', null, 'Help text'),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  'This page allows for the visualization of DMSO response variability for each endpoint in each dataset. This information was used by the NTP to assign a benchmark threshold (BMR) for in vitro and alternative animal model endpoints. When needed, the responses on each plate were normalized using the vehicle control responses on each plate (either median or mean response on a plate) and were shifted so that baseline response was 0. Therefore, response > 0 (<0) means response increased (decreased) after chemical exposure compared with responses in the vehicle control wells.'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  s.default.createElement('b', null, 'BMRs:')
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  { style: { paddingLeft: '1em' } },
                                                  'We used three methods for deriving BMRs: a) 3 standard deviations (SD) of normalized responses in all the vehicle control wells across plates (',
                                                  s.default.createElement(
                                                      'a',
                                                      {
                                                          href:
                                                              'https://doi.org/10.1016/j.neuro.2016.02.003',
                                                      },
                                                      'Ryan et al. 2016'
                                                  ),
                                                  '), b) intrinsic response variation across chemicals by bootstrap (',
                                                  s.default.createElement(
                                                      'a',
                                                      {
                                                          href:
                                                              'https://doi.org/10.1093/toxsci/kfy258',
                                                      },
                                                      ' Hsieh et al., 2018'
                                                  ),
                                                  '), c) intrinsic response variation across chemicals by linear-fit with vehicle control responses as random noise. In general, a) and c) approaches were used for the in vitro data and b) approach was used for the alternative animal models.'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  'Data can be visualized in 2 ways: by endpoint and by plate. Filters on the left allow for selection of datasets and endpoints. This page also allows for the visualization of concentration response curves of technical duplicate chemicals found on NTP plates: deltamethrin, methyl mercuric (II) chloride, saccharin sodium salt hydrate, and triphenyl phosphate.'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  'When the ',
                                                  s.default.createElement(
                                                      'b',
                                                      null,
                                                      '“by endpoint”'
                                                  ),
                                                  ' tab is selected for a given dataset and endpoint(s):'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  { style: { paddingLeft: '1em' } },
                                                  'A table (top) provides information about the DMSO (vehicle) control data including if the outlier test was used to remove outliers in DMSO data (column: outlier test used), the mean and SD (columns: mean & SD), the number of outliers if the outlier test is applied (column: n outliers), total number of DMSO data points (column: n), the BMR for each endpoint (column: BMR), direction of and the method used for deriving BMR (column: direction & BMR method). If the BMR is blank, it means a reliable BMR cannot be found based on the available methods. The distribution of the DMSO responses (below) is also shown for each endpoint selected. Each black dot represents the normalized response of DMSO in each well of all the plates. When not removing outlier responses in DMSO (by unchecking checkbox at the bottom of left side of screen), outliers will be labeled as a black cross and the SD will increase accordingly.',
                                                  s.default.createElement('br', null),
                                                  'Note: Outliers are defined as data points with responses either larger than 3*interquartile range (IQR) or smaller than 3*IQR. IQR is calculated using all the DMSO data points per endpoint. As a rule, if over 5% of the DMSO data points were considered outliers, an outlier test was not applied if using 3SD approach for generating the BMR.'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  'When the ',
                                                  s.default.createElement('b', null, '“by plate”'),
                                                  ' tab is selected for a given dataset and endpoint(s):'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  { style: { paddingLeft: '1em' } },
                                                  'A table (top) provides information specific to each plate-endpoint pair, including plate name (column: plate), mean, SD (columns: mean & SD), the number of outliers if the outlier test is applied (column: n outliers), total number of DMSO data points (column: n). To view a specific plate- endpoint pair, select the appropriate row in the table; the relevant end-points are highlighted in red in the distribution chart (below). Switch to the ‘descriptive statistics’ tab for general plate information of the selected plate, including the number of chemicals used on this plate (column: nchemical), number of concentrations used on this plate (column: nconc), concentration range (min, max, first quartile Q1, third quartile Q3), and availability of the vehicle control. Switch to the ‘plate map’ tab for more detailed experimental design of the selected plate. Hover over the heatmap for row, column, well information (i.e., a chemical & its concentration used). The heatmap is colored by well response that are either raw or normalized and can be toggled with radio button on the left side of the panel. When investigating a plate that is associated with mortality/development endpoints, underlying intermediate endpoints (incidences) can be reviewed when raw readout type is selected. A blank cell means there is no recorded response possibly due to technical issues or mortality.'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  'When the ',
                                                  s.default.createElement(
                                                      'b',
                                                      null,
                                                      '“curves of duplicates”'
                                                  ),
                                                  ' tab is selected:'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  { style: { paddingLeft: '1em' } },
                                                  'The chemical specific response (y-axis, normalized response) data points are plotted (red = duplicate 1; blue = duplicate 2) for each concentration tested (x-axis; log 10 (molar concentration)). The numerical value next to each dot represents the number of replicates (e.g., number of animals per concentration). For some datasets (UCSanDiego, UKonstanz, USEPA), only duplicate 1 is plotted since duplicate 2 was not included in the original shipping plate.'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  s.default.createElement(
                                                      'i',
                                                      null,
                                                      'Options for editing or saving images are provided by toggling over the upper right side of each image. If the edit/save toolbar is not available, it was a custom visualization created specifically for this application. Please take a screenshot to save, or if you need a higher resolution image, please contact us.'
                                                  )
                                              )
                                          )
                                        : null;
                                },
                            },
                            {
                                key: 'render',
                                value: function() {
                                    return s.default.createElement(
                                        'div',
                                        { className: 'row-fluid' },
                                        s.default.createElement(
                                            'div',
                                            { className: 'col-md-12' },
                                            s.default.createElement(
                                                'h1',
                                                null,
                                                'Quality control',
                                                s.default.createElement(p.default, {
                                                    stateHolder: this,
                                                })
                                            ),
                                            this._renderHelpText()
                                        ),
                                        s.default.createElement(
                                            'div',
                                            { className: 'col-md-12' },
                                            s.default.createElement(d.default, null)
                                        )
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(s.default.Component);
            t.default = h;
        },
        1216: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                u = n(9),
                s = a(u),
                c = n(252),
                d = a(c),
                f = n(253),
                p = a(f),
                h = n(146),
                m = a(h),
                y = n(1222),
                _ = a(y),
                b = n(438),
                v = a(b),
                g = n(439),
                E = a(g),
                w = n(1223),
                O = a(w),
                C = n(21),
                M = (function(e) {
                    function t(e) {
                        r(this, t);
                        var n = o(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e)),
                            a = Math.max(1, Math.floor((0.75 * window.innerWidth) / 400));
                        return (
                            (n.state = {
                                metadataLoaded: !1,
                                metadata: null,
                                showHelpText: !1,
                                chemList: C.CHEMLIST_80,
                                chemicalFilterBy: C.CHEMFILTER_CHEMICIAL,
                                chemicals: [],
                                categories: [],
                                assays: [],
                                readouts: [],
                                plotCollapse: C.NO_COLLAPSE,
                                vizColumns: a,
                                vizHeight: 350,
                            }),
                            n
                        );
                    }
                    return (
                        l(t, e),
                        i(t, [
                            {
                                key: 'componentWillMount',
                                value: function() {
                                    (0, C.loadMetadata)(this);
                                },
                            },
                            {
                                key: 'renderNoSelection',
                                value: function() {
                                    return (0, C.renderNoSelected)({
                                        hasReadouts: this.state.readouts.length > 0,
                                        hasChems: this.state.chemicals.length > 0,
                                    });
                                },
                            },
                            {
                                key: 'renderSelection',
                                value: function(e) {
                                    return s.default.createElement(p.default, {
                                        cols: this.state.vizColumns,
                                        collapse: this.state.plotCollapse,
                                        height: this.state.vizHeight,
                                        url: e,
                                    });
                                },
                            },
                            {
                                key: '_renderHelpText',
                                value: function() {
                                    return this.state.showHelpText
                                        ? s.default.createElement(
                                              'div',
                                              { className: 'alert alert-info' },
                                              s.default.createElement('h2', null, 'Help text'),
                                              s.default.createElement('p', null, 'helptext zw'),
                                              s.default.createElement('p', null, 'helptext zw'),
                                              s.default.createElement('p', null, 'helptext zw'),
                                              s.default.createElement('p', null, 'helptext zw'),
                                              s.default.createElement('p', null, 'helptext zw'),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  s.default.createElement('i', null, 'helptext zw')
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  s.default.createElement('i', null, 'helptext zw')
                                              )
                                          )
                                        : null;
                                },
                            },
                            {
                                key: 'render',
                                value: function() {
                                    if (!this.state.metadataLoaded)
                                        return s.default.createElement(d.default, null);
                                    console.log('this.state'), console.log(this.state);
                                    var e = (0, C.getDoseResponsesUrl)(
                                        this.state.assays,
                                        this.state.readouts,
                                        this.state.chemicals
                                    );
                                    return s.default.createElement(
                                        'div',
                                        { className: 'row-fluid' },
                                        s.default.createElement(
                                            'h1',
                                            null,
                                            'Concentration Response',
                                            s.default.createElement(m.default, {
                                                stateHolder: this,
                                            })
                                        ),
                                        s.default.createElement(
                                            'div',
                                            { className: 'col-md-3' },
                                            s.default.createElement(v.default, {
                                                stateHolder: this,
                                                hideViability: !1,
                                                hideNonViability: !1,
                                                multiAssaySelector: !0,
                                                multiReadoutSelector: !0,
                                                tabName: 'DoseResponse',
                                            }),
                                            s.default.createElement('hr', null),
                                            s.default.createElement(_.default, {
                                                stateHolder: this,
                                            }),
                                            s.default.createElement('hr', null),
                                            s.default.createElement(O.default, {
                                                stateHolder: this,
                                            }),
                                            s.default.createElement('hr', null),
                                            s.default.createElement(E.default, {
                                                stateHolder: this,
                                            })
                                        ),
                                        s.default.createElement(
                                            'div',
                                            { className: 'col-md-9' },
                                            this._renderHelpText(),
                                            e ? this.renderSelection(e) : this.renderNoSelection()
                                        )
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(s.default.Component);
            t.default = M;
        },
        1218: function(e, t) {
            e.exports = Plotly;
        },
        1222: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                u = n(67),
                s = a(u),
                c = n(55),
                d = a(c),
                f = n(9),
                p = a(f),
                h = n(72),
                m = a(h),
                y = n(21),
                _ = (function(e) {
                    function t(e) {
                        r(this, t);
                        var n = o(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                        return (
                            (n.handleChemlistChange = n.handleChemlistChange.bind(n)),
                            (n.handleCategoryChange = n.handleCategoryChange.bind(n)),
                            n
                        );
                    }
                    return (
                        l(t, e),
                        i(t, [
                            { key: 'handleChemlistChange', value: function(e) {} },
                            {
                                key: 'handleCategoryChange',
                                value: function(e) {
                                    var t = {},
                                        n = (0, s.default)(e.target).val(),
                                        a = this.props.stateHolder.state;
                                    (t[e.target.name] = n),
                                        (t.chemicals = d.default
                                            .chain(a.Seazit_chemical_info)
                                            .filter(function(e) {
                                                return d.default.includes(n, e.use_category1);
                                            })
                                            .map('casrn')
                                            .uniq()
                                            .value()),
                                        this.props.stateHolder.setState(t);
                                },
                            },
                            {
                                key: '_renderFilterBy',
                                value: function(e) {
                                    return p.default.createElement(
                                        'div',
                                        null,
                                        p.default.createElement(
                                            'label',
                                            null,
                                            'Filter chemicals by: '
                                        ),
                                        p.default.createElement(
                                            'div',
                                            { className: 'radio' },
                                            p.default.createElement(
                                                'label',
                                                null,
                                                p.default.createElement('input', {
                                                    type: 'radio',
                                                    name: 'chemicalFilterBy',
                                                    onChange: this.handleRadioChange,
                                                    value: y.CHEMFILTER_CATEGORY,
                                                    checked:
                                                        e.chemicalFilterBy ===
                                                        y.CHEMFILTER_CATEGORY,
                                                }),
                                                'Category'
                                            ),
                                            p.default.createElement(
                                                'span',
                                                {
                                                    style: {
                                                        paddingLeft: '0.5em',
                                                        paddingRight: '0.5em',
                                                    },
                                                },
                                                '|'
                                            ),
                                            p.default.createElement(
                                                'label',
                                                null,
                                                p.default.createElement('input', {
                                                    type: 'radio',
                                                    name: 'chemicalFilterBy',
                                                    onChange: this.handleRadioChange,
                                                    value: y.CHEMFILTER_CHEMICIAL,
                                                    checked:
                                                        e.chemicalFilterBy ===
                                                        y.CHEMFILTER_CHEMICIAL,
                                                }),
                                                'Name'
                                            )
                                        )
                                    );
                                },
                            },
                            {
                                key: '_renderSelector',
                                value: function(e) {
                                    var t = void 0;
                                    return e.chemicalFilterBy === y.CHEMFILTER_CHEMICIAL
                                        ? ((t = d.default
                                              .chain(e.Seazit_chemical_info)
                                              .groupBy('preferred_name')
                                              .values()
                                              .map(function(e) {
                                                  return e[0];
                                              })
                                              .sortBy('preferred_name')
                                              .map(function(e) {
                                                  return {
                                                      category: 'Chemical Names',
                                                      key: e.casrn,
                                                      label:
                                                          e.preferred_name + ' (' + e.casrn + ')',
                                                  };
                                              })
                                              .groupBy('category')
                                              .value()),
                                          (0, y.renderSelectMultiOptgroupWidget)(
                                              'chemicals',
                                              'chemical',
                                              t,
                                              e.chemicals,
                                              this.handleSelectMultiChange
                                          ))
                                        : ((t = d.default
                                              .chain(e.Seazit_chemical_info)
                                              .groupBy('use_category1')
                                              .values()
                                              .map(function(e) {
                                                  return e[0];
                                              })
                                              .sortBy('use_category1')
                                              .map(function(e) {
                                                  return {
                                                      key: e.use_category1,
                                                      label: e.use_category1,
                                                  };
                                              })
                                              .value()),
                                          (0, y.renderSelectMultiWidget)(
                                              'categories',
                                              'category zw3',
                                              t,
                                              e.categories,
                                              this.handleCategoryChange
                                          ));
                                },
                            },
                            {
                                key: 'render',
                                value: function() {
                                    var e = this.props.stateHolder.state;
                                    return p.default.createElement(
                                        'div',
                                        { className: 'clearfix' },
                                        this._renderFilterBy(e),
                                        this._renderSelector(e)
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(m.default);
            t.default = _;
        },
        1223: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                u = n(67),
                s = a(u),
                c = n(9),
                d = a(c),
                f = n(54),
                p = a(f),
                h = n(72),
                m = a(h),
                y = n(21),
                _ = (function(e) {
                    function t(e) {
                        r(this, t);
                        var n = o(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                        return (n.handleCollapseChange = n.handleCollapseChange.bind(n)), n;
                    }
                    return (
                        l(t, e),
                        i(t, [
                            {
                                key: 'componentDidMount',
                                value: function() {
                                    (0, s.default)(this.refs.buttons)
                                        .find('[data-toggle="tooltip"]')
                                        .tooltip();
                                },
                            },
                            {
                                key: 'handleCollapseChange',
                                value: function(e) {
                                    var t = {};
                                    e.target.value !== y.NO_COLLAPSE &&
                                        this.props.stateHolder.state.vizColumns > 2 &&
                                        (t.vizColumns = 2),
                                        (t[e.target.name] = e.target.value),
                                        this.props.stateHolder.setState(t);
                                },
                            },
                            {
                                key: 'render',
                                value: function() {
                                    var e = this.props.stateHolder.state;
                                    return d.default.createElement(
                                        'div',
                                        { ref: 'buttons' },
                                        d.default.createElement(
                                            'label',
                                            null,
                                            'One chart for each: '
                                        ),
                                        d.default.createElement(
                                            'div',
                                            { className: 'radio' },
                                            d.default.createElement(
                                                'label',
                                                {
                                                    'data-toggle': 'tooltip',
                                                    'data-title':
                                                        'One chart for each chemical + readout combination',
                                                },
                                                d.default.createElement('input', {
                                                    type: 'radio',
                                                    name: 'plotCollapse',
                                                    id: y.NO_COLLAPSE,
                                                    onChange: this.handleCollapseChange,
                                                    value: y.NO_COLLAPSE,
                                                    checked: e.plotCollapse === y.NO_COLLAPSE,
                                                }),
                                                'Chemical + Endpoint'
                                            ),
                                            d.default.createElement(
                                                'span',
                                                {
                                                    style: {
                                                        paddingLeft: '0.5em',
                                                        paddingRight: '0.5em',
                                                    },
                                                },
                                                '|'
                                            ),
                                            d.default.createElement(
                                                'label',
                                                {
                                                    htmlFor: y.COLLAPSE_BY_CHEMICAL,
                                                    'data-toggle': 'tooltip',
                                                    'data-title':
                                                        'One chart for each chemical (multiple readouts on chart)',
                                                },
                                                d.default.createElement('input', {
                                                    type: 'radio',
                                                    name: 'plotCollapse',
                                                    id: y.COLLAPSE_BY_CHEMICAL,
                                                    onChange: this.handleCollapseChange,
                                                    value: y.COLLAPSE_BY_CHEMICAL,
                                                    checked:
                                                        e.plotCollapse === y.COLLAPSE_BY_CHEMICAL,
                                                }),
                                                'Chemical'
                                            ),
                                            d.default.createElement(
                                                'span',
                                                {
                                                    style: {
                                                        paddingLeft: '0.5em',
                                                        paddingRight: '0.5em',
                                                    },
                                                },
                                                '|'
                                            ),
                                            d.default.createElement(
                                                'label',
                                                {
                                                    htmlFor: y.COLLAPSE_BY_READOUT,
                                                    'data-toggle': 'tooltip',
                                                    'data-title':
                                                        'One chart for each readout (multiple chemicals on chart)',
                                                },
                                                d.default.createElement('input', {
                                                    type: 'radio',
                                                    name: 'plotCollapse',
                                                    id: y.COLLAPSE_BY_READOUT,
                                                    onChange: this.handleCollapseChange,
                                                    value: y.COLLAPSE_BY_READOUT,
                                                    checked:
                                                        e.plotCollapse === y.COLLAPSE_BY_READOUT,
                                                }),
                                                'Endpoint'
                                            )
                                        ),
                                        d.default.createElement(
                                            'p',
                                            { className: 'help-block' },
                                            'Hover for more details on each option.'
                                        )
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(m.default);
            (_.propTypes = {
                stateHolder: p.default.shape({
                    state: p.default.shape({ plotCollapse: p.default.string.isRequired })
                        .isRequired,
                }).isRequired,
            }),
                (t.default = _);
        },
        1224: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                u = n(9),
                s = a(u),
                c = n(252),
                d = a(c),
                f = n(251),
                p = a(f),
                h = n(146),
                m = a(h),
                y = n(1225),
                _ = a(y),
                b = n(438),
                v = a(b),
                g = n(1226),
                E = a(g),
                w = n(440),
                O = a(w),
                C = n(21),
                M = (function(e) {
                    function t(e) {
                        r(this, t);
                        var n = o(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                        return (
                            (n.state = {
                                metadataLoaded: !1,
                                metadata: null,
                                showHelpText: !1,
                                chemList: C.CHEMLIST_80,
                                chemicalFilterBy: C.CHEMFILTER_CATEGORY,
                                chemicals: [],
                                categories: [],
                                selectivityCutoff: 0.5,
                                selectedAxis: C.AXIS_LOG10,
                                assay: [],
                                readouts: [],
                                visualization: C.BMDVIZ_ACTIVITY,
                            }),
                            n
                        );
                    }
                    return (
                        l(t, e),
                        i(t, [
                            {
                                key: 'componentWillMount',
                                value: function() {
                                    (0, C.loadMetadata)(this);
                                },
                            },
                            {
                                key: 'renderNoSelection',
                                value: function() {
                                    return (0, C.renderNoSelected)({
                                        hasAssay: this.state.assay.length > 0,
                                        hasReadouts: this.state.readouts.length > 0,
                                    });
                                },
                            },
                            {
                                key: 'renderSelection',
                                value: function(e) {
                                    return s.default.createElement(O.default, {
                                        visualization: this.state.visualization,
                                        selectivityCutoff: this.state.selectivityCutoff,
                                        selectedAxis: this.state.selectedAxis,
                                        url: e,
                                    });
                                },
                            },
                            {
                                key: '_renderHelpText',
                                value: function() {
                                    return this.state.showHelpText
                                        ? s.default.createElement(
                                              'div',
                                              { className: 'alert alert-info' },
                                              s.default.createElement('h2', null, 'Help text'),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  'This page allows for each investigator to see how the chemicals rank by activity in two ways:',
                                                  s.default.createElement(
                                                      'ul',
                                                      null,
                                                      s.default.createElement(
                                                          'li',
                                                          null,
                                                          s.default.createElement(
                                                              'b',
                                                              null,
                                                              'Activity:'
                                                          ),
                                                          ' any chemical where a BMC can be calculated for any effect, or'
                                                      ),
                                                      s.default.createElement(
                                                          'li',
                                                          null,
                                                          s.default.createElement(
                                                              'b',
                                                              null,
                                                              'Selectivity:'
                                                          ),
                                                          ' a neuro or developmental specific effect occurring in the absence of general toxicity (i.e., mortality or loss of cell viability).'
                                                      )
                                                  )
                                              ),
                                              s.default.createElement('p', null, 'zw'),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  'When ',
                                                  s.default.createElement('b', null, 'Activity'),
                                                  ' is selected:'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  { style: { paddingLeft: '1em' } },
                                                  'zw'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  'When ',
                                                  s.default.createElement('b', null, 'Selectivity'),
                                                  ' is selected:'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  { style: { paddingLeft: '1em' } },
                                                  'zw'
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  s.default.createElement(
                                                      'i',
                                                      null,
                                                      'Disclaimer: The use of two different methods of analysis will be reflected as different benchmark concentrations'
                                                  )
                                              ),
                                              s.default.createElement(
                                                  'p',
                                                  null,
                                                  s.default.createElement('i', null, 'zw')
                                              )
                                          )
                                        : null;
                                },
                            },
                            {
                                key: 'render',
                                value: function() {
                                    if (!this.state.metadataLoaded)
                                        return s.default.createElement(d.default, null);
                                    var e = (0, C.getBmdsUrl)(
                                        this.state.assay,
                                        this.state.readouts
                                    );
                                    return s.default.createElement(
                                        'div',
                                        { className: 'row-fluid' },
                                        s.default.createElement(
                                            'div',
                                            { className: 'col-md-12' },
                                            s.default.createElement(
                                                'h1',
                                                null,
                                                'Benchmark concentration (BMC) summary by lab',
                                                s.default.createElement(m.default, {
                                                    stateHolder: this,
                                                })
                                            )
                                        ),
                                        s.default.createElement(
                                            'div',
                                            { className: 'col-md-12' },
                                            s.default.createElement(p.default, null)
                                        ),
                                        s.default.createElement(
                                            'div',
                                            { className: 'col-md-3' },
                                            s.default.createElement('hr', null),
                                            s.default.createElement(v.default, {
                                                stateHolder: this,
                                                hideViability: !0,
                                                hideNonViability: !1,
                                                multiAssaySelector: !1,
                                                multiReadoutSelector: !1,
                                                tabName: 'BmdByLab',
                                            }),
                                            s.default.createElement('hr', null),
                                            s.default.createElement(_.default, {
                                                stateHolder: this,
                                            }),
                                            this.state.visualization === C.BMDVIZ_SELECTIVITY
                                                ? s.default.createElement(E.default, {
                                                      stateHolder: this,
                                                  })
                                                : null
                                        ),
                                        s.default.createElement(
                                            'div',
                                            { className: 'col-md-9' },
                                            this._renderHelpText(),
                                            e ? this.renderSelection(e) : this.renderNoSelection()
                                        )
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(s.default.Component);
            t.default = M;
        },
        1225: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                u = n(9),
                s = a(u),
                c = n(72),
                d = a(c),
                f = n(21),
                p = (function(e) {
                    function t() {
                        return (
                            r(this, t),
                            o(
                                this,
                                (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments)
                            )
                        );
                    }
                    return (
                        l(t, e),
                        i(t, [
                            {
                                key: 'render',
                                value: function() {
                                    var e = this.props.stateHolder.state;
                                    return s.default.createElement(
                                        'div',
                                        null,
                                        s.default.createElement('label', null, 'Select visual: '),
                                        s.default.createElement(
                                            'div',
                                            { className: 'radio' },
                                            s.default.createElement(
                                                'label',
                                                null,
                                                s.default.createElement('input', {
                                                    type: 'radio',
                                                    name: 'visualization',
                                                    onChange: this.handleRadioChange,
                                                    value: f.BMDVIZ_ACTIVITY,
                                                    checked: e.visualization === f.BMDVIZ_ACTIVITY,
                                                }),
                                                'Activity'
                                            ),
                                            s.default.createElement(
                                                'span',
                                                {
                                                    style: {
                                                        paddingLeft: '0.5em',
                                                        paddingRight: '0.5em',
                                                    },
                                                },
                                                '|'
                                            ),
                                            s.default.createElement(
                                                'label',
                                                null,
                                                s.default.createElement('input', {
                                                    type: 'radio',
                                                    name: 'visualization',
                                                    onChange: this.handleRadioChange,
                                                    value: f.BMDVIZ_SELECTIVITY,
                                                    disabled: !0,
                                                    checked:
                                                        e.visualization === f.BMDVIZ_SELECTIVITY,
                                                }),
                                                'Selectivity'
                                            )
                                        )
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(d.default);
            t.default = p;
        },
        1226: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                u = n(9),
                s = a(u),
                c = n(72),
                d = a(c),
                f = (function(e) {
                    function t() {
                        return (
                            r(this, t),
                            o(
                                this,
                                (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments)
                            )
                        );
                    }
                    return (
                        l(t, e),
                        i(t, [
                            {
                                key: 'render',
                                value: function() {
                                    var e = this.props.stateHolder.state;
                                    return s.default.createElement(
                                        'div',
                                        null,
                                        s.default.createElement(
                                            'label',
                                            null,
                                            'Selectivity cutoff:'
                                        ),
                                        s.default.createElement('input', {
                                            className: 'form-control',
                                            type: 'range',
                                            name: 'selectivityCutoff',
                                            min: '0',
                                            max: '2',
                                            step: '0.1',
                                            onChange: this.handleFloatInputChange,
                                            value: e.selectivityCutoff,
                                        }),
                                        s.default.createElement(
                                            'span',
                                            null,
                                            '>',
                                            e.selectivityCutoff,
                                            ' is selective'
                                        )
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(d.default);
            t.default = f;
        },
        1227: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                u = n(9),
                s = a(u),
                c = n(54),
                d = a(c),
                f = n(55),
                p = a(f),
                h = n(254),
                m = a(h),
                y = n(255),
                _ = n(21),
                b = function(e, t) {
                    if (!e)
                        return s.default.createElement('span', { style: { paddingLeft: 12 } }, '-');
                    var n = function() {
                            new m.default(y.Header, y.SingleCurveBody, {
                                title: e.preferred_name + ': ' + e.endpoint_name,
                                protocol_id: e.protocol_id,
                                readout_id:
                                    'pod_med' == t
                                        ? e.endpoint_name + '_' + e.protocol_id
                                        : 'Mortality@120_' + e.protocol_id,
                                casrn: e.casrn,
                            });
                        },
                        a = void 0,
                        r = void 0,
                        o = void 0;
                    return (
                        'pod_med' == t
                            ? ((a = e.med_pod_med
                                  ? (0, _.printFloat)(1e6 * Math.pow(10, e.med_pod_med))
                                  : '-'),
                              (r = e.min_pod_med
                                  ? (0, _.printFloat)(1e6 * Math.pow(10, e.min_pod_med))
                                  : ''),
                              (o = e.max_pod_med
                                  ? (0, _.printFloat)(1e6 * Math.pow(10, e.max_pod_med))
                                  : ''))
                            : ((a = e.mort_med_pod_med
                                  ? (0, _.printFloat)(1e6 * Math.pow(10, e.mort_med_pod_med))
                                  : '-'),
                              (r = e.mort_min_pod_med
                                  ? (0, _.printFloat)(1e6 * Math.pow(10, e.mort_min_pod_med))
                                  : ''),
                              (o = e.mort_max_pod_med
                                  ? (0, _.printFloat)(1e6 * Math.pow(10, e.mort_max_pod_med))
                                  : '')),
                        s.default.createElement(
                            'button',
                            { className: 'btn btn-link', onClick: n, style: { textAlign: 'left' } },
                            a,
                            s.default.createElement('br', null),
                            '(',
                            r,
                            ' – ',
                            o,
                            ')'
                        )
                    );
                },
                v = (function(e) {
                    function t() {
                        return (
                            r(this, t),
                            o(
                                this,
                                (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments)
                            )
                        );
                    }
                    return (
                        l(t, e),
                        i(t, [
                            {
                                key: '_renderRow',
                                value: function(e) {
                                    return s.default.createElement(
                                        'tr',
                                        { key: e.casrn },
                                        s.default.createElement('td', null, e.preferred_name),
                                        s.default.createElement('td', null, e.casrn),
                                        s.default.createElement('td', null, e.use_category1),
                                        s.default.createElement('td', null, b(e, 'pod_med')),
                                        s.default.createElement('td', null, b(e, 'mort_pod_med'))
                                    );
                                },
                            },
                            {
                                key: 'render',
                                value: function() {
                                    if (0 === this.props.data.length) return null;
                                    var e = void 0;
                                    return (
                                        (e = p.default.sortBy(
                                            this.props.data.bmd_activity_selectivity,
                                            'med_pod_med'
                                        )),
                                        s.default.createElement(
                                            'div',
                                            null,
                                            s.default.createElement(
                                                'table',
                                                {
                                                    id: 'IA_table01',
                                                    ref: 'table',
                                                    className: 'table table-condensed table-hover',
                                                },
                                                s.default.createElement(
                                                    'thead',
                                                    null,
                                                    s.default.createElement(
                                                        'tr',
                                                        null,
                                                        s.default.createElement(
                                                            'th',
                                                            { style: { width: '20%' } },
                                                            'Chemical'
                                                        ),
                                                        s.default.createElement(
                                                            'th',
                                                            { style: { width: '20%' } },
                                                            'CASRN'
                                                        ),
                                                        s.default.createElement(
                                                            'th',
                                                            { style: { width: '20%' } },
                                                            'Category'
                                                        ),
                                                        s.default.createElement(
                                                            'th',
                                                            { style: { width: '20%' } },
                                                            'Non-Mortality BMC (Median)',
                                                            s.default.createElement('br', null),
                                                            '(Min – Max)'
                                                        ),
                                                        s.default.createElement(
                                                            'th',
                                                            { style: { width: '20%' } },
                                                            'Mortality BMC (Median)',
                                                            s.default.createElement('br', null),
                                                            '(Min – Max)'
                                                        )
                                                    )
                                                ),
                                                s.default.createElement(
                                                    'tbody',
                                                    null,
                                                    e.map(this._renderRow)
                                                )
                                            )
                                        )
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(s.default.Component);
            (v.propTypes = { data: d.default.array.isRequired }), (t.default = v);
        },
        1228: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                u = n(9),
                s = a(u),
                c = n(54),
                d = a(c),
                f = n(55),
                p = a(f),
                h = n(254),
                m = a(h),
                y = n(255),
                _ = n(21),
                b = function(e) {
                    return e.maximumSelectivity && !e.minimimumNonViability.has_viability_bmd
                        ? s.default.createElement(
                              'span',
                              null,
                              '≥',
                              (0, _.printFloat)(e.maximumSelectivity),
                              s.default.createElement('sup', null, '†')
                          )
                        : e.maximumSelectivity
                        ? (0, _.printFloat)(e.maximumSelectivity)
                        : '-';
                },
                v = function(e) {
                    if (!e)
                        return s.default.createElement('span', { style: { paddingLeft: 12 } }, '-');
                    var t = function() {
                        new m.default(y.Header, y.SingleCurveBody, {
                            title:
                                e.chemical_name +
                                ' (' +
                                e.chemical_casrn +
                                '): ' +
                                e.readout_endpoint,
                            readout_id: e.readout_id,
                            casrn: e.chemical_casrn,
                        });
                    };
                    return s.default.createElement(
                        'button',
                        { className: 'btn btn-link', onClick: t },
                        (0, _.printFloat)(e.bmd)
                    );
                },
                g = (function(e) {
                    function t() {
                        return (
                            r(this, t),
                            o(
                                this,
                                (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments)
                            )
                        );
                    }
                    return (
                        l(t, e),
                        i(t, [
                            {
                                key: '_renderRow',
                                value: function(e) {
                                    return s.default.createElement(
                                        'tr',
                                        { key: e.chemical_casrn },
                                        s.default.createElement('td', null, e.chemical_name),
                                        s.default.createElement('td', null, e.chemical_casrn),
                                        s.default.createElement('td', null, e.chemical_category),
                                        s.default.createElement(
                                            'td',
                                            null,
                                            v(e.minimimumNonViability)
                                        ),
                                        s.default.createElement(
                                            'td',
                                            null,
                                            v(e.minimimumViability)
                                        ),
                                        s.default.createElement('td', null, b(e))
                                    );
                                },
                            },
                            {
                                key: 'render',
                                value: function() {
                                    if (0 === this.props.data.length) return null;
                                    var e = p.default
                                            .chain(this.props.data)
                                            .filter(function(e) {
                                                return e.maximumSelectivity > 0;
                                            })
                                            .sortBy(function(e) {
                                                return -e.maximumSelectivity;
                                            })
                                            .value(),
                                        t = this.props.data.filter(function(e) {
                                            return null === e.maximumSelectivity;
                                        });
                                    return s.default.createElement(
                                        'div',
                                        null,
                                        s.default.createElement(
                                            'table',
                                            {
                                                ref: 'table',
                                                className: 'table table-condensed table-hover',
                                            },
                                            s.default.createElement(
                                                'thead',
                                                null,
                                                s.default.createElement(
                                                    'tr',
                                                    null,
                                                    s.default.createElement(
                                                        'th',
                                                        { style: { width: '20%' } },
                                                        'Chemical'
                                                    ),
                                                    s.default.createElement(
                                                        'th',
                                                        { style: { width: '15%' } },
                                                        'CASRN'
                                                    ),
                                                    s.default.createElement(
                                                        'th',
                                                        { style: { width: '17%' } },
                                                        'Category'
                                                    ),
                                                    s.default.createElement(
                                                        'th',
                                                        { style: { width: '16%' } },
                                                        'Minimum nonviability BMC'
                                                    ),
                                                    s.default.createElement(
                                                        'th',
                                                        { style: { width: '16%' } },
                                                        'Minimum viability BMC'
                                                    ),
                                                    s.default.createElement(
                                                        'th',
                                                        { style: { width: '16%' } },
                                                        'Selectivity ratio'
                                                    )
                                                )
                                            ),
                                            s.default.createElement(
                                                'tbody',
                                                null,
                                                e.map(this._renderRow),
                                                t.map(this._renderRow)
                                            ),
                                            s.default.createElement(
                                                'tfoot',
                                                null,
                                                s.default.createElement(
                                                    'tr',
                                                    null,
                                                    s.default.createElement(
                                                        'td',
                                                        { colSpan: '6' },
                                                        '* Chemical is a known developmental neurotoxicant from literature',
                                                        s.default.createElement('br', null),
                                                        s.default.createElement('sup', null, '†'),
                                                        ' ',
                                                        _.SELECTIVITY_FOOTNOTE
                                                    )
                                                )
                                            )
                                        )
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(s.default.Component);
            (g.propTypes = { data: d.default.array.isRequired }), (t.default = g);
        },
        1229: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                u = n(9),
                s = a(u),
                c = n(55),
                d = a(c),
                f = n(67),
                p = a(f),
                h = n(77),
                m = (function(e) {
                    if (e && e.__esModule) return e;
                    var t = {};
                    if (null != e)
                        for (var n in e)
                            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                    return (t.default = e), t;
                })(h),
                y = n(147),
                _ = (a(y), n(253)),
                b = (a(_), n(21)),
                v = n(254),
                g = a(v),
                E = n(255),
                w = n(440),
                O = (a(w), n(1230)),
                C = function(e, t, n) {
                    if (((0, p.default)(e).empty(), 0 === t.length))
                        return void (0, p.default)(e).append(
                            '<div class="alert alert-info"><p>No BMC data are available.</p></div>'
                        );
                    var a = void 0,
                        r = void 0,
                        o = void 0;
                    (a = d.default.sortBy(t.bmd_activity_selectivity, 'med_pod_med')),
                        (r = d.default.filter(a, function(e) {
                            return null !== e.med_pod_med;
                        })),
                        (o = d.default.filter(a, function(e) {
                            return null !== e.mort_med_pod_med;
                        }));
                    var l = Math.max(Math.floor((0, p.default)(e).innerWidth()), 800),
                        i = { top: 40, right: 100, bottom: 25, left: 300 },
                        u = l - i.left - i.right,
                        s = 20 * a.length + 100 - i.top - i.bottom,
                        c = m.scaleLog,
                        f = m.extent(
                            d.default.compact(
                                d.default.flattenDeep([
                                    d.default.map(r, function(e) {
                                        return [
                                            1e6 * Math.pow(10, e.med_pod_med),
                                            1e6 * Math.pow(10, e.min_pod_med),
                                            1e6 * Math.pow(10, e.max_pod_med),
                                        ];
                                    }),
                                    d.default.map(o, function(e) {
                                        return [
                                            1e6 * Math.pow(10, e.mort_med_pod_med),
                                            1e6 * Math.pow(10, e.mort_min_pod_med),
                                            1e6 * Math.pow(10, e.mort_max_pod_med),
                                        ];
                                    }),
                                ])
                            )
                        ),
                        h = c()
                            .range([1, u - 160])
                            .domain(f)
                            .clamp(!0),
                        y = m
                            .scaleBand()
                            .range([0, s])
                            .padding(0.1)
                            .domain(
                                a.map(function(e) {
                                    return e.preferred_name;
                                })
                            ),
                        _ = m
                            .select(e)
                            .append('svg')
                            .attr('width', u + i.left + i.right)
                            .attr('height', s + i.top + i.bottom)
                            .append('g')
                            .attr('transform', 'translate(' + i.left + ',' + i.top + ')'),
                        v = _.append('g').attr('transform', 'translate(160,0)');
                    v
                        .selectAll('.pod-errorbar')
                        .data(r)
                        .enter()
                        .append('line')
                        .attr('class', 'pod-errorbar')
                        .attr('x1', function(e) {
                            return h(
                                m.min([
                                    1e6 * Math.pow(10, e.min_pod_med),
                                    1e6 * Math.pow(10, e.med_pod_med),
                                ])
                            );
                        })
                        .attr('x2', function(e) {
                            return h(
                                m.max([
                                    1e6 * Math.pow(10, e.med_pod_med),
                                    1e6 * Math.pow(10, e.max_pod_med),
                                ])
                            );
                        })
                        .attr('y1', function(e) {
                            return y(e.preferred_name) + y.bandwidth() / 2;
                        })
                        .attr('y2', function(e) {
                            return y(e.preferred_name) + y.bandwidth() / 2;
                        })
                        .style('stroke', function(e) {
                            return b.CATEGORY_COLORS[e.use_category1];
                        })
                        .style('stroke-width', 8)
                        .style('pointer-events', 'none'),
                        v
                            .selectAll('.pod-circle')
                            .data(r)
                            .enter()
                            .append('circle')
                            .attr('class', 'pod-circle')
                            .attr('cx', function(e) {
                                return h(1e6 * Math.pow(10, e.med_pod_med));
                            })
                            .attr('cy', function(e) {
                                return y(e.preferred_name) + y.bandwidth() / 2;
                            })
                            .attr('r', 10)
                            .style('fill', function(e) {
                                return b.CATEGORY_COLORS[e.use_category1];
                            })
                            .style('cursor', 'pointer')
                            .on('click', function(e) {
                                new g.default(E.Header, E.SingleCurveBody, {
                                    title: e.preferred_name + ': ' + e.endpoint_name,
                                    protocol_id: e.protocol_id,
                                    readout_id: e.endpoint_name + '_' + e.protocol_id,
                                    casrn: e.casrn,
                                });
                            }),
                        v
                            .selectAll('.mort_pod-errorbar')
                            .data(o)
                            .enter()
                            .append('line')
                            .attr('class', 'mort_pod-errorbar')
                            .attr('x1', function(e) {
                                return h(
                                    m.min([
                                        1e6 * Math.pow(10, e.mort_min_pod_med),
                                        1e6 * Math.pow(10, e.mort_med_pod_med),
                                    ])
                                );
                            })
                            .attr('x2', function(e) {
                                return h(
                                    m.max([
                                        1e6 * Math.pow(10, e.mort_med_pod_med),
                                        1e6 * Math.pow(10, e.mort_max_pod_med),
                                    ])
                                );
                            })
                            .attr('y1', function(e) {
                                return y(e.preferred_name) + y.bandwidth() / 2;
                            })
                            .attr('y2', function(e) {
                                return y(e.preferred_name) + y.bandwidth() / 2;
                            })
                            .style('stroke', 'black')
                            .style('stroke-width', 4)
                            .style('stroke-dasharray', '4, 2')
                            .style('pointer-events', 'none')
                            .style('opacity', 0.8),
                        v
                            .selectAll('.mort_pod-circle')
                            .data(o)
                            .enter()
                            .append('circle')
                            .attr('class', 'mort_pod-circle')
                            .attr('cx', function(e) {
                                return h(1e6 * Math.pow(10, e.mort_med_pod_med));
                            })
                            .attr('cy', function(e) {
                                return y(e.preferred_name) + y.bandwidth() / 2;
                            })
                            .attr('r', 7)
                            .style('fill', 'black')
                            .style('opacity', 0.8)
                            .style('cursor', 'pointer')
                            .on('click', function(e) {
                                new g.default(E.Header, E.SingleCurveBody, {
                                    title: e.preferred_name + ': ' + e.endpoint_name,
                                    protocol_id: e.protocol_id,
                                    readout_id: 'Mortality@120_' + e.protocol_id,
                                    casrn: e.casrn,
                                });
                            }),
                        n.isSelective &&
                            (_.append('text')
                                .attr('x', l - i.right - i.left + 10)
                                .attr('y', -8)
                                .style('font-weight', 'bold')
                                .style('font-family', 'sans-serif')
                                .text('Selectivity'),
                            _.selectAll('.selectivity-text')
                                .data(r)
                                .enter()
                                .append('text')
                                .attr('x', l - i.right - i.left + 24)
                                .attr('y', function(e) {
                                    return y(e.preferred_name) + y.bandwidth() / 2;
                                })
                                .attr('dy', '0.35em')
                                .style('font-family', 'sans-serif')
                                .text(function(e) {
                                    return 'zw';
                                })
                                .each(function(e) {
                                    e.has_mort_pod_bmd ||
                                        m
                                            .select(this)
                                            .attr('x', l - i.right - i.left + 10)
                                            .append('tspan')
                                            .text('†')
                                            .attr('baseline-shift', 'super')
                                            .attr('font-size', '0.7em');
                                }),
                            _.append('text')
                                .attr('x', 10 - i.left)
                                .attr('y', s + i.top - i.bottom)
                                .attr('font-size', '0.7em')
                                .style('font-family', 'sans-serif')
                                .text('† ' + b.SELECTIVITY_FOOTNOTE)),
                        _.selectAll('.category')
                            .data(a)
                            .enter()
                            .append('rect')
                            .attr('class', 'category')
                            .attr('x', 5)
                            .attr('width', 150)
                            .attr('y', function(e) {
                                return y(e.preferred_name);
                            })
                            .attr('height', y.bandwidth())
                            .style('fill', function(e) {
                                return b.CATEGORY_COLORS[e.use_category1];
                            }),
                        _.selectAll('.category-text')
                            .data(a)
                            .enter()
                            .append('text')
                            .attr('x', 7)
                            .attr('y', function(e) {
                                return y(e.preferred_name) + y.bandwidth() / 2;
                            })
                            .attr('dy', '0.35em')
                            .text(function(e) {
                                return e.use_category1;
                            })
                            .style('fill', 'white'),
                        _.append('g').call(m.axisLeft(y));
                    var w =
                        n.selectedAxis === b.AXIS_LOG10
                            ? (0, O.getLog10AxisFunction)(m.axisTop, h)
                            : m.axisTop(h);
                    v.append('g').call(w),
                        v
                            .append('text')
                            .attr('transform', 'translate(' + (u - 160) / 2 + ', -25)')
                            .style('text-anchor', 'middle')
                            .text('Benchmark concentration value (µM)');
                    var C = _.append('g')
                        .data([{ x: 10, y: -23 }])
                        .attr('transform', 'translate(10, -23)')
                        .call(
                            m.drag().on('drag', function(e) {
                                (e.x += m.event.dx),
                                    (e.y += m.event.dy),
                                    m
                                        .select(this)
                                        .attr('transform', 'translate(' + e.x + ',' + e.y + ')');
                            })
                        );
                    C.append('rect')
                        .attr('x', 0)
                        .attr('width', 140)
                        .attr('y', -15)
                        .attr('height', 35)
                        .style('fill', 'white')
                        .style('stroke', 'black')
                        .style('stroke-width', '2px')
                        .style('cursor', 'pointer')
                        .attr('title', 'Drag to reposition');
                    var M = d.default.values(b.CATEGORY_COLORS);
                    C.selectAll('.__')
                        .data([
                            { y: -8, sw: 4, da: '10, 0', color: M[0] },
                            { y: -2, sw: 4, da: '10, 0', color: M[9] },
                            { y: 10, sw: 3, da: '4, 2', color: 'black' },
                        ])
                        .enter()
                        .append('line')
                        .attr('x1', 2)
                        .attr('x2', 36)
                        .attr('y1', function(e) {
                            return e.y;
                        })
                        .attr('y2', function(e) {
                            return e.y;
                        })
                        .style('stroke', function(e) {
                            return e.color;
                        })
                        .style('stroke-width', function(e) {
                            return e.sw;
                        })
                        .style('stroke-dasharray', function(e) {
                            return e.da;
                        })
                        .style('opacity', 0.75),
                        C.selectAll('.__')
                            .data([
                                { x: 12, r: 7, y: -8, color: M[0] },
                                { x: 25, r: 7, y: -2, color: M[9] },
                                { x: 20, r: 5, y: 10, color: 'black' },
                            ])
                            .enter()
                            .append('circle')
                            .attr('cx', function(e) {
                                return e.x;
                            })
                            .attr('cy', function(e) {
                                return e.y;
                            })
                            .attr('r', function(e) {
                                return e.r;
                            })
                            .style('fill', function(e) {
                                return e.color;
                            })
                            .style('opacity', 0.75),
                        C.append('text')
                            .attr('x', 38)
                            .attr('y', 0)
                            .text('non-mortality'),
                        C.append('text')
                            .attr('x', 38)
                            .attr('y', 15)
                            .text('mortality');
                },
                M = (function(e) {
                    function t(e) {
                        return (
                            r(this, t),
                            o(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e))
                        );
                    }
                    return (
                        l(t, e),
                        i(t, [
                            {
                                key: 'componentDidMount',
                                value: function() {
                                    this._renderPlot(this.props);
                                },
                            },
                            {
                                key: 'shouldComponentUpdate',
                                value: function(e, t) {
                                    return this._renderPlot(e), !1;
                                },
                            },
                            {
                                key: '_renderPlot',
                                value: function(e) {
                                    C(this.refs.bmd_svg, e.data, {
                                        isSelective: e.visualization === b.BMDVIZ_SELECTIVITY,
                                        selectedAxis: e.selectedAxis,
                                    });
                                },
                            },
                            {
                                key: 'render',
                                value: function() {
                                    return s.default.createElement('div', {
                                        id: 'BMC_heatmap01',
                                        ref: 'bmd_svg',
                                    });
                                },
                            },
                        ]),
                        t
                    );
                })(s.default.Component);
            t.default = M;
        },
        1230: function(e, t, n) {
            'use strict';
            Object.defineProperty(t, '__esModule', { value: !0 }),
                (t.getLog10AxisFunction = void 0);
            var a = n(77),
                r = function(e, t) {
                    var n =
                        Math.ceil(Math.log10(t.domain()[1])) -
                        Math.floor(Math.log10(t.domain()[0]));
                    return (
                        n % 10 == 0 && (n /= 2),
                        e(t).ticks(1.1 * n, function(e) {
                            if (parseInt(Math.log10(e)) === Math.log10(e)) {
                                return (e > 1 ? (0, a.format)(',.0f') : (0, a.format)(',.0g'))(e);
                            }
                            return null;
                        })
                    );
                };
            t.getLog10AxisFunction = r;
        },
        146: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                u = n(9),
                s = a(u),
                c = n(72),
                d = a(c),
                f = (function(e) {
                    function t(e) {
                        r(this, t);
                        var n = o(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                        return (n.handleHelpTextToggle = n.handleHelpTextToggle.bind(n)), n;
                    }
                    return (
                        l(t, e),
                        i(t, [
                            {
                                key: 'handleHelpTextToggle',
                                value: function() {
                                    var e = this.props.stateHolder;
                                    e.setState({ showHelpText: !e.state.showHelpText });
                                },
                            },
                            {
                                key: 'render',
                                value: function() {
                                    return s.default.createElement(
                                        'button',
                                        {
                                            style: { fontSize: '0.7em', paddingLeft: 10 },
                                            title: 'Click to toggle help-text',
                                            onClick: this.handleHelpTextToggle,
                                        },
                                        s.default.createElement('i', {
                                            className: 'pull-right fa fa-question-circle',
                                        })
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(d.default);
            t.default = f;
        },
        21: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            Object.defineProperty(t, '__esModule', { value: !0 }),
                (t.data_exportToJsonFile = t.renderNoSelected = t.renderNoDataAlert = t.printFloat = t.insertIntoDom = t.renderSelectMultiOptgroupWidget = t.renderSelectSingleWidget = t.renderSelectMultiWidget = t.loadMetadata = t.getBmdsUrl = t.getDoseResponsesUrl = t.URL_CHEMXLSX = t.SELECTIVITY_FOOTNOTE = t.READOUT_TYPE_CATEGORY = t.READOUT_TYPE_READOUT = t.BMDVIZ_SELECTIVITY = t.BMDVIZ_ACTIVITY = t.INTVIZ_HEATMAP = t.INTVIZ_CHEMICAL_PCA = t.INTVIZ_ASSAY_PCA = t.INTVIZ_DevtoxHEATMAP = t.INTVIZ_OBAMA = t.HEATMAP_BMC = t.HEATMAP_ACTIVITY = t.NO_COLLAPSE = t.COLLAPSE_BY_READOUT = t.COLLAPSE_BY_CHEMICAL = t.CHEMLIST_ALL = t.CHEMLIST_91 = t.CHEMLIST_80 = t.CHEMFILTER_CHEMICIAL = t.CHEMFILTER_CATEGORY = t.CATEGORY_COLORS = t.BMD_CW = t.BMD_HILL = t.BMD_CURVEP = t.AXIS_SQRT = t.AXIS_LOG10 = t.AXIS_LINEAR = void 0);
            var r = n(55),
                o = a(r),
                l = n(77),
                i = (function(e) {
                    if (e && e.__esModule) return e;
                    var t = {};
                    if (null != e)
                        for (var n in e)
                            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                    return (t.default = e), t;
                })(l),
                u = n(9),
                s = a(u),
                c = n(147),
                d = a(c),
                f = { 1: 'curvep', 2: 'hill' },
                p = {
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
                h = function(e) {
                    i.json('/seazit/api/seazit_metadata/metadata/?format=json', function(t) {
                        e.setState({
                            metadataLoaded: !0,
                            protocol_data: t.protocol_data,
                            Seazit_chemical_info: t.Seazit_chemical_info,
                            Seazit_ui_panel: t.Seazit_ui_panel,
                        });
                    });
                },
                m = function(e) {
                    var t = JSON.stringify(e),
                        n = 'data:application/json;charset=utf-8,' + encodeURIComponent(t),
                        a = document.createElement('a');
                    a.setAttribute('href', n),
                        a.setAttribute('download', 'jsonData.csv'),
                        a.click();
                },
                y = function(e, t, n, a, r) {
                    var o = Math.min(n.length, 11);
                    return s.default.createElement(
                        'div',
                        null,
                        s.default.createElement('label', null, 'Select ', t, '(s):'),
                        s.default.createElement(
                            'select',
                            {
                                name: e,
                                className: 'form-control',
                                multiple: !0,
                                size: o,
                                onChange: r,
                                value: a,
                            },
                            n.map(function(e) {
                                return s.default.createElement(
                                    'option',
                                    { key: e.key, value: e.key },
                                    e.label
                                );
                            })
                        )
                    );
                },
                _ = function(e, t, n, a, r) {
                    return s.default.createElement(
                        'div',
                        null,
                        s.default.createElement('label', null, 'Select one ', t, '(s):'),
                        s.default.createElement(
                            'select',
                            {
                                name: e,
                                className: 'form-control',
                                onChange: r,
                                size: Math.min(n.length, 11),
                                value: a,
                            },
                            n.map(function(e) {
                                return s.default.createElement(
                                    'option',
                                    { title: e.label, key: e.key, value: e.key },
                                    e.label
                                );
                            })
                        )
                    );
                },
                b = function(e, t, n, a, r) {
                    return s.default.createElement(
                        'div',
                        null,
                        s.default.createElement('label', null, 'Select ', t, '(s):'),
                        s.default.createElement(
                            'select',
                            {
                                name: e,
                                className: 'form-control',
                                multiple: !0,
                                size: 10,
                                onChange: r,
                                value: a,
                            },
                            o.default.map(n, function(e, t) {
                                return s.default.createElement(
                                    'optgroup',
                                    { key: t, label: t },
                                    e.map(function(e) {
                                        return s.default.createElement(
                                            'option',
                                            { key: e.key, value: e.key },
                                            e.label
                                        );
                                    })
                                );
                            })
                        )
                    );
                },
                v = function(e, t) {
                    d.default.render(s.default.createElement(e), t);
                },
                g = function(e, t, n) {
                    return 0 === e.length || 0 === t.length || 0 === n.length
                        ? null
                        : '/seazit/api/seazit_result/drs/?format=json&protocol_ids=' +
                              e.join(',') +
                              '&readouts=' +
                              t.join(',') +
                              '&casrns=' +
                              n.join(',');
                },
                E = function(e, t) {
                    return 0 === e.length || 0 === t.length
                        ? null
                        : '/seazit/api/seazit_result/bmcByLabResult/?format=json&protocol_ids=' +
                              e +
                              '&readouts=' +
                              t;
                },
                w = function(e) {
                    return e <= 0
                        ? '-'
                        : e <= 0.01 || e >= 1e3
                        ? e.toExponential(2).toUpperCase()
                        : e.toFixed(2);
                },
                O = function() {
                    return s.default.createElement(
                        'div',
                        { className: 'alert alert-info' },
                        s.default.createElement(
                            'p',
                            null,
                            'This combination of ',
                            s.default.createElement('b', null, 'endpoints'),
                            ' and ',
                            s.default.createElement('b', null, 'chemicals'),
                            ' returned no data.'
                        )
                    );
                },
                C = function(e) {
                    return s.default.createElement(
                        'div',
                        { className: 'alert alert-info' },
                        s.default.createElement(
                            'ul',
                            null,
                            void 0 === e.hasReadouts || e.hasReadouts
                                ? null
                                : s.default.createElement(
                                      'li',
                                      null,
                                      'No ',
                                      s.default.createElement('b', null, 'readouts'),
                                      ' are selected. Please select at least one readout (you must first select one or more assays).'
                                  ),
                            void 0 === e.hasReadoutCategories || e.hasReadoutCategories
                                ? null
                                : s.default.createElement(
                                      'li',
                                      null,
                                      'No ',
                                      s.default.createElement('b', null, 'endpoint categories'),
                                      ' are selected. Please select at least one endpoint-category.'
                                  ),
                            void 0 === e.hasChems || e.hasChems
                                ? null
                                : s.default.createElement(
                                      'li',
                                      null,
                                      'No ',
                                      s.default.createElement('b', null, 'chemicals'),
                                      ' are selected. Please select at least one chemical or chemical-category.'
                                  )
                        )
                    );
                };
            (t.AXIS_LINEAR = 1),
                (t.AXIS_LOG10 = 2),
                (t.AXIS_SQRT = 3),
                (t.BMD_CURVEP = 1),
                (t.BMD_HILL = 2),
                (t.BMD_CW = f),
                (t.CATEGORY_COLORS = p),
                (t.CHEMFILTER_CATEGORY = 1),
                (t.CHEMFILTER_CHEMICIAL = 2),
                (t.CHEMLIST_80 = 1),
                (t.CHEMLIST_91 = 2),
                (t.CHEMLIST_ALL = 3),
                (t.COLLAPSE_BY_CHEMICAL = 'COLLAPSE_BY_CHEMICAL'),
                (t.COLLAPSE_BY_READOUT = 'COLLAPSE_BY_READOUT'),
                (t.NO_COLLAPSE = 'NO_COLLAPSE'),
                (t.HEATMAP_ACTIVITY = 1),
                (t.HEATMAP_BMC = 2),
                (t.INTVIZ_OBAMA = 1),
                (t.INTVIZ_DevtoxHEATMAP = 2),
                (t.INTVIZ_ASSAY_PCA = 3),
                (t.INTVIZ_CHEMICAL_PCA = 4),
                (t.INTVIZ_HEATMAP = 5),
                (t.BMDVIZ_ACTIVITY = 1),
                (t.BMDVIZ_SELECTIVITY = 2),
                (t.READOUT_TYPE_READOUT = 1),
                (t.READOUT_TYPE_CATEGORY = 2),
                (t.SELECTIVITY_FOOTNOTE =
                    'Selectivity is estimated and true value may be higher; viability BMC could not be calculated and was therefore estimated to equal the maximum tested dose.'),
                (t.URL_CHEMXLSX = '/static_seazit/resources/seazit/NTP%20Chemical%20Library.xlsx'),
                (t.getDoseResponsesUrl = g),
                (t.getBmdsUrl = E),
                (t.loadMetadata = h),
                (t.renderSelectMultiWidget = y),
                (t.renderSelectSingleWidget = _),
                (t.renderSelectMultiOptgroupWidget = b),
                (t.insertIntoDom = v),
                (t.printFloat = w),
                (t.renderNoDataAlert = O),
                (t.renderNoSelected = C),
                (t.data_exportToJsonFile = m);
        },
        251: function(e, t, n) {
            'use strict';
            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function r(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function o(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var l = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                i = n(9),
                u = (function(e) {
                    return e && e.__esModule ? e : { default: e };
                })(i),
                s = (function(e) {
                    function t() {
                        return (
                            a(this, t),
                            r(
                                this,
                                (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments)
                            )
                        );
                    }
                    return (
                        o(t, e),
                        l(t, [
                            {
                                key: 'render',
                                value: function() {
                                    return u.default.createElement(
                                        'p',
                                        { className: 'help-block' },
                                        u.default.createElement(
                                            'b',
                                            null,
                                            'Note on Accessibility:'
                                        ),
                                        ' Persons with disabilities or using assistive  technology may find parts of this page are not fully accessible. The datasets that  underlie these graphics are available on the',
                                        ' ',
                                        u.default.createElement(
                                            'a',
                                            { href: '/seazit/resources/' },
                                            'Resources'
                                        ),
                                        '  tab. For assistance,',
                                        ' ',
                                        u.default.createElement(
                                            'a',
                                            {
                                                href:
                                                    'mailto:ntpwebrequest@niehs.nih.gov?subject=Accessibility%20Assistance',
                                            },
                                            'email us'
                                        ),
                                        '  or use our',
                                        ' ',
                                        u.default.createElement(
                                            'a',
                                            {
                                                href:
                                                    'https://tools.niehs.nih.gov/webforms/index.cfm/main/formViewer/form_id/521/to/cdm',
                                            },
                                            'contact form'
                                        ),
                                        '  and identify the content for which access is required. NIEHS has',
                                        ' ',
                                        u.default.createElement(
                                            'a',
                                            {
                                                href:
                                                    'https://www.niehs.nih.gov/about/od/ocpl/policies/#a6581',
                                            },
                                            'helpful information'
                                        ),
                                        '  on accessibility.'
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(u.default.Component);
            t.default = s;
        },
        252: function(e, t, n) {
            'use strict';
            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function r(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function o(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var l = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                i = n(9),
                u = (function(e) {
                    return e && e.__esModule ? e : { default: e };
                })(i),
                s = (function(e) {
                    function t() {
                        return (
                            a(this, t),
                            r(
                                this,
                                (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments)
                            )
                        );
                    }
                    return (
                        o(t, e),
                        l(t, [
                            {
                                key: 'render',
                                value: function() {
                                    return u.default.createElement(
                                        'div',
                                        null,
                                        u.default.createElement('b', null, 'Loading... '),
                                        u.default.createElement('i', {
                                            className: 'fa fa-cog fa-spin fa-fw',
                                        })
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(u.default.Component);
            t.default = s;
        },
        253: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i =
                    Object.assign ||
                    function(e) {
                        for (var t = 1; t < arguments.length; t++) {
                            var n = arguments[t];
                            for (var a in n)
                                Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
                        }
                        return e;
                    },
                u = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                s = n(55),
                c = a(s),
                d = n(77),
                f = (function(e) {
                    if (e && e.__esModule) return e;
                    var t = {};
                    if (null != e)
                        for (var n in e)
                            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                    return (t.default = e), t;
                })(d),
                p = n(9),
                h = a(p),
                m = n(54),
                y = a(m),
                _ = n(1218),
                b = a(_),
                v = n(21),
                g = (function(e) {
                    function t(e) {
                        r(this, t);
                        var n = o(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                        return (
                            (n.colorScale = f.scaleOrdinal(f.schemeCategory10)),
                            (n.state = {
                                data: [],
                                scale: c.default.noop,
                                collapsedData: [],
                                error: null,
                                labelsDict: {},
                            }),
                            n
                        );
                    }
                    return (
                        l(t, e),
                        u(t, [
                            {
                                key: 'collapseData',
                                value: function(e, t) {
                                    var n = this,
                                        a = c.default
                                            .chain(e.dose_response)
                                            .map('key')
                                            .uniq()
                                            .value(),
                                        r = c.default
                                            .chain(e.dose_response)
                                            .map('groupKey')
                                            .uniq()
                                            .value(),
                                        o = c.default
                                            .chain(a)
                                            .map(function(t) {
                                                return {
                                                    key: t,
                                                    groupKeys: r,
                                                    dose_response: c.default.filter(
                                                        e.dose_response,
                                                        { key: t }
                                                    ),
                                                    bmcoutput: c.default.filter(e.bmcoutput, {
                                                        key: t,
                                                    }),
                                                };
                                            })
                                            .each(function(e, a) {
                                                var r = e.dose_response[0];
                                                (e.title = n.getPlotTitle(r, t)),
                                                    (e.casrn = r.casrn),
                                                    (e.endpoint_name = r.endpoint_name),
                                                    (e.input_ids = c.default
                                                        .chain(e.bmcoutput)
                                                        .map('input_id')
                                                        .uniq()
                                                        .value()),
                                                    (e.bmcoutput = e.bmcoutput.filter(function(t) {
                                                        return e.input_ids.includes(t.input_id);
                                                    })),
                                                    (e.substance_code_input_ids = c.default
                                                        .chain(
                                                            e.dose_response.filter(function(t) {
                                                                return e.input_ids.includes(
                                                                    t.input_id
                                                                );
                                                            })
                                                        )
                                                        .map('substance_code_input_id')
                                                        .uniq()
                                                        .value());
                                            })
                                            .sortBy('endpoint_name')
                                            .sortBy('casrn')
                                            .value(),
                                        l = void 0;
                                    return (
                                        (l = [0, 100]),
                                        { data: e, collapsedData: o, yrange: l, error: null }
                                    );
                                },
                            },
                            {
                                key: 'fetchDoseResponseData',
                                value: function(e) {
                                    var t = this;
                                    f.json(e, function(e, n) {
                                        if (e) {
                                            var a = e.target.responseText
                                                .replace('["', '')
                                                .replace('"]', '');
                                            return void t.setState({ data: [], error: a });
                                        }
                                        t.updateData(n, t.props.collapse);
                                    });
                                },
                            },
                            {
                                key: 'getColorScale',
                                value: function(e, t) {
                                    if (c.default.isEmpty(e)) return c.default.noop;
                                    switch (t) {
                                        case v.COLLAPSE_BY_READOUT:
                                            return this.colorScale.domain(
                                                c.default.map(e[0].dose_response, 'casrn')
                                            );
                                        case v.COLLAPSE_BY_CHEMICAL:
                                            return this.colorScale.domain(
                                                c.default.map(e[0].dose_response, 'endpoint_name')
                                            );
                                        case v.NO_COLLAPSE:
                                            return c.default.noop;
                                        default:
                                            throw 'Unknown collapse type.';
                                    }
                                },
                            },
                            {
                                key: 'getMarkerColor',
                                value: function(e) {
                                    arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                                    return this.state.scale(e);
                                },
                            },
                            {
                                key: 'getPlotTitle',
                                value: function(e, t) {
                                    switch (t) {
                                        case v.COLLAPSE_BY_READOUT:
                                            return e.protocol_name_plot + '<br>' + e.endpoint_name;
                                        case v.COLLAPSE_BY_CHEMICAL:
                                            return e.casrn + '|' + e.dtxsid;
                                        case v.NO_COLLAPSE:
                                            return (
                                                e.protocol_name_plot +
                                                '<br>' +
                                                e.preferred_name +
                                                '<br>' +
                                                e.casrn +
                                                '|' +
                                                e.dtxsid +
                                                ':<br>' +
                                                e.endpoint_name
                                            );
                                        default:
                                            throw 'Unknown collapse type.';
                                    }
                                },
                            },
                            {
                                key: 'getResponseLabels',
                                value: function(e, t, n) {
                                    if (c.default.isEmpty(e)) return '';
                                    var a = e.substance_code,
                                        r = e.input_id;
                                    switch (
                                        (this.state.labelsDict[a]
                                            ? this.state.labelsDict[a].includes(r) ||
                                              this.state.labelsDict[a].push(r)
                                            : ((this.state.labelsDict[a] = []),
                                              this.state.labelsDict[a].push(r)),
                                        t)
                                    ) {
                                        case v.COLLAPSE_BY_READOUT:
                                            return (
                                                e.preferred_name + '|' + e.casrn + '|' + e.dtxsid
                                            );
                                        case v.COLLAPSE_BY_CHEMICAL:
                                            return e.protocol_name_plot + '|' + e.endpoint_name;
                                        case v.NO_COLLAPSE:
                                            return 'PC' == n
                                                ? 'PC| ' +
                                                      Object.values(this.state.labelsDict[a]).length
                                                : 1 == n.length
                                                ? 'plate| ' +
                                                  Object.values(this.state.labelsDict[a]).length
                                                : 'dup ' +
                                                  Object.keys(this.state.labelsDict).length +
                                                  '| plate ' +
                                                  Object.values(this.state.labelsDict[a]).length;
                                        default:
                                            throw 'Unknown collapse type.';
                                    }
                                },
                            },
                            {
                                key: 'getTextLabels',
                                value: function(e, t) {
                                    if (e.length > 0) {
                                        var n = t.bmcoutput.filter(function(t) {
                                            return t.input_id == e[0].input_id;
                                        });
                                        return (
                                            (n = n[0]),
                                            n.hit_confidence < 0.5
                                                ? ' '
                                                : 'BMC:' +
                                                  (0, v.printFloat)(1e6 * Math.pow(10, n.pod_med)) +
                                                  ' µM'
                                        );
                                    }
                                },
                            },
                            {
                                key: 'getBMCLabels',
                                value: function(e, t) {
                                    if (c.default.isEmpty(e)) return '';
                                    switch (t) {
                                        case v.COLLAPSE_BY_READOUT:
                                        case v.COLLAPSE_BY_CHEMICAL:
                                            return (
                                                e.endpoint_name +
                                                '@' +
                                                e.substance_code +
                                                '@' +
                                                e.input_id
                                            );
                                        case v.NO_COLLAPSE:
                                            return e.input_id;
                                        default:
                                            throw 'Unknown collapse type.';
                                    }
                                },
                            },
                            {
                                key: 'setDatasetKey',
                                value: function(e, t) {
                                    switch (t) {
                                        case v.COLLAPSE_BY_READOUT:
                                            (e.key = e.protocol_id + '|' + e.endpoint_name),
                                                (e.groupKey = e.casrn),
                                                (e.substance_code_input_id =
                                                    e.substance_code + '|' + e.input_id);
                                            break;
                                        case v.COLLAPSE_BY_CHEMICAL:
                                            (e.key = e.protocol_id + '|' + e.casrn),
                                                (e.groupKey = e.endpoint_name),
                                                (e.substance_code_input_id =
                                                    e.substance_code + '|' + e.input_id);
                                            break;
                                        case v.NO_COLLAPSE:
                                            (e.key =
                                                e.protocol_id +
                                                '|' +
                                                e.endpoint_name +
                                                '|' +
                                                e.casrn),
                                                (e.groupKey = null),
                                                (e.substance_code_input_id =
                                                    e.substance_code + '|' + e.input_id);
                                            break;
                                        default:
                                            throw 'Unknown collapse type.';
                                    }
                                },
                            },
                            {
                                key: 'setKeys',
                                value: function(e, t) {
                                    var n = this;
                                    c.default.each(e.dose_response, function(e) {
                                        return n.setDatasetKey(e, t);
                                    }),
                                        c.default.each(e.bmcoutput, function(e) {
                                            return n.setDatasetKey(e, t);
                                        });
                                },
                            },
                            {
                                key: 'updateData',
                                value: function(e, t) {
                                    this.setKeys(e, t);
                                    var n = this.collapseData(e, t),
                                        a = this.getColorScale(n.collapsedData, t);
                                    this.setState(i({}, n, { scale: a }));
                                },
                            },
                            {
                                key: '_renderPlot',
                                value: function(e, t) {
                                    var n = this;
                                    if (void 0 !== this.refs[e.key]) {
                                        var a = [],
                                            r = null,
                                            o = {
                                                modeBarButtonsToAdd: [
                                                    {
                                                        name: 'Download plot as a SVG',
                                                        icon: b.default.Icons.camera,
                                                        click: function(e) {
                                                            b.default.downloadImage(e, {
                                                                format: 'svg',
                                                            });
                                                        },
                                                    },
                                                ],
                                            },
                                            l = {
                                                title: e.title,
                                                titlefont: { size: 12 },
                                                shapes: [],
                                                xaxis: {
                                                    type: 'log',
                                                    autorange: !0,
                                                    title: 'Concentration (µM)',
                                                    dtick: 1,
                                                },
                                                yaxis: {
                                                    type: 'linear',
                                                    title: 'response (%)',
                                                    range: [-10, 110],
                                                },
                                                height:
                                                    this.props.height +
                                                    19 * e.groupKeys.length +
                                                    20,
                                                autosize: !0,
                                            };
                                        e.groupKeys.map(function(t) {
                                            var o = e.dose_response.filter(function(e) {
                                                    return e.groupKey == t;
                                                }),
                                                l = c.default
                                                    .chain(o)
                                                    .map('substance_code')
                                                    .uniq()
                                                    .value();
                                            (n.state.labelsDict = []),
                                                e.substance_code_input_ids.map(function(r, i) {
                                                    var u = o.filter(function(e) {
                                                        return e.substance_code_input_id == r;
                                                    });
                                                    c.default
                                                        .chain(a)
                                                        .map('name')
                                                        .uniq()
                                                        .value();
                                                    (u = c.default.sortBy(u, 'dose')),
                                                        a.push({
                                                            x: c.default.map(u, 'dose'),
                                                            y: u.map(function(e) {
                                                                return (e.n_in / e.n) * 100;
                                                            }),
                                                            legendgroup: 'plot',
                                                            mode: 'line',
                                                            type: 'scatter',
                                                            name: n.getResponseLabels(
                                                                u[0],
                                                                n.props.collapse,
                                                                l
                                                            ),
                                                            text: n.getTextLabels(u, e),
                                                            marker: {
                                                                color: n.getMarkerColor(
                                                                    t,
                                                                    'responses'
                                                                ),
                                                            },
                                                            opacity: 0.8,
                                                        });
                                                }),
                                                e.bmcoutput.length > 0 &&
                                                    e.bmcoutput
                                                        .filter(function(e) {
                                                            return e.groupKey == t;
                                                        })
                                                        .forEach(function(e) {
                                                            if (
                                                                !(
                                                                    null === e.trsh ||
                                                                    e.hit_confidence < 0.5
                                                                )
                                                            ) {
                                                                r = e.trsh;
                                                            }
                                                        });
                                        }),
                                            this.props.collapse === v.NO_COLLAPSE &&
                                                r &&
                                                l.shapes.push({
                                                    type: 'line',
                                                    xref: 'paper',
                                                    x0: 0,
                                                    y0: r,
                                                    x1: 1,
                                                    y1: r,
                                                    line: { color: 'grey', width: 2, dash: 'dot' },
                                                }),
                                            this.props.collapse !== v.NO_COLLAPSE &&
                                                (l.legend = { orientation: 'h', y: -0.3 }),
                                            b.default.newPlot(this.refs[e.key], a, l, o);
                                    }
                                },
                            },
                            {
                                key: 'loadDoseResponse',
                                value: function() {
                                    var e = this;
                                    this.state.collapsedData.map(function(t) {
                                        return e._renderPlot(t, e.state.yrange);
                                    });
                                },
                            },
                            {
                                key: 'componentWillMount',
                                value: function() {
                                    this.fetchDoseResponseData(this.props.url);
                                },
                            },
                            {
                                key: 'componentWillUpdate',
                                value: function(e) {
                                    e.url !== this.props.url && this.fetchDoseResponseData(e.url),
                                        e.collapse !== this.props.collapse &&
                                            this.updateData(this.state.data, e.collapse);
                                },
                            },
                            {
                                key: 'componentDidMount',
                                value: function() {
                                    this.loadDoseResponse();
                                },
                            },
                            {
                                key: 'componentDidUpdate',
                                value: function() {
                                    this.loadDoseResponse();
                                },
                            },
                            {
                                key: 'render',
                                value: function() {
                                    if (this.state.error)
                                        return h.default.createElement(
                                            'div',
                                            { className: 'alert alert-warning' },
                                            h.default.createElement(
                                                'p',
                                                null,
                                                h.default.createElement('b', null, this.state.error)
                                            )
                                        );
                                    var e = Math.ceil(12 / this.props.cols);
                                    return h.default.createElement(
                                        'div',
                                        null,
                                        this.state.collapsedData.map(function(t) {
                                            return h.default.createElement('div', {
                                                className: 'col-xs-' + e,
                                                key: t.key,
                                                ref: t.key,
                                            });
                                        })
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(h.default.Component);
            (g.propTypes = {
                cols: y.default.number.isRequired,
                collapse: y.default.string.isRequired,
                height: y.default.number.isRequired,
                url: y.default.string.isRequired,
            }),
                (t.default = g);
        },
        254: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var o = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                l = n(67),
                i = a(l),
                u = n(9),
                s = a(u),
                c = n(147),
                d = a(c),
                f = (function() {
                    function e(t, n, a) {
                        r(this, e),
                            (this.headerComponent = t),
                            (this.bodyComponent = n),
                            (this.args = a || {}),
                            (this.modal = this._getModalContainer()),
                            (this.header = this.modal.find('.modal-title').get(0)),
                            (this.body = this.modal.find('.modal-body').get(0)),
                            this.render();
                    }
                    return (
                        o(e, [
                            {
                                key: 'render',
                                value: function() {
                                    var e = this;
                                    this.modal
                                        .one('shown.bs.modal', function() {
                                            d.default.render(
                                                s.default.createElement(
                                                    e.headerComponent,
                                                    e.args,
                                                    null
                                                ),
                                                e.header
                                            ),
                                                d.default.render(
                                                    s.default.createElement(
                                                        e.bodyComponent,
                                                        e.args,
                                                        null
                                                    ),
                                                    e.body
                                                );
                                        })
                                        .modal('show')
                                        .one('hide.bs.modal', function() {
                                            d.default.unmountComponentAtNode(e.header),
                                                d.default.unmountComponentAtNode(e.body);
                                        });
                                },
                            },
                            {
                                key: '_getModalContainer',
                                value: function() {
                                    var e = (0, i.default)('.modal');
                                    return (
                                        0 === e.length &&
                                            ((0, i.default)(document.body).append(
                                                '\n                <div class="modal fade" tabindex="-1" role="dialog">\n                    <div class="modal-dialog" role="document">\n                        <div class="modal-content">\n                            <div class="modal-header">\n                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                                    <span aria-hidden="true">&times;</span>\n                                </button>\n                                <div class="modal-title">\n                                </div>\n                            </div>\n                            <div class="modal-body">\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            '
                                            ),
                                            (e = (0, i.default)('.modal'))),
                                        e
                                    );
                                },
                            },
                        ]),
                        e
                    );
                })();
            t.default = f;
        },
        255: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 }),
                (t.SingleCurveBody = t.Header = void 0);
            var i = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                u = n(9),
                s = a(u),
                c = n(54),
                d = a(c),
                f = n(253),
                p = a(f),
                h = n(439),
                m = (a(h), n(21)),
                y = (function(e) {
                    function t() {
                        return (
                            r(this, t),
                            o(
                                this,
                                (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments)
                            )
                        );
                    }
                    return (
                        l(t, e),
                        i(t, [
                            {
                                key: 'render',
                                value: function() {
                                    return s.default.createElement('h4', null, this.props.title);
                                },
                            },
                        ]),
                        t
                    );
                })(s.default.Component);
            y.propTypes = { title: d.default.string.isRequired };
            var _ = (function(e) {
                function t() {
                    return (
                        r(this, t),
                        o(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
                    );
                }
                return (
                    l(t, e),
                    i(t, [
                        {
                            key: 'render',
                            value: function() {
                                var e = (0, m.getDoseResponsesUrl)(
                                    [this.props.protocol_id],
                                    [this.props.readout_id],
                                    [this.props.casrn]
                                );
                                return s.default.createElement(p.default, {
                                    url: e,
                                    cols: 1,
                                    height: 400,
                                    collapse: m.NO_COLLAPSE,
                                });
                            },
                        },
                    ]),
                    t
                );
            })(s.default.Component);
            (_.propTypes = {
                protocol_id: d.default.number.isRequired,
                readout_id: d.default.string.isRequired,
                casrn: d.default.string.isRequired,
            }),
                (t.Header = y),
                (t.SingleCurveBody = _);
        },
        438: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                u = n(67),
                s = (a(u), n(55)),
                c = a(s),
                d = n(9),
                f = a(d),
                p = n(54),
                h = a(p),
                m = n(72),
                y = a(m),
                _ = n(21),
                b = (function(e) {
                    function t(e) {
                        return (
                            r(this, t),
                            o(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e))
                        );
                    }
                    return (
                        l(t, e),
                        i(t, [
                            {
                                key: '_renderAssaySelector',
                                value: function(e) {
                                    var t = c.default
                                        .chain(e.protocol_data)
                                        .map(function(e) {
                                            return {
                                                key: e.seazit_protocol_id,
                                                label: e.protocol_name_long,
                                                protocol_name: e.protocol_name,
                                                protocol_type: e.protocol_type,
                                                protocol_source: e.protocol_source,
                                                seazit_protocol_id: e.seazit_protocol_id,
                                                lab_anonymous_code: e.lab_anonymous_code,
                                                study_phase: e.study_phase,
                                                test_condition: e.test_condition,
                                                protocol_name_long: e.protocol_name_long,
                                                protocol_name_plot: e.protocol_name_plot,
                                            };
                                        })
                                        .sortBy('seazit_protocol_id')
                                        .value();
                                    return !0 === this.props.multiAssaySelector
                                        ? (0, _.renderSelectMultiWidget)(
                                              'assays',
                                              'Dataset',
                                              t,
                                              e.assays,
                                              this.handleSelectMultiChange
                                          )
                                        : (0, _.renderSelectSingleWidget)(
                                              'assay',
                                              'Dataset',
                                              t,
                                              e.assay,
                                              this.handleSelectChange
                                          );
                                },
                            },
                            {
                                key: '_renderReadoutSelector',
                                value: function(e) {
                                    var t =
                                            !0 === this.props.multiAssaySelector
                                                ? e.assays
                                                : [e.assay],
                                        n = c.default
                                            .chain(e.Seazit_ui_panel)
                                            .filter(function(e) {
                                                return c.default.includes(
                                                    t,
                                                    e.seazit_protocol_id.toString()
                                                );
                                            })
                                            .value();
                                    if (this.props.multiReadoutSelector) {
                                        n = c.default
                                            .chain(n)
                                            .map(function(e) {
                                                return {
                                                    key: e.endpoint_name_protocol.toString(),
                                                    category: e.protocol_name_plot,
                                                    label: e.endpoint_name,
                                                    protocol_name: e.protocol_name,
                                                    seazit_protocol_id: e.seazit_protocol_id,
                                                    study_phase: e.study_phase,
                                                    test_condition: e.test_condition,
                                                    protocol_name_long: e.protocol_name_long,
                                                    protocol_name_plot: e.protocol_name_plot,
                                                    endpoint_name_protocol:
                                                        e.endpoint_name_protocol,
                                                };
                                            })
                                            .sortBy('label')
                                            .sortBy('category')
                                            .groupBy('category')
                                            .value();
                                        var a = [
                                            'MalformedAny+Mort@120',
                                            'Mortality@120',
                                            'Mortality@24',
                                        ];
                                        return (
                                            Object.values(n).forEach(function(e) {
                                                e.forEach(function(t, n) {
                                                    a.includes(t.label) &&
                                                        (e.splice(n, 1), e.unshift(t));
                                                });
                                            }),
                                            0 === c.default.keys(n).length
                                                ? null
                                                : (0, _.renderSelectMultiOptgroupWidget)(
                                                      'readouts',
                                                      'Endpoint',
                                                      n,
                                                      e.readouts,
                                                      this.handleSelectMultiChange
                                                  )
                                        );
                                    }
                                    (n = c.default
                                        .chain(n)
                                        .map(function(e) {
                                            return {
                                                key: e.endpoint_name.toString(),
                                                category: e.protocol_name_plot,
                                                label: e.endpoint_name,
                                                protocol_name: e.protocol_name,
                                                seazit_protocol_id: e.seazit_protocol_id.toString(),
                                                study_phase: e.study_phase,
                                                test_condition: e.test_condition,
                                                protocol_name_long: e.protocol_name_long,
                                                protocol_name_plot: e.protocol_name_plot,
                                                endpoint_name_protocol: e.endpoint_name_protocol,
                                            };
                                        })
                                        .sortBy('label')
                                        .sortBy('category')
                                        .groupBy('category')
                                        .value()),
                                        Object.values(n).forEach(function(e) {
                                            e.forEach(function(t, n) {
                                                ('Mortality@120' == t.key ||
                                                    'Mortality@24' == t.key ||
                                                    t.key.includes('@24')) &&
                                                    delete e[n];
                                            });
                                        });
                                    var r = ['MalformedAny+Mort@120'];
                                    return (
                                        Object.values(n).forEach(function(e) {
                                            e.forEach(function(t, n) {
                                                r.includes(t.label) &&
                                                    (e.splice(n, 1), e.unshift(t));
                                            });
                                        }),
                                        0 === c.default.keys(n).length
                                            ? null
                                            : ((n = Object.values(n)[0]),
                                              (0, _.renderSelectSingleWidget)(
                                                  'readouts',
                                                  'Endpoint',
                                                  n,
                                                  e.readouts,
                                                  this.handleSelectChange
                                              ))
                                    );
                                },
                            },
                            {
                                key: 'render',
                                value: function() {
                                    var e = this.props.stateHolder.state;
                                    return f.default.createElement(
                                        'div',
                                        null,
                                        this._renderAssaySelector(e),
                                        this._renderReadoutSelector(e)
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(y.default);
            (b.propTypes = {
                stateHolder: h.default.instanceOf(f.default.Component).isRequired,
                hideViability: h.default.bool.isRequired,
                hideNonViability: h.default.bool.isRequired,
                multiAssaySelector: h.default.bool.isRequired,
                multiReadoutSelector: h.default.bool.isRequired,
                tabName: h.default.string.isRequired,
            }),
                (t.default = b);
        },
        439: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                u = n(9),
                s = a(u),
                c = n(72),
                d = a(c),
                f = (function(e) {
                    function t() {
                        return (
                            r(this, t),
                            o(
                                this,
                                (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments)
                            )
                        );
                    }
                    return (
                        l(t, e),
                        i(t, [
                            {
                                key: 'render',
                                value: function() {
                                    var e = this.props.stateHolder.state;
                                    return s.default.createElement(
                                        'div',
                                        null,
                                        s.default.createElement(
                                            'label',
                                            null,
                                            'Number of columns [1-4]:'
                                        ),
                                        s.default.createElement('input', {
                                            className: 'form-control',
                                            type: 'range',
                                            name: 'vizColumns',
                                            min: '1',
                                            max: '4',
                                            onChange: this.handleIntegerInputChange,
                                            value: e.vizColumns,
                                        }),
                                        s.default.createElement(
                                            'span',
                                            null,
                                            e.vizColumns,
                                            ' columns selected'
                                        ),
                                        s.default.createElement('br', null),
                                        s.default.createElement(
                                            'label',
                                            null,
                                            'Image height [350-700px]:'
                                        ),
                                        s.default.createElement('input', {
                                            className: 'form-control',
                                            type: 'range',
                                            name: 'vizHeight',
                                            min: '350',
                                            max: '700',
                                            step: '50',
                                            onChange: this.handleIntegerInputChange,
                                            value: e.vizHeight,
                                        }),
                                        s.default.createElement(
                                            'span',
                                            null,
                                            e.vizHeight,
                                            ' px selected'
                                        )
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(d.default);
            t.default = f;
        },
        440: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i =
                    Object.assign ||
                    function(e) {
                        for (var t = 1; t < arguments.length; t++) {
                            var n = arguments[t];
                            for (var a in n)
                                Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
                        }
                        return e;
                    },
                u = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                s = n(9),
                c = a(s),
                d = n(147),
                f = (a(d), n(54)),
                p = a(f),
                h = n(55),
                m = a(h),
                y = n(77),
                _ = (function(e) {
                    if (e && e.__esModule) return e;
                    var t = {};
                    if (null != e)
                        for (var n in e)
                            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                    return (t.default = e), t;
                })(y),
                b = n(252),
                v = a(b),
                g = n(1227),
                E = a(g),
                w = n(1228),
                O = a(w),
                C = n(1229),
                M = a(C),
                S = n(21),
                T = (function(e) {
                    function t(e) {
                        r(this, t);
                        var n = o(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                        return (
                            (n.data_exportToCSVFile = function(e) {
                                if (0 == e.length) return '';
                                var t = m.default.sortBy(e.bmd_activity_selectivity, 'med_pod_med');
                                console.log('bmd d'), console.log(t);
                                var n = [
                                        'preferred_name',
                                        'casrn',
                                        'use_category1',
                                        'med_pod_med',
                                        'min_pod_med',
                                        'max_pod_med',
                                        'mort_med_pod_med',
                                        'mort_min_pod_med',
                                        'mort_max_pod_med',
                                    ],
                                    a = n.join(','),
                                    r = a + '\n';
                                t.forEach(function(e) {
                                    n.forEach(function(t, a) {
                                        switch ((a > 0 && a < n.length && (r += ','), t)) {
                                            case 'preferred_name':
                                            case 'casrn':
                                            case 'use_category1':
                                                r += '"' + e[t] + '"';
                                                break;
                                            case 'med_pod_med':
                                            case 'min_pod_med':
                                            case 'max_pod_med':
                                            case 'mort_med_pod_med':
                                            case 'mort_min_pod_med':
                                            case 'mort_max_pod_med':
                                                r +=
                                                    '"' +
                                                    (0, S.printFloat)(1e6 * Math.pow(10, e[t])) +
                                                    '"';
                                                break;
                                            default:
                                                r += 'undefined';
                                        }
                                    }),
                                        (r += '\n');
                                }),
                                    (r = encodeURIComponent(r));
                                var o = 'data:text/csv;charset=utf-8,' + r,
                                    l = document.createElement('a');
                                l.setAttribute('href', o),
                                    l.setAttribute('download', 'csvData.csv'),
                                    l.click();
                            }),
                            (n.state = {
                                metadataLoaded: !1,
                                metadata: null,
                                showHelpText: !1,
                                chemList: S.CHEMLIST_80,
                                chemicalFilterBy: S.CHEMFILTER_CHEMICIAL,
                                chemicals: [],
                                categories: [],
                                assays: [],
                                readouts: [],
                                plotCollapse: S.NO_COLLAPSE,
                                vizHeight: 350,
                                data: null,
                            }),
                            n
                        );
                    }
                    return (
                        l(t, e),
                        u(t, [
                            {
                                key: 'fetchBmdData',
                                value: function(e) {
                                    var t = this;
                                    _.json(e, function(e, n) {
                                        if (e) {
                                            var a = e.target.responseText
                                                .replace('["', '')
                                                .replace('"]', '');
                                            return void t.setState({ data: [], error: a });
                                        }
                                        t.setState({ data: n });
                                    });
                                },
                            },
                            { key: 'loadBmd', value: function() {} },
                            {
                                key: 'updateData',
                                value: function(e, t) {
                                    this.setKeys(e, t);
                                    var n = this.collapseData(e, t),
                                        a = this.getColorScale(n.collapsedData, t);
                                    this.setState(i({}, n, { scale: a }));
                                },
                            },
                            {
                                key: 'setDatasetKey',
                                value: function(e) {
                                    (e.key = e.endpoint_name + '|' + e.protocol_id),
                                        (e.chemicalKey = e.casrn + '|' + e.dtxsid);
                                },
                            },
                            {
                                key: 'componentWillMount',
                                value: function() {
                                    this.fetchBmdData(this.props.url);
                                },
                            },
                            {
                                key: 'componentWillUpdate',
                                value: function(e) {
                                    e.url !== this.props.url && this.fetchBmdData(e.url);
                                },
                            },
                            {
                                key: 'render',
                                value: function() {
                                    var e = this;
                                    if (!this.state.data)
                                        return c.default.createElement(v.default, null);
                                    var t = this.state.data,
                                        n = this.state.data;
                                    return c.default.createElement(
                                        'div',
                                        null,
                                        c.default.createElement(
                                            'h2',
                                            null,
                                            'BMC values: sorted by ',
                                            'activity',
                                            ' ',
                                            '        '
                                        ),
                                        c.default.createElement(M.default, {
                                            data: t,
                                            visualization: this.props.visualization,
                                            selectedAxis: this.props.selectedAxis,
                                        }),
                                        c.default.createElement(
                                            'p',
                                            { class: 'help-block' },
                                            c.default.createElement(
                                                'b',
                                                null,
                                                'Interactivity note:'
                                            ),
                                            ' This barchart is interactive. Click an item to view the concentration-response curves from which the BMC was derived.'
                                        ),
                                        c.default.createElement(
                                            'h2',
                                            null,
                                            'BMC for all chemicals         ',
                                            c.default.createElement(
                                                'button',
                                                {
                                                    onClick: function() {
                                                        return e.data_exportToCSVFile(n);
                                                    },
                                                    class: 'btn btn-primary',
                                                },
                                                'Export data .csv'
                                            ),
                                            '        '
                                        ),
                                        this.props.visualization === S.BMDVIZ_ACTIVITY
                                            ? c.default.createElement(E.default, { data: n })
                                            : c.default.createElement(O.default, { data: n })
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(c.default.Component);
            (T.propTypes = {
                visualization: p.default.number.isRequired,
                selectivityCutoff: p.default.number.isRequired,
                selectedAxis: p.default.number.isRequired,
                url: p.default.string.isRequired,
            }),
                (t.default = T);
        },
        441: function(e, t, n) {
            n(442), (e.exports = n(645));
        },
        442: function(e, t, n) {
            'use strict';
            n(256);
            var a = n(644);
            window.apps = { resizeIframe: a.resizeIframe };
        },
        644: function(e, t, n) {
            'use strict';
            Object.defineProperty(t, '__esModule', { value: !0 }), (t.resizeIframe = void 0);
            var a = n(67),
                r = (function(e) {
                    return e && e.__esModule ? e : { default: e };
                })(a),
                o = function(e) {
                    e.onload = function() {
                        var t = e.contentWindow.document,
                            n = function() {
                                window.setTimeout(function() {
                                    e.height = t.body.clientHeight + 25;
                                }, 250);
                            };
                        (e.height = t.body.clientHeight + 25),
                            (0, r.default)(t.body).on('change', n),
                            (0, r.default)(t.body).on('click', '.nav-tabs', n),
                            (0, r.default)(t.body).on('click', '.treeview', n),
                            setInterval(n, 5e3);
                    };
                };
            t.resizeIframe = o;
        },
        645: function(e, t, n) {
            'use strict';
            n(256), n(646);
            var a = n(1210),
                r = (function(e) {
                    if (e && e.__esModule) return e;
                    var t = {};
                    if (null != e)
                        for (var n in e)
                            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                    return (t.default = e), t;
                })(a);
            window.apps.seazit = r;
        },
        646: function(e, t, n) {
            'use strict';
            (n(77).selection.prototype.moveToFront = function() {
                return this.each(function() {
                    this.parentNode.appendChild(this);
                });
            }),
                (Number.prototype.toCustomString = function() {
                    return this > 1e6
                        ? this.toExponential(2).toUpperCase()
                        : this > 0.001
                        ? this.toLocaleString()
                        : this.toExponential(2).toUpperCase();
                });
        },
        67: function(e, t) {
            e.exports = $;
        },
        72: function(e, t, n) {
            'use strict';
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            }
            function o(e, t) {
                if (!e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
            }
            function l(e, t) {
                if ('function' != typeof t && null !== t)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' + typeof t
                    );
                (e.prototype = Object.create(t && t.prototype, {
                    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
                })),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
            }
            Object.defineProperty(t, '__esModule', { value: !0 });
            var i = (function() {
                    function e(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var a = t[n];
                            (a.enumerable = a.enumerable || !1),
                                (a.configurable = !0),
                                'value' in a && (a.writable = !0),
                                Object.defineProperty(e, a.key, a);
                        }
                    }
                    return function(t, n, a) {
                        return n && e(t.prototype, n), a && e(t, a), t;
                    };
                })(),
                u = n(67),
                s = a(u),
                c = n(9),
                d = a(c),
                f = n(54),
                p = a(f),
                h = (function(e) {
                    function t(e) {
                        r(this, t);
                        var n = o(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                        return (
                            (n.handleSelectChange = n.handleSelectChange.bind(n)),
                            (n.handleSelectMultiChange = n.handleSelectMultiChange.bind(n)),
                            (n.handleRadioChange = n.handleRadioChange.bind(n)),
                            (n.handleIntegerInputChange = n.handleIntegerInputChange.bind(n)),
                            (n.handleFloatInputChange = n.handleFloatInputChange.bind(n)),
                            n
                        );
                    }
                    return (
                        l(t, e),
                        i(t, [
                            {
                                key: 'handleRadioChange',
                                value: function(e) {
                                    var t = {};
                                    (t[e.target.name] = parseInt(e.target.value)),
                                        this.props.stateHolder.setState(t);
                                },
                            },
                            {
                                key: 'handleSelectChange',
                                value: function(e) {
                                    var t = {};
                                    (t[e.target.name] = (0, s.default)(e.target).val()),
                                        this.props.stateHolder.setState(t);
                                },
                            },
                            {
                                key: 'handleSelectMultiChange',
                                value: function(e) {
                                    var t = {};
                                    (t[e.target.name] = (0, s.default)(e.target).val()),
                                        this.props.stateHolder.setState(t);
                                },
                            },
                            {
                                key: 'handleIntegerInputChange',
                                value: function(e) {
                                    var t = {};
                                    (t[e.target.name] = parseInt(e.target.value)),
                                        this.props.stateHolder.setState(t);
                                },
                            },
                            {
                                key: 'handleFloatInputChange',
                                value: function(e) {
                                    var t = {};
                                    (t[e.target.name] = parseFloat(e.target.value)),
                                        this.props.stateHolder.setState(t);
                                },
                            },
                        ]),
                        t
                    );
                })(d.default.Component);
            (h.propTypes = { stateHolder: p.default.instanceOf(d.default.Component).isRequired }),
                (t.default = h);
        },
    },
    [441]
);
//# sourceMappingURL=main.841df1b19956d1340811.js.map
