FROM rocker/rstudio:3.4.3

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
RUN export ADD="shiny" && \
    bash /etc/cont-init.d/add && \
    \
    mkdir /srv/shiny-apps && \
    R -e "install.packages('packrat')" && \
    apt-get update && \
    apt-get install -y \
        libcairo2-dev \
        libssl-dev \
        libxml2-dev \
        libudunits2-dev \
        libgdal-dev \
    && \
    rm -rf /var/lib/apt/lists/*

CMD ["/usr/bin/shiny-server.sh"]
