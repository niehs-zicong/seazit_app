from main.settings.dev import *  # noqa

# reduce cache timeout
TIMEOUT = 1
REST_FRAMEWORK_EXTENSIONS['DEFAULT_CACHE_RESPONSE_TIMEOUT'] = TIMEOUT

# run all celery tasks in main thread
CELERY_TASK_ALWAYS_EAGER = True

# use database in docker container
DATABASES['default'].update({
    'ENGINE': 'django.db.backends.postgresql_psycopg2',
    'NAME': 'dev_seazit',
    'OPTIONS': {
        'options': '-c search_path=schema_seazit'
    },
    'USER': 'dtt_user',
    'PASSWORD': 'xxx',
    'HOST': 'ehsdtt031535.niehs.nih.gov',
    'PORT': 5432,
})

print (DATABASES['default'])