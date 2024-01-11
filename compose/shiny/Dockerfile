FROM rocker/rstudio
#FROM rocker/rstudio:3.4.3
EXPOSE 3838

COPY ./shiny-server.conf /etc/shiny-server/shiny-server.conf
COPY ./shiny-server.sh /usr/bin/shiny-server.sh
COPY ./error-404.html /etc/shiny-server/templates/error-404.html
COPY ./error-503-users.html /etc/shiny-server/templates/error-503-users.html

# install Shiny to RStudio
# libssl-dev: RSclient [neurotox-workshop]
# libxml2-dev: XML [neurotox-workshop]
# libudunits2-dev: udunits2 [neurotox-workshop]
# libgdal-dev: [neurotox-workshop]

RUN apt-get update && apt-get install -y apt-transport-https
RUN echo 'deb http://private-repo-1.hortonworks.com/HDP/ubuntu14/2.x/updates/2.4.2.0 HDP main' >> /et$
RUN echo 'deb http://private-repo-1.hortonworks.com/HDP-UTILS-1.1.0.20/repos/ubuntu14 HDP-UTILS main'$
RUN echo 'deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/azurecore/ trusty main' >> /etc/ap$

# Install R packages and system dependencies
RUN R -e "install.packages('packrat')"
RUN apt-get install -y \
        libcairo2-dev \
        libssl-dev \
        libxml2-dev \
        libudunits2-dev \
        libgdal-dev \
    && rm -rf /var/lib/apt/lists/*

CMD ["/usr/bin/shiny-server.sh"]
