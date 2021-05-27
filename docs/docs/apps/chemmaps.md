# ChemMaps

## Purpose

Designed to interact with chemicals in 3d-space. Two separate spaces currently
exist - drugs (DrugMap) and environmental chemicals (EnvMap).

## Application details

- Staging: [https://sandbox-staging.ntp.niehs.nih.gov/chemmaps/](https://sandbox-staging.ntp.niehs.nih.gov/chemmaps/)
- Production: ✘ (coming soon)

The ChemMaps application is a static html application. Input data on HTML are precomputed in R and and Python, data are loaded into the browser and rendered using Javascript libraries.

## Developer instructions

### Loading PNG data

Each molecule has a static, pre-generated PNG file on the server. Approximately
500k files exist; therefore these are not saved in the git source control.

PNG data are available here:

    smb://ntp-nas.niehs.nih.gov/ntp-tools-dev/sandbox/chemmaps/chemmaps.tar.gz

Decompress, and copy the PNG data:

    mv ~/Desktop/website/drugsPNG/ ./project/chemmaps/static/chemmaps/png/
    mv ~/Desktop/website/envPNG/ ./project/chemmaps/static/chemmaps/png/
