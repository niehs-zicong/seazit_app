# *in-vitro* to *in-vivo* Extrapolation (IVIVE)

## Purpose

This application is a companion to [Sipes et al. 2017](https://doi.org/10.1021/acs.est.7b00650), *An Intuitive Approach for Predicting Potential Human Health Risk with the Tox21 10k Library*. *In-vivo* doses were estimated from *in-vitro* points of departure and were compared to estimates from ExpoCast for relevant human doses.

Historically, this was one of the first applications on the NTP sandbox and was used a as a proof of concept for a shared Django project hosting multiple applications. The application is not designed to be updated with new data or approaches. It's also read-only; the approaches for the estimation are not written for use on new chemicals/assays.

## Application details

- Staging: [https://sandbox-staging.ntp.niehs.nih.gov/ivive/](https://sandbox-staging.ntp.niehs.nih.gov/ivive/)
- Production: [https://sandbox.ntp.niehs.nih.gov/ivive/](https://sandbox.ntp.niehs.nih.gov/ivive/)

The IVIVE application is a django application with data stored in a postgreSQL database. It creates custom visualizations on the client-side using javascript. It utilized the redis cache for storing recent responses.

## Developer instructions

### Loading data

Filenames are specified in `main/settings.base.py`:

```python
IVIVE_DATASET = 'HTTKupdated_Cmax_MAX_AC50_ratio_identifyinout_clean2017APR21.csv'
IVIVE_DESCRIPTION_DATASET = 'Nov72016_assaynames_toAndy.xlsx'
```

Copy data files from here:

    smb://ntp-nas.niehs.nih.gov/ntp-tools-dev/sandbox/ivive

To here:

    ./sandbox/data/ivive

Run the django command in the sandbox virtual environment:

```bash
cd ./sandbox/project
python manage.py import_ivive
```
