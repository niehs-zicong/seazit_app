 
import sys
import psycopg2

try:

    #conn = psycopg2.connect(user = "$POSTGRES_USER",password = "ntp_group",host = "10.98.105.92",port = "5432", database = "dev_seazit")
    conn = psycopg2.connect(user = "ntp_group",password = "ntp_group",host = "10.98.105.92",port = "5432", database = "dev_seazit")
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
