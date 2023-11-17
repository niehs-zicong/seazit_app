import React from 'react';

import FiveOhEight from '../components/FiveOhEight';
import HelpButtonWidget from '../widgets/HelpButtonWidget';

class DatasetsMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // HelpButtonWidget
            showHelpText: false,
        };
    }

    _renderHelpText() {
        if (!this.state.showHelpText) {
            return null;
        }
        return (
            <div className="alert alert-info">
                <p>
                    This page allows for the visualization of DMSO response variability for each
                    endpoint in each dataset. This information was used by the NTP to assign a
                    benchmark threshold (BMR) for in vitro and alternative animal model endpoints.
                    When needed, the responses on each plate were normalized using the vehicle
                    control responses on each plate (either median or mean response on a plate) and
                    were shifted so that baseline response was 0. Therefore, response &gt; 0 (&lt;0)
                    means response increased (decreased) after chemical exposure compared with
                    responses in the vehicle control wells.
                </p>

                <p>
                    <b>BMRs:</b>
                </p>
                <p style={{ paddingLeft: '1em' }}>
                    We used three methods for deriving BMRs: a) 3 standard deviations (SD) of
                    normalized responses in all the vehicle control wells across plates (
                    <a href="https://doi.org/10.1016/j.neuro.2016.02.003">Ryan et al. 2016</a>), b)
                    intrinsic response variation across chemicals by bootstrap (
                    <a href="https://doi.org/10.1093/toxsci/kfy258"> Hsieh et al., 2018</a>), c)
                    intrinsic response variation across chemicals by linear-fit with vehicle control
                    responses as random noise. In general, a) and c) approaches were used for the in
                    vitro data and b) approach was used for the alternative animal models.
                </p>

                <p>
                    Data can be visualized in 2 ways: by endpoint and by plate. Filters on the left
                    allow for selection of datasets and endpoints. This page also allows for the
                    visualization of concentration response curves of technical duplicate chemicals
                    found on NTP plates: deltamethrin, methyl mercuric (II) chloride, saccharin
                    sodium salt hydrate, and triphenyl phosphate.
                </p>

                <p>
                    When the <b>“by endpoint”</b> tab is selected for a given dataset and
                    endpoint(s):
                </p>
                <p style={{ paddingLeft: '1em' }}>
                    A table (top) provides information about the DMSO (vehicle) control data
                    including if the outlier test was used to remove outliers in DMSO data (column:
                    outlier test used), the mean and SD (columns: mean & SD), the number of outliers
                    if the outlier test is applied (column: n outliers), total number of DMSO data
                    points (column: n), the BMR for each endpoint (column: BMR), direction of and
                    the method used for deriving BMR (column: direction & BMR method). If the BMR is
                    blank, it means a reliable BMR cannot be found based on the available methods.
                    The distribution of the DMSO responses (below) is also shown for each endpoint
                    selected. Each black dot represents the normalized response of DMSO in each well
                    of all the plates. When not removing outlier responses in DMSO (by unchecking
                    checkbox at the bottom of left side of screen), outliers will be labeled as a
                    black cross and the SD will increase accordingly.
                    <br />
                    Note: Outliers are defined as data points with responses either larger than
                    3*interquartile range (IQR) or smaller than 3*IQR. IQR is calculated using all
                    the DMSO data points per endpoint. As a rule, if over 5% of the DMSO data points
                    were considered outliers, an outlier test was not applied if using 3SD approach
                    for generating the BMR.
                </p>

                <p>
                    When the <b>“by plate”</b> tab is selected for a given dataset and endpoint(s):
                </p>
                <p style={{ paddingLeft: '1em' }}>
                    A table (top) provides information specific to each plate-endpoint pair,
                    including plate name (column: plate), mean, SD (columns: mean & SD), the number
                    of outliers if the outlier test is applied (column: n outliers), total number of
                    DMSO data points (column: n). To view a specific plate- endpoint pair, select
                    the appropriate row in the table; the relevant end-points are highlighted in red
                    in the distribution chart (below). Switch to the ‘descriptive statistics’ tab
                    for general plate information of the selected plate, including the number of
                    chemicals used on this plate (column: nchemical), number of concentrations used
                    on this plate (column: nconc), concentration range (min, max, first quartile Q1,
                    third quartile Q3), and availability of the vehicle control. Switch to the
                    ‘plate map’ tab for more detailed experimental design of the selected plate.
                    Hover over the heatmap for row, column, well information (i.e., a chemical & its
                    concentration used). The heatmap is colored by well response that are either raw
                    or normalized and can be toggled with radio button on the left side of the
                    panel. When investigating a plate that is associated with mortality/development
                    endpoints, underlying intermediate endpoints (incidences) can be reviewed when
                    raw readout type is selected. A blank cell means there is no recorded response
                    possibly due to technical issues or mortality.
                </p>

                <p>
                    When the <b>“curves of duplicates”</b> tab is selected:
                </p>
                <p style={{ paddingLeft: '1em' }}>
                    The chemical specific response (y-axis, normalized response) data points are
                    plotted (red = duplicate 1; blue = duplicate 2) for each concentration tested
                    (x-axis; log 10 (molar concentration)). The numerical value next to each dot
                    represents the number of replicates (e.g., number of animals per concentration).
                    For some datasets (UCSanDiego, UKonstanz, USEPA), only duplicate 1 is plotted
                    since duplicate 2 was not included in the original shipping plate.
                </p>

                <p>
                    <i>
                        Options for editing or saving images are provided by toggling over the upper
                        right side of each image. If the edit/save toolbar is not available, it was
                        a custom visualization created specifically for this application. Please
                        take a screenshot to save, or if you need a higher resolution image, please
                        contact us.
                    </i>
                </p>
            </div>
        );
    }

    render() {
        return (
            <div className="row-fluid">
                <div className="col-md-12">
                    <h1>
                        Datasets
                        <HelpButtonWidget stateHolder={this} headLevel={'h1'} />
                    </h1>
                    {this._renderHelpText()}
                </div>
                <div className="col-md-12">
                    <FiveOhEight />
                </div>
            </div>
        );
    }
}

export default DatasetsMain;
