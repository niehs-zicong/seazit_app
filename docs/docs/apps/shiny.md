# Shiny application webserver

## Purpose

Many scientists at the institute analysis data using the R language and therefore prefer to develop application using R; a common application framework in the R language is [Shiny](https://shiny.rstudio.com/). The shiny web server is designed to host these applications to enable allowing creation of new applications easily.

## Application details

### Production & Staging:

- **Tox21 activity browser**: [staging](https://sandbox-staging.ntp.niehs.nih.gov/tox21-activity-browser/), [production](https://sandbox.ntp.niehs.nih.gov/tox21-activity-browser/). The Tox21 activity browser is designed to summarize activity and potency of chemicals in Tox21. The application is written by Jui Hua Hsieh and source code are available on [github](https://github.com/moggces/ActivityProfilingGUI). The data files are flat files; there are no external dependencies.
- **Tox21 curve visualization**: [staging](https://sandbox-staging.ntp.niehs.nih.gov/tox21-curve-visualization/), [production](https://sandbox.ntp.niehs.nih.gov/tox21-curve-visualization/). The Tox21 curve browser is designed to explore dose-response curves for Tox21 experiments. The application is written by Jui Hua Hsieh and source code are available on [github](https://github.com/moggces/CurveVisualizationGUI4Tox21). The data files are flat files; there are no external dependencies.
- **[Neurotox workshop](/apps/neurotox/) QC tab**: [staging](https://sandbox-staging.ntp.niehs.nih.gov/neurotox/quality-control/), [production](https://sandbox.ntp.niehs.nih.gov/neurotox/quality-control/) (*authorization required*). The QC tab for the neurotox workshop was written using R-shiny by Jui Hua Hsieh; it presents plate-level and assay-level quality-control details on normalized response and variance in assay control response. The data used in the application are queried from the neurotox application written in Django and stored in PostgreSQL.

### Staging-only:

Applications may currently be under development or may be deployed for internal use only.

- **384-well plate viewer**: [staging](https://sandbox-staging.ntp.niehs.nih.gov/plate-viewer/). Written by Trey Saddler, source code available on [github](https://github.com/tosaddler/plate-viewer). Visualize a 384-well platemap using a heatmap. No external dependencies.
- **NIEHS alumni career outcomes**: [staging](https://sandbox-staging.ntp.niehs.nih.gov/alumni-career-outcome/). Written by Hong Xu, managed by Tammy Collins, source code available on [github](https://github.com/nihxuh/alumni-shiny). Interactive application of NIEHS career outcomes, paper originally published in [Nature Biotechnology](https://doi.org/10.1038/nbt.4059). The application will be embedded into an iframe on the main NIEHS site, since this is not an NTP product. No external dependencies; data are in flat-file format.
- **PFC React report**: [staging](https://sandbox-staging.ntp.niehs.nih.gov/pfc-react/). Proof of concept for a report for NTP labs to determine how to pick which assays and similar chemicals should be used for experimental development. Originally developed by Jui Hua Hsieh.

Applications are deployed with [R shiny server](https://www.rstudio.com/products/shiny/shiny-server/), which is reverse proxied behind the nginx server. Applications are bundled into a tar.gz file using the [packrat](https://rstudio.github.io/packrat/).


## Developer instructions

Shiny-applications are created with no header/footer styles or custom styles applied; the header and footer and the main URL page is hosted by the NTP sandbox django application, and the Shiny application is embedded as a iFrame in the django application. This makes the shiny applications more portable, as well as limiting the number of applications which must be updated when NTP styles change.

One technical limitation is making sure the iFrame is resized to the full size, rather than being a fixed size; a jQuery script exists in Django which attempts to resize the iFrame whenever it changes, but it is fragile and may need updating.

### Deploying applications

Originally, dependencies were saved in packrat bundles and then these bundles were installed during the Docker compiling. However, this led to extremely large compiling time which and unpredictable failures, which was problematic to troubleshoot. Therefore, packrat containers are stored in a persistent volume, which can be reloaded with images being rebuilt. It is unclear if this is a viable long-term solution; there are issues with symlinks to R outside the volume breaking.

To deploy apps, generally you'll do the following:

1. Move packrat package into running shiny container
2. In the shiny container, unpack `R -e "packrat::unbundle('/bundle.zip', '/srv/shiny-apps')"`
3. This generally fails; so manually install packages which aren't restored
4. Build a django template view with an iframe for shiny app ([example](https://gitlab.niehs.nih.gov/shapiroaj4/sandbox/commit/242a82088022827e767eec63f5f9c202c46c127e))

Please save all manually changes in the [deploy-sandbox/scripts/shiny](https://gitlab.niehs.nih.gov/pob/deploy-sandbox/blob/master/scripts/shiny.sh) for future tracking.

### Allowing cross-origin iFrame access (dev only)

During development, you may wish to modify an iFrame being served from another origin; this may not be an issue in a production environment. To allow for cross-origin iFrame access, start Google Chrome with [web security disabled](http://stackoverflow.com/questions/3102819/):

```bash
open -a "Google Chrome" --args --disable-web-security --user-data-dir
```
