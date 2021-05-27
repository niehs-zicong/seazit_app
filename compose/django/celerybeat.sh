#!/bin/sh

LOGFILE="/app/logs/celerybeat.log"

# wait for migrations
sleep 10

#exec /opt/conda/envs/DIVER/bin/celery beat \
 #   --app=main \
  #  --loglevel=INFO \
   # --logfile=$LOGFILE
