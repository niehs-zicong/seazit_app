Deploying is currently orchestrated by a collection of [fabric](http://www.fabfile.org/) tasks which rebuild and start the individual docker containers. Containers are orchestrated via [docker-compose](https://docs.docker.com/compose/); all containers are by default set to restart if failure.

These scripts are not publicly available because they include private passwords and other sensitive configuration variables for the production website. However, if you have access, all scripts are available in the [deploy-sandbox](https://gitlab.niehs.nih.gov/ods/deploy-sandbox) gitlab repository.
