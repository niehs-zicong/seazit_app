# 5-day toxicogenomic automated reports

## Purpose

The purpose of this application was to attempt to semi-automate Microsoft Word report generation of five-day experiments which include a toxicogenomic dose-response as well as basic standard toxicology endpoint capture (organ weight, hematology, clinical chemistry, etc.).

It allows a user to specify output templates (in html and Word) and then given a new set of input data, create reports in the desired format. It currently process BMDExpress input and output files, as well as PDF tables from CEBS reports.

## Application details

- Staging: [https://sandbox-staging.ntp.niehs.nih.gov/fiveday/](https://sandbox-staging.ntp.niehs.nih.gov/fiveday/)
- Production: ✘ (internal-only)

**Authentication is required create reports, but not view reports.**

The application is a standard Django application which stores input files on the filesystem. It uses Redis for caching.

## Developer details

The fiveday application was originally written with a grand vision to be a prototype for semi-automated report generation for tox data and toxicogenomic data. The first application was the Aromatic Phosphates, and Triphenyl Phosphate (TPP), as the first of the six test chemicals. Lots of differnet paths were explored in the codebase, and I think there are some dead ends. It should be considered a prototypical application.

The PDF, HTML, and zip file exports are no longer required; would recommend removing these features to simplify code. The docx export is the important one; it uses a custom NTP template designed that can export to Pubmed XML, docx (for final pdf reports), and a custom NTP webpage design.

It should be fine (with some additional instructions below) for the aromatic phosphates; however if the application is to be used more in the future, it may be best to refactor to a standalone repository, and a command-line tool instead of a web-application.

### To build aromatic phosphates

Data are available here:

    smb://ntp-nas.niehs.nih.gov/ntp-tools-dev/fiveday/aromatic-phosphates.zip

On the admin page, create report template for the aromatic phosphate reports, using the information specified in the (unzipped) template folder.

Then, outside of the admin on the main page, create a new report, one for each chemical. You'll need to add 5 files for toxicogenomics, and 5 files for tox reports. You will not add a BMD file. After saving, the html page should successfully run. You can download the word report, but this will not include the BMD results for the tox data.

To run the BMD models requires a little more work. First, some backstory. The tox data has doses in a different dose-unit (mmol) than the toxicogenomic data (mg/kg). We want to use the mg/kg doses instead. Therefore, you'll need to run the `./notebooks/fiveday-ap-bmd.ipynb`, for each chemical. After doing this, you'll have BMD files in the correct format. You can then download the docx will the BMD results.

Finally, one additional BMD summary table was created but never added to the report template; to build this table, one for each chemical, run the `./notebooks/fiveday-bmd-summary.ipynb` notebook. You can send via email and report writers can add the data.

One final caveat, the pipeline currently works with TPP, and works with a few other chemicals. However, with a few chemicals, endpoints were not measured in all dose groups. Thus, there may be 5 doses, but only 3 groups had a measured response for some endpoints. This will need to be fixed. You need >= 3 dose groups to run BMD modeling.
