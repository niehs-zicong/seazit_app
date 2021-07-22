#!/bin/sh

LOGFILE="/app/logs/celery.log"

# wait for migrations
sleep 10

#exec /opt/conda/envs/seazit/bin/celery worker \
#    --app=main \
#    --loglevel=INFO \
#    --logfile=$LOGFILE \
#    --soft-time-limit=3600 \
#    --time-limit=3660 \
#    --concurrency=24
