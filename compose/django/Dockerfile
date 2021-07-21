FROM continuumio/miniconda3:4.4.10

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

#COPY ./conda.env /conda.env
COPY ./env_seazit.yml /env_seazit.yml
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
    #chown django /celery.sh && \
    #chown django /celerybeat.sh && \
    chown django /supervisord.conf && \
    \
    mkdir -p /app/logs
    
#RUN conda env create -f /conda.env  && \
RUN conda env create -f /env_seazit.yml && \
    \
    . /opt/conda/etc/profile.d/conda.sh && \
    conda activate seazit && \
    pip install -U pip && \
    pip install -r /requirements/production.txt

COPY ./project /app/project

# django can't write in volume /app/public
# fix? https://denibertovic.com/posts/handling-permissions-with-docker-volumes/
RUN chown -R django /app
#USER django

WORKDIR /app/project

ENTRYPOINT ["/entrypoint.sh"]
