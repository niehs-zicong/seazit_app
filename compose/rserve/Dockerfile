FROM rocker/tidyverse:3.4.3

# install R and Rserve
# r-base and r-base-dev for R
# libbz2/liblzma-dev for rJava (for rcdk)
# libssl-dev required for Rserve
# libcurl4-openssl-dev required for devtools
# default-jdk & default-jre for CDK
RUN apt-get update && \
    apt-get install -y \
        curl \
        libssl-dev \
        libcurl4-openssl-dev \
        libbz2-dev \
        liblzma-dev \
        default-jdk \
        default-jre \
        wget \
        unzip \
    && \
    apt-get clean && \
    R -e "install.packages('Rserve', repos='http://www.rforge.net/')"

# install application-specific R content
RUN mkdir -p /app && \
    wget https://github.com/cdk/cdk/releases/download/cdk-2.1/cdk-2.1.jar -O /app/cdk-2.1.jar && \
    R -e "install.packages(c('jsonlite', 'rcdk'), repos='https://mirrors.nics.utk.edu/cran/')" && \
    R -e "devtools::install_github('moggces/Rcurvep', ref='v0.1')"

WORKDIR /app

COPY Rserv.conf /etc/Rserv.conf
COPY ./app /app

ENTRYPOINT R CMD Rserve --no-save --RS-conf /etc/Rserv.conf
