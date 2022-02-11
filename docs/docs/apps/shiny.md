# Shiny application webserver

## Purpose

Many scientists at the institute analysis data using the R language and therefore prefer to develop application using R; a common application framework in the R language is [Shiny](https://shiny.rstudio.com/). The shiny web server is designed to host these applications to enable allowing creation of new applications easily.

## Application details

### Production & Staging:

 
- **[SEAZIT workshop](/apps/neurotox/) QC tab**: [staging](https://10.98.105.65:444/seazit/quality-control/), [production](https://sandbox.ntp.niehs.nih.gov/seazit/quality-control/) (*authorization required*). The QC tab for the seazit workshop was written using R-shiny by Jui Hua Hsieh; it presents plate-level and assay-level quality-control details on normalized response and variance in assay control response. The data used in the application are queried from the seazit application written in Django and stored in PostgreSQL.

- **[SEAZIT workshop](/apps/neurotox/) Dataset tab**: [staging](https://10.98.105.65:444/seazit/dataset/), [production](https://sandbox.ntp.niehs.nih.gov/seazit/dataset/) (*authorization required*). The Dataset tab for the seazit workshop was written using R-shiny by Jui Hua Hsieh; it presents the raw data from varys labs for the study. The data used in the application are queried from the seazit application written in Django and stored in PostgreSQL.

 
## Developer instructions

Shiny-applications are created with no header/footer styles or custom styles applied; the header and footer and the main URL page is hosted by the NTP sandbox django application, and the Shiny application is embedded as a iFrame in the django application. This makes the shiny applications more portable, as well as limiting the number of applications which must be updated when NTP styles change.

One technical limitation is making sure the iFrame is resized to the full size, rather than being a fixed size; a jQuery script exists in Django which attempts to resize the iFrame whenever it changes, but it is fragile and may need updating.

 

### Allowing cross-origin iFrame access (dev only)

During development, you may wish to modify an iFrame being served from another origin; this may not be an issue in a production environment. To allow for cross-origin iFrame access, start Google Chrome with [web security disabled](http://stackoverflow.com/questions/3102819/):

```bash
open -a "Google Chrome" --args --disable-web-security --user-data-dir
```
