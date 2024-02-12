# Use the rocker/shiny image as the base
FROM rocker/shiny:latest

# Expose port 3838 for Shiny
EXPOSE 3838

# Copy the Shiny server configuration and application files
COPY ./shiny-server.conf /etc/shiny-server/shiny-server.conf
COPY ./shiny-server.sh /usr/bin/shiny-server.sh
COPY ./error-404.html /etc/shiny-server/templates/error-404.html
COPY ./error-503-users.html /etc/shiny-server/templates/error-503-users.html

# Set permissions for the custom shiny-server script
RUN chmod +x /usr/bin/shiny-server.sh

# Custom initialization (modify as needed)
RUN export ADD="shiny" && \
    mkdir /srv/shiny-apps

# Install system dependencies
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    libcairo2-dev \
    libssl-dev \
    libxml2-dev \
    libudunits2-dev \
    libgdal-dev \
    && rm -rf /var/lib/apt/lists/*

# Install R packages
RUN R -e "install.packages('packrat')"

# Set the command to run the Shiny server
CMD ["/usr/bin/shiny-server.sh"]
