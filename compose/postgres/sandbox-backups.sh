#
# Application-specific database backups in the sandbox. Instead of a global
# database-dump, it's application-specific.
#
# To restore:
#
#       pg_restore \
#           --dbname=${DB_CONN} \
#           --clean \
#           --exit-on-error --disable-triggers \
#           --no-owner \
#           /backups/${TODAY}-NAME.tar.gz

# set today's date
TODAY=$(date +%Y-%m-%d)

# get correct connection string
DB_CONN=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@127.0.0.1:5437/sandbox

# dump fiveday
#pg_dump \
#    --dbname=${DB_CONN} \
#    --clean --format=custom --no-owner \
#    -t fiveday_reporttemplate \
#    -t fiveday_report \
#        > /backups/${TODAY}-fiveday.tar.gz

 

# dump neurotox
pg_dump \
    --dbname=${DB_CONN} \
    --clean --format=custom --no-owner \
    -t neurotox_assay \
    -t neurotox_category \
    -t neurotox_chemical \
    -t neurotox_hill \
    -t neurotox_curvep \
    -t neurotox_plate \
    -t neurotox_readout \
    -t neurotox_substance \
    -t neurotox_well \
    -t neurotox_wellresponse \
        > /backups/${TODAY}-neurotox.tar.gz

 
