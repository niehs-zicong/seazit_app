 CEBS summary data browser

## Purpose

The CEBS data browser was a proof of concept application designed to test integration with the CEBS database. It presents summary tables of group-level responses for various organ sites. It was not written for any specific set of users, but was more of an exploratory proof-of-concept for future integrations with CEBS.  However, to my knowledge, there is no comparable view of the data in CEBS, so it may be of value.

## Application details

- Staging: [https://sandbox-staging.ntp.niehs.nih.gov/cebs/](https://sandbox-staging.ntp.niehs.nih.gov/cebs/)
- Production: ✘ (no future plans)

The application uses the Django ORM with the CEBS database; data are passed to the browser via a REST API, simple React models are used to build summary tables and handle form logic.

## Developer instructions

To develop the application, an oracle database driver is required.

```bash
pip install cx-Oracle==6.0.2
```

In addition to the python library, additional setup is required, described in detail in the [cx-Oracle documentation](http://cx-oracle.readthedocs.io/en/latest/installation.html). By default, this application is disabled since it requires login credentials to an external system. To enable, update your local ``settings.py`` file:

```python
DISABLED_APPS_BY_DEFAULT = [
    #'cebs',  # comment this line so it's enabled
]

if 'cebs' in INSTALLED_APPS:
    DATABASES['cebs'].update({
        'NAME': '...',
        'USER': '...',
        'PASSWORD': '...',
        'HOST': '...',
        'PORT': 1521,
    })
```
