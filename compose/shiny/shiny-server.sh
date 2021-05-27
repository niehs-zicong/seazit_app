#!/bin/sh

mkdir -p /var/log/shiny-server
chown shiny.shiny /var/log/shiny-server

exec shiny-server 2>&1
