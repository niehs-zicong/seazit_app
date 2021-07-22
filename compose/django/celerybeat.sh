#!/bin/sh

LOGFILE="/app/logs/celerybeat.log"

# wait for migrations
sleep 10

#exec /opt/conda/envs/seazit/bin/celery beat \
 #   --app=main \
  #  --loglevel=INFO \
   # --logfile=$LOGFILE
