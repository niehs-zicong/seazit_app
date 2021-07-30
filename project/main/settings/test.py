import os

from main.settings.base import *  # noqa


DEBUG = False

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split('|')

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_USE_SESSIONS = True

#set up database infor:
DB_SERVER = os.environ['POSTGRES_SERVER_IP']
DB_PORT   = os.environ['PORT']
DB_NAME   = os.environ['POSTGRES_DBNAME']
DB_USER   = os.environ['POSTGRES_USER']
DB_PW     = os.environ['POSTGRES_PASSWORD']

DATABASES['default']['HOST'] = DB_SERVER
DATABASES['default']['USER'] = DB_USER
DATABASES['default']['PASSWORD'] = DB_PW
DATABASES['default']['PORT'] = DB_PORT

#DATABASES['default']['HOST'] = os.environ['POSTGRES_SERVER_IP']
#DATABASES['default']['USER'] = os.environ['POSTGRES_USER']
#DATABASES['default']['PASSWORD'] = os.environ['POSTGRES_PASSWORD']
#DATABASES['default']['PORT']=os.environ['PORT']
  
CACHES['default'] = {
    'BACKEND': 'django_redis.cache.RedisCache',
    'LOCATION': os.environ['REDIS_CONNECTION_STRING'],
    'OPTIONS': {
        'CLIENT_CLASS': 'django_redis.client.DefaultClient'
    }
}
TIMEOUT = 60 * 60 * 24 * 7  # cache for one week

EMAIL_HOST = os.environ.get('DJANGO_EMAIL_HOST')
EMAIL_HOST_USER = os.environ.get('DJANGO_EMAIL_USER', None)
EMAIL_HOST_PASSWORD = os.environ.get('DJANGO_EMAIL_PASSWORD', None)
EMAIL_PORT = int(os.environ.get('DJANGO_EMAIL_PORT'))
EMAIL_USE_SSL = bool(os.environ.get('DJANGO_EMAIL_USE_SSL') == 'True')
DEFAULT_FROM_EMAIL = os.environ.get('DJANGO_DEFAULT_FROM_EMAIL')

EMAIL_SUBJECT_PREFIX = '[seazit-test] '
DEFAULT_FROM_EMAIL = 'webmaster@sandbox-staging.com'

PUBLIC_ROOT = os.environ.get('DJANGO_PUBLIC_PATH')
STATIC_ROOT = os.path.join(PUBLIC_ROOT, 'static')
MEDIA_ROOT = os.path.join(PUBLIC_ROOT, 'media')

LOGGING['handlers']['file'].update(
    level="INFO",
    filename=os.environ.get('DJANGO_LOG_FULLPATH')
)

ENVIRONMENT_NAME = 'test'
ENVIRONMENT_COLOR = '#EE8416'
