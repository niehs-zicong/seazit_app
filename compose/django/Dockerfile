FROM continuumio/miniconda3:24.11.1-0

# Install wkhtmltopdf for python pdfkit library
# Install libaio1; required for oracle client
# Install libpq-dev; required for postgres client
# Install supervisord; required to run daemons
RUN apt-get update && \
    apt-get install -y \
        zip unzip wget \
        wkhtmltopdf libaio1 \
        libpq-dev supervisor && \
    apt-get clean

# Requirements have to be pulled and installed here, otherwise caching won't work
COPY ./compose/django/entrypoint.sh /entrypoint.sh
COPY ./compose/django/gunicorn.sh /gunicorn.sh
COPY ./compose/django/cull_backups.py /cull_backups.py
COPY ./compose/django/supervisord.conf /supervisord.conf

COPY ./conda.yml /conda.yml
COPY ./requirements /requirements

# 1) install start-scripts
# 2) create logs path
RUN \
    groupadd -r django && \
    useradd -r -g django django && \
    chmod +x /entrypoint.sh && \
    chmod +x /gunicorn.sh && \
    chown django /entrypoint.sh && \
    chown django /gunicorn.sh && \
    chown django /supervisord.conf && \
    mkdir -p /app/logs

# Ensure base environment has the correct certifi version
RUN conda install -n base certifi=2024.07.04 -y

# Create conda environment
RUN conda env create -f /conda.yml

# Force clean reinstall of DRF and drf-yasg to ensure correct compat.py on disk
RUN rm -rf /opt/conda/envs/seazit/lib/python3.8/site-packages/rest_framework* \
           /opt/conda/envs/seazit/lib/python3.8/site-packages/drf_yasg* && \
    /opt/conda/envs/seazit/bin/python -m pip install --no-cache-dir --upgrade pip setuptools wheel && \
    /opt/conda/envs/seazit/bin/python -m pip install --no-cache-dir -r /requirements/production.txt

RUN conda env list
RUN conda run -n seazit python --version

# Fix rest_framework compat.py - remove six dependency (removed in Django 3.0+)
RUN sed -i \
    -e '/from django.utils import six/d' \
    -e 's/six\.PY2/False/g' \
    -e 's/six\.PY3/True/g' \
    -e 's/six\.binary_type/bytes/g' \
    -e 's/six\.string_types/str/g' \
    /opt/conda/envs/seazit/lib/python3.8/site-packages/rest_framework/compat.py

# Fix django.log permission
RUN touch /app/django.log && chmod 777 /app/django.log

# Fix static files permissions
RUN mkdir -p /app/public/static_seazit && chmod -R 777 /app/public/

COPY ./project /app/project

RUN chown -R django /app

WORKDIR /app/project

ENTRYPOINT ["/entrypoint.sh"]