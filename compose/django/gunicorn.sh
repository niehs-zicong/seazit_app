#!/bin/sh

/opt/conda/envs/SEAZIT/bin/python /app/project/manage.py migrate
/opt/conda/envs/SEAZIT/bin/python /app/project/manage.py clear_cache
/opt/conda/envs/SEAZIT/bin/python /app/project/manage.py collectstatic --noinput

/opt/conda/envs/SEAZIT/bin/gunicorn main.wsgi \
     --workers 8 \
     --bind 0.0.0.0:5000 \
     --chdir /app/project
