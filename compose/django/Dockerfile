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
    #chown django /celery.sh && \
    #chown django /celerybeat.sh && \
    chown django /supervisord.conf && \
    \
    mkdir -p /app/logs


#RUN conda env create -f /conda.env && \
#    \
#    . /opt/conda/etc/profile.d/conda.sh && \
#    conda activate seazit && \
#    pip install -U pip && \
#    pip install -r /requirements/production.txt
#CONDA:

# Ensure base environment has the correct certifi version
RUN conda install -n base certifi=2024.07.04 -y
#conda env seazit :
#RUN conda env create -f /conda.yml  && \
#    \
#    . /opt/conda/etc/profile.d/conda.sh && \
#    conda activate seazit && \
#    pip install -U pip && \
#    pip install -r /requirements/production.txt

# Ensure base environment has the correct certifi version

RUN conda env create -f /conda.yml

RUN conda env list

RUN conda run -n seazit python --version

RUN conda run -n seazit pip install -U pip

# Clean stale packages before installing requirements
RUN rm -rf /opt/conda/envs/seazit/lib/python3.8/site-packages/rest_framework* \
           /opt/conda/envs/seazit/lib/python3.8/site-packages/drf_yasg* \
           /opt/conda/envs/seazit/lib/python3.8/site-packages/selectable*

RUN conda run -n seazit pip install --no-cache-dir --force-reinstall -r /requirements/production.txt

# Download, compile, and install curl 8.9.1
#for security scan django don't use curl
#RUN curl -LO https://curl.se/download/curl-8.9.1.tar.gz && \
#RUN wget https://curl.se/download/curl-8.9.1.tar.gz && \
#    tar -xzf curl-8.9.1.tar.gz && \
#    cd curl-8.9.1 && \
#    ./configure --with-ssl && \
#    make && \
#    make install && \
#    cd .. && \
#    rm -rf curl-8.9.1 curl-8.9.1.tar.gz

#to:
#from django.urls import reverse, NoReverseMatch
RUN sed -e 's/core.urlresolvers/urls/g' /opt/conda/envs/seazit/lib/python3.8/site-packages/selectable/base.py>/opt/conda/envs/seazit/lib/python3.8/site-packages/selectable/base.py.new
RUN mv /opt/conda/envs/seazit/lib/python3.8/site-packages/selectable/base.py.new /opt/conda/envs/seazit/lib/python3.8/site-packages/selectable/base.py
RUN chmod 644 /opt/conda/envs/seazit/lib/python3.8/site-packages/selectable/base.py

#fix markdown property vision from markdown.version
#to: markdown.__version__
RUN sed -e 's/markdown.version/markdown.__version__/g' /opt/conda/envs/seazit/lib/python3.8/site-packages/rest_framework/compat.py > /opt/conda/envs/seazit/lib/python3.8/site-packages/rest_framework/new_compat.py
#replace compat.py with new_compat.py
RUN mv /opt/conda/envs/seazit/lib/python3.8/site-packages/rest_framework/new_compat.py /opt/conda/envs/seazit/lib/python3.8/site-packages/rest_framework/compat.py
RUN chmod 644 opt/conda/envs/seazit/lib/python3.8/site-packages/rest_framework/compat.py

#RUN pip install -U pip
#RUN pip install -r /requirements/production.txt

COPY ./project /app/project

# django can't write in volume /app/public
# fix? https://denibertovic.com/posts/handling-permissions-with-docker-volumes/
RUN chown -R django /app
#USER django

WORKDIR /app/project

ENTRYPOINT ["/entrypoint.sh"]
