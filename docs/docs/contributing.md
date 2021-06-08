# Contributing

To contribute to existing applications in the NTP sandbox, please submit issues and pull-requests using gitlab: [https://gitlab.niehs.nih.gov/ods/sandbox](https://gitlab.niehs.nih.gov/ods/sandbox). Adding issues and pull-requests is recommended for changes.

For new django applications in the NTP sandbox or jobs added to the queue, add to the existing repository. If developing new dockerized applications, create a new repository (e.g. enricher). For shiny applications, create new repositories. If we choose to make the source-code open-source and publicly available, it should be on github, and preferably linked to the github [NIEHS organization](https://github.com/niehs/). Currently the NTP sandbox repository is designed to be private as it has some implementation details for the web architecture.

In all cases, source-code must be saved in version-control software, preferably using git.

## Adding new features, data, or applications

Adding new content to the NTP sandbox is encouraged and we hope the barrier to entry is low. Determining how to include into the sandbox is case-specific; general cases are described below, but it is recommended that we have a discussion before starting writing any code.

### Adding a new algorithm

Examples may include, adding a new dose-response model, adding a new statistical calculation, applying a PCA algorithm, etc. The NTP sandbox has a RESTful API [staging](https://sandbox-staging.ntp.niehs.nih.gov/job-runner/)/[production](https://sandbox.ntp.niehs.nih.gov/job-runner/) to submit jobs to a job queue and return results ([documentation](./apps/jobrunner/)). To add a REST endpoint to the job queue:

- **Using Python?** Write as a python module, should include a setup.py, and unit-tests which are written in [py.test](https://docs.pytest.org/en/latest/). Use [cookiecutter](https://github.com/audreyr/cookiecutter-pypackage) for an ideal package.
- **Using R?** Write an R package that follows conventions in this test-package we use for job deployments [TO ADD]
- **Using Java?** [TO ADD]
- **Using something else?** Let's chat before implementing...

After writing your package, integrate into the Sandbox by binding a REST target to your endpoint [as described](./apps/jobrunner/#creating-a-new-job).

**Note: ** The approach for execution in the job-queue is designed for jobs which are not too computationally expensive. We have something like ~16 workers which can run jobs on a medium sized server. If we need to right larger jobs, we can explore alternative implementations. Celery has an extensive API which allows for concepts like maps, reduce, and chunk ([docs](http://docs.celeryproject.org/en/latest/userguide/canvas.html#the-primitives)).

### Adding data to a database

Use our shared NTP sandbox PostgreSQL [database](#postgresql). We'll need to have a discussion to determine if we'll append to an existing table in the schema, or add new tables to the schema. Want a non-relational database? Did you know PostgreSQL has queryable and indexible [JSON fields](https://www.postgresql.org/docs/10/static/datatype-json.html)? Still need something else? Ok, let's chat.

### Building a new stateless application?

- **Using Python? ** Create a new django application in the NTP sandbox. Alternatively, if you want a simpler solution, build a [dash](https://plot.ly/products/dash/) application. Write as a python module, should include a setup.py, and unit-tests which are written in [py.test](https://docs.pytest.org/en/latest/). Use [cookiecutter](https://github.com/audreyr/cookiecutter-pypackage) for an ideal package.
- **Using R?** Is it an R shiny app? Recommended with reservations; currently having issues building R shiny apps, but we've done in the past. Use [packrat](https://rstudio.github.io/packrat/) to save dependencies, and deliver a versioned tar.gz file. These can be added to the shiny-server container. If you need to specify differences between dev/staging/production, use environment variables, we can set these in different environments.
- **Using Java?** [TO ADD]
- **Using something else?** Let's chat before implementing...

### Building an application that saves state?

- **Using Python?** Create a new django application in the NTP sandbox. This handles many things out of the box include authentication/authorization, REST API, a frontend javascript webpack environment, connection to the database and worker threads, etc.
- **Using Java?** Create a new Docker container with a Tomcat instance and your application being served at the root level. We will route the application through nginx and handle all SSL certificate issues. All changes to the database should be created by applying changes using django migrations, as described above.

## Authentication/authorization

Currently, no applications on the NTP sandbox are designed for LDAP authorization. This is because applications are generally designed for public use, or authorization/authentication isn't required for a particular application.

The django application on the sandbox does have a complete [authentication system](https://docs.djangoproject.com/en/1.11/topics/auth/), with users stored in a database. Users can login with a valid username/email, or they can send authorization tokens for API requests. Users can also be set to different groups, and groups can have varying levels of permissions in django applications.

## Connecting to deployed services
Instructions including examples on how to connect to different resources in the NTP sandbox are described below, by resource type. By default all example connection strings are presented in Python; other languages are also shown if they're available.

### PostgreSQL

 
An example python query to the postgresql server:

```python
import pandas
import psycopg2

uri = 'postgres:POSTGRES_SERVER_IP=xxxx,port=543x,user=xxx,pw=xxx,Database=lll'
with psycopg2.connect(uri) as conn:

    # works!
    count = pd.read_sql_query("SELECT COUNT(*) FROM tox21_assay", conn)

    # fails; read-only connection
    pd.read_sql_query('DELETE FROM tox21_assay', conn)

    # fails; read-only connection
    pd.read_sql_query("INSERT INTO tox21_gene VALUES ('a', 'b', 'c', 'd')", conn)

```

Example code for querying in R:

```R
if (!require("RPostgreSQL")){
    install.packages("RPostgreSQL")
}
library("RPostgreSQL")

driver <- dbDriver("PostgreSQL")
conn <- dbConnect(driver,
    dbname = "seazit",
    host = "xx",
    port = 5432,
    user = "xxx",
    password = "xxx")

df <- RPostgreSQL::dbGetQuery(conn,
    "SELECT * FROM tox21_assay")

count <- RPostgreSQL::dbGetQuery(conn, "SELECT COUNT(*) FROM tox21_assay")

# this will fail; read-only user in database
RPostgreSQL::dbGetQuery(conn, "DELETE FROM tox21_assay")

# this will fail; read-only user in database
RPostgreSQL::dbGetQuery(conn,
    "INSERT INTO tox21_gene VALUES ('a', 'b', 'c', 'd')")

# don't forget to close the connection
RPostgreSQL::dbDisconnect(conn)
RPostgreSQL::dbUnloadDriver(driver)
```

### RabbitMQ

The RabbitMQ server is deployed on both staging and production; however open connections are only available on the staging server. The RabbitMQ server is configured currently with only the root ``virtual_host`` enabled; an example connection to the staging-server is below:

```python
import pika

uri = 'amqp://guest:guest@ehshpclp119:5672/'

params = pika.connection.URLParameters(uri)

with pika.BlockingConnection(parameters=params) as conn:
    channel = conn.channel()
    print(channel.get_waiting_message_count())
```

### Redis

The Redis server is deployed on both staging and production; however open connections are only available on the staging server. The Redis server is currently configured with two databases:

- ``0``: django caching server
- ``1``: jobrunner result storage engine (before saving in database)

An example connection string to the django cache is below:

```python
conn = redis.from_url('redis://ehshpclp119:6379/0')
conn.info()
conn.set('hi', 'ho')
conn.get('hi')
```

### Rserve

The Rserve instance is deployed on both staging and production; however open connections are only available on the staging server. An example Rserve connection is below:

```python
import pyRserve

conn = pyRserve.connect(host='ehshpclp119', port=6311)
conn.voidEval('foo <- function(x){ x ** 3 }')
print(conn.r.foo(10))
conn.close()
```
