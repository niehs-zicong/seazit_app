# 2017 neurotoxicity and development assay development workshop

## Purpose

Over the past 5 years the NTP, through collaborations, has evaluated a set of medium throughput, high content, cell based assays and alternate animal models that capture critical neurodevelopmental processes, such as neuronal proliferation, differentiation/migration, functional network formation, cognitive behavior, and motor activity. The aim of this collaborative effort is to develop a test battery to evaluate the developmental neurotoxicity (DNT) potential of chemicals. As a culmination of the above efforts, the NTP held a closed workshop on Integrated Testing Strategies for Developmental Neurotoxicity from September 26-28, 2017, to promote and facilitate discussion and collaboration between workshop participants. This website, summarized the NTP analysis of the data provided by workshop collaborators.

## Application details

- Staging: [https://sandbox-staging.ntp.niehs.nih.gov/neurotox/](https://sandbox-staging.ntp.niehs.nih.gov/neurotox/)
- Production:  [https://sandbox.ntp.niehs.nih.gov/neurotox/](https://sandbox.ntp.niehs.nih.gov/neurotox/)

**Authentication is required to submit view, but will be removed once publication is released (ETA Fall 2018).**

The application is primarily written as a django application with data passed to the client via a RESTful API using Django Rest Framework. Data are stored in PostgreSQL, and will be immutable once the final import is complete. Data ETL transformations were applied using a series of [jupyter notebooks](https://gitlab.niehs.nih.gov/ods/sandbox/tree/master/project/neurotox/notebooks), stored within the repository.

In addition, a shiny application also exists which was includes other functionality and visualizations for data exploration. It is embedded as an iframe into the rest of the application.

The REST framework caches responses using Redis.


## Developer instructions

Data for the neurotox application are stored in PostgreSQL. Data can be loaded in one of two ways:

- Imported from a database dump
- Saved in the database via  ETL + analysis pipeline

Instructions for both imports described below..

### Loading final results

Data can be loaded from SQL dumps:

    smb://ntp-nas.niehs.nih.gov/ntp-tools-dev/sandbox/neurotox/2017-11-30-db.tar.gz

Which are loaded with the command:

```bash
pg_restore \
    --dbname=sandbox \
    --clean \
    --exit-on-error \
    --disable-triggers \
    --no-owner \
    ~/Desktop/neurotox.tar.gz
```

Some developers have had issues with the SQL restore. Therefore, you can use this django JSON restore (this is much slower; can take ~30 min), but seems to be more reliable:

    smb://ntp-nas.niehs.nih.gov/ntp-tools-dev/sandbox/neurotox/2018-12-03-djangodump.json

Load with command:

    python manage.py loaddata ~/Desktop/2017-11-30-djangodump.json


### Running the ETL and analysis pipeline

To transform raw data and load into the database, place neurotox workshop raw data this location:

    ~/dev/sandbox/data/neurotox-workshop/

An archive of the latest data is available here:

    smb://ntp-nas.niehs.nih.gov/ntp-tools-dev/sandbox/neurotox/2018-12-03-etl.zip

The data are transformed via a data pipeline consisting of a series of jupyter notebooks. In addition to ETL, dose-response analysis is also conducted using R-based scripts. Previously the rpy2 library was used to move data back and forth between python and R, however recently (2018-April) upon trying to re-run the pipeline with more recent Python/R the interface was fragile. Therefore, the pipeline is more manual than previous; if rpy2 becomes more stable in the future it could be revisited.

This requires that the [shiny_neurotox](https://gitlab.niehs.nih.gov/pob/shiny_neurotox) be installed, and specifically in this location on your computer ``~/dev/shiny_neurotox``. R Dependencies must be installed, tested using R version 3.3.3. Dependencies were previously installed using [packrat](https://rstudio.github.io/packrat/), R's virtual environment, but again (2018-April) this was found to be fragile, so they're installed directly below:

```bash
cd ~/dev/shiny_neurotox
R -e "install.packages(c('xml2', 'ggplot2', 'httr', 'jsonlite', 'purrrlyr', 'readxl', 'stringr', 'tcpl', 'tidyverse'), repos='http://cran.rstudio.com/')"
```

To run, you'll need to have the django server running locally on port 8001. You'll need to attach a REST API token to a user who has been added to the ``neurotox`` group in django. The AUTH token is hard-coded in the scripts and must equal "38df1df91f3f1a9ac3dbf608053e9a3c1db06e4b". To do this:

1. In the django admin, create a group "neurotox"
2. In the django admin, add the "neurotox" group to your user account
3. In the django admin, create an Auth Token for your user
4. In the django shell, update the token value:

```python
from rest_framework.authtoken.models import Token
Token.objects\
    .filter(key="268a8fa412e925dcff28648a32fe039e6e180814")\
    .update(key="38df1df91f3f1a9ac3dbf608053e9a3c1db06e4b")
```

After setting up the environment, run the pipeline command:

```bash
python manage.py 8001  # in one terminal
python manage.py neurotox_pipeline  # in another terminal
```

To create a database dump:

```bash
pg_dump sandbox \
    --clean --format=custom --no-owner \
    -t neurotox_assay \
    -t neurotox_category \
    -t neurotox_chemical \
    -t neurotox_hill \
    -t neurotox_curvep \
    -t neurotox_plate \
    -t neurotox_readout \
    -t neurotox_substance \
    -t neurotox_well \
    -t neurotox_wellresponse > ~/Desktop/neurotox.tar.gz
```

To create a django JSON dump:

```
cd ./sandbox/project
python manage.py dumpdata neurotox -o ~/Desktop/2017-11-30-djangodump.json
```
