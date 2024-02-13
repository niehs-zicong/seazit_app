from main.settings.staging import *  # noqa

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
DATABASES['default']['NAME'] = DB_NAME

#DATABASES['default']['HOST'] = os.environ['DB_HOST']
#DATABASES['default']['USER'] = os.environ['POSTGRES_USER']
#DATABASES['default']['PASSWORD'] = os.environ['POSTGRES_PASSWORD']


STAGING_ONLY_APPS = (
 #   'cebs',
#    'fiveday',
#    'tox21'
)

INSTALLED_APPS = [
    app for app in INSTALLED_APPS
    if app not in STAGING_ONLY_APPS
]

 
EMAIL_SUBJECT_PREFIX = '[seazit-sandbox] '
DEFAULT_FROM_EMAIL = 'webmaster@sandbox-production.com'

PUBLIC_ROOT = os.environ.get('DJANGO_PUBLIC_PATH')
#STATIC_ROOT = os.path.join(PUBLIC_ROOT, 'static')
STATIC_ROOT = os.path.join(PUBLIC_ROOT, 'static_seazit')
MEDIA_ROOT = os.path.join(PUBLIC_ROOT, 'media')


LOGGING['handlers']['file'].update(
    level="INFO",
    filename=os.environ.get('DJANGO_LOG_FULLPATH')
)

ENVIRONMENT_NAME = 'Sandbox'
ENVIRONMENT_COLOR = '#A40000'
