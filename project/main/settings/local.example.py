from main.settings.dev import *  # noqa

# reduce cache timeout
TIMEOUT = 1
REST_FRAMEWORK_EXTENSIONS['DEFAULT_CACHE_RESPONSE_TIMEOUT'] = TIMEOUT

# run all celery tasks in main thread
CELERY_TASK_ALWAYS_EAGER = True

# # use database in docker container
# DATABASES['default'].update({
#     'NAME': 'sandbox',
#     'USER': 'sandbox',
#     'PASSWORD': 'my_dev_password',
#     'HOST': 'localhost',
#     'PORT': 5432,
# })

# DATABASES['default'].update({
#     'ENGINE': 'django.db.backends.postgresql_psycopg2',
#     'NAME': 'dev_seazit',
#     'OPTIONS': {
#         'options': '-c search_path=schema_seazit'
#     },
#     'USER': 'ntp_group',
#     'PASSWORD': 'ntp_group',
#     'HOST': '10.98.105.92',
#     'PORT': 5432,
# })


DATABASES['default'].update({
    'ENGINE': 'django.db.backends.postgresql_psycopg2',
    'NAME': 'dev_seazit',
    'OPTIONS': {
        'options': '-c search_path=schema_seazit'
    },
    'USER': 'dtt_user',
    'PASSWORD': 'dtt_user123!',
    'HOST': 'ehsdtt031535.niehs.nih.gov',
    'PORT': 5432,
})


# remove apps which require external configuration by default
#DISABLED_APPS_BY_DEFAULT = [
#    'cebs',
#]
#INSTALLED_APPS = [
#    app for app in
#    INSTALLED_APPS if app not in DISABLED_APPS_BY_DEFAULT
#]

#if 'cebs' in INSTALLED_APPS:
 #   DATABASES['cebs'].update({
  #      'NAME': '...',
  #  })
#else:
 #   del DATABASES['cebs']
