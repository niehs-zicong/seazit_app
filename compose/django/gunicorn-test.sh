#!/bin/sh

# build static documentation
mkdir -p /app/public/docs
pushd docs && \
    /opt/conda/envs/seazit/bin/mkdocs build -d /app/public/docs && \
    popd

/opt/conda/envs/seazit/bin/python /app/project/manage.py migrate
/opt/conda/envs/seazit/bin/python /app/project/manage.py clear_cache
/opt/conda/envs/seazit/bin/python /app/project/manage.py collectstatic --noinput

/opt/conda/envs/seazit/bin/gunicorn main.wsgi \
     --workers 8 \
     --bind 0.0.0.0:5000 \
     --chdir /app/project
