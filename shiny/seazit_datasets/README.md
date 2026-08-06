# seazit_datasets — Datasets Shiny app

Source code for the **Datasets** tab of the SEAZIT web application.

- **Live URL:** https://rstudio.niehs.nih.gov/seazit_dataset/
- **Embedded via iframe in:** `project/seazit/templates/seazit/dataset.html`

## Status

This folder is a placeholder. The Shiny source code currently lives in a
separate NIEHS RStudio Connect deployment. Migration into this repository
is planned but has not yet begun.

## Related files in this repository

- `project/seazit/templates/seazit/dataset.html` — Django template that embeds the iframe
- `project/seazit/assets/seazit/containers/DatasetsMain.js` — React container for the Datasets tab
- `compose/shiny/` — Shiny server Docker configuration (deploy infrastructure)

## Future work

Once the R/Shiny source code is imported here, this folder will contain
a self-contained Shiny application ready to be bundled and deployed via
the `shiny_bundle` Fabric task in the `deploy-seazit` repository.
