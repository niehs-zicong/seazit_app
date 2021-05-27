#!/bin/bash

set -e
cmd="$@"

# the official postgres image uses 'postgres' as default user if not set explictly.
if [ -z "$POSTGRES_USER" ]; then
    export POSTGRES_USER=postgres
fi
#This for postgres docker
#export DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@postgres:5437/$POSTGRES_USER
#export POSTGRES_PASSWORD=my_dev_password
#This is for db server
export DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_SERVER_IP:$PORT/$POSTGRES_USER
 
#DATABASE_URL=
function postgres_ready(){
/opt/conda/envs/DIVER/bin/python << END
import sys
import psycopg2

try:

    conn = psycopg2.connect(user = "$POSTGRES_USER",password = "my_dev_password",host = "10.98.105.92",port = "5432", database = "sandbox")
    cur = conn.cursor()
    print('PostgreSQL database version:')
    cur.execute('SELECT version()')
    print (cur.fetchone())
    conn.close()
    # $POSTGRES_USER=sandbox
    # $POSTGRES_PASSWORD=iiUTo-GUTmYFMSR914F_8dY9urKpHKZZHzWLpeXJIt4
    # $DB_SERVER=NONE
    #conn = psycopg2.connect(dbname="$POSTGRES_USER", user="$POSTGRES_USER", password="$POSTGRES_PASSWORD", host="$DB_SERVER")
     
except psycopg2.OperationalError:
    sys.exit(-1)
sys.exit(0)
END
}


# ensure we can connect to redis client;
# requires REDIS_CONNECTION_STRING environment variable
function redis_ready(){
/opt/conda/envs/DIVER/bin/python << END
import sys
import redis
try:
    client = redis.StrictRedis.from_url("$REDIS_CONNECTION_STRING")
    client.ping()
except redis.exceptions.ConnectionError:
    sys.exit(-1)
sys.exit(0)
END
}

until postgres_ready; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

until redis_ready; do
  >&2 echo "Redis is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres and Redis are up - continuing..."
exec $cmd
