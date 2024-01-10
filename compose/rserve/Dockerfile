FROM rocker/tidyverse
#FROM rocker/tidyverse:3.4.3

# install R and Rserve
# r-base and r-base-dev for R
# libbz2/liblzma-dev for rJava (for rcdk)
# libssl-dev required for Rserve
# libcurl4-openssl-dev required for devtools
# default-jdk & default-jre for CDK
#RUN apt-get update && \
RUN apt-get update && apt-get install -y apt-transport-https
RUN echo 'deb http://private-repo-1.hortonworks.com/HDP/ubuntu14/2.x/updates/2.4.2.0 HDP main' >> /et$
RUN echo 'deb http://private-repo-1.hortonworks.com/HDP-UTILS-1.1.0.20/repos/ubuntu14 HDP-UTILS main'$
RUN echo 'deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/azurecore/ trusty main' >> /etc/ap$
#RUN DEBIAN_FRONTEND=noninteractive apt-get -yq install {curl}

RUN apt-get -y install curl
RUN    apt-get install -y \
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
