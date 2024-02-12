from main.settings.base import *  # noqa

DEBUG = True
INTERNAL_IPS = ('10.98.105.92', )

INSTALLED_APPS += (
    'debug_toolbar',
    'django_extensions',
)

MIDDLEWARE += (
    'debug_toolbar.middleware.DebugToolbarMiddleware',
)

EMAIL_BACKEND = 'django.core.mail.backends.//console.EmailBackend'

RSERVE_HOST = '10.98.105.92'

ENVIRONMENT_NAME = 'Development'
ENVIRONMENT_COLOR = '#707070'
