FROM postgres:9.6.8

 
RUN apt-get update && \
    apt-get install -y \
        wget unzip cmake \
        postgresql-server-dev-9.6 \
        build-essential python-numpy cmake python-dev sqlite3 libsqlite3-dev \
        libboost-dev libboost-all-dev libboost-system-dev libboost-thread-dev \
        libboost-serialization-dev libboost-python-dev libboost-regex-dev \
        libeigen3-dev libcairo2-dev && \
    \
    apt-get clean
RUN apt-get install nano

# add backup scripts
ADD sandbox-backups.sh /usr/local/bin/app-backups
ADD backup.sh /usr/local/bin/backup
ADD restore.sh /usr/local/bin/restore
ADD list-backups.sh /usr/local/bin/list-backups

# add postgres config
ADD postgresql.conf /etc/postgresql/postgresql.conf

# make them executable
RUN chmod +x /usr/local/bin/app-backups && \
    chmod +x /usr/local/bin/backup && \
    chmod +x /usr/local/bin/restore && \
    chmod +x /usr/local/bin/list-backups
