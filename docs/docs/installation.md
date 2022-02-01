## Quickstart development environment

Installing the sandbox is complex; applications require installation both a webserver and a database. The following pre-requisites are required:

- Anaconda or Miniconda
- Docker and Docker compose

### The application environment (python + javascript)

Installation instructions described below. Note that the instructions assume the NTP sandbox will be installed to ``~/dev/seazit`` and a conda environment will be created which is named ``seazit``; both of these settings can be changed but instructions will need to be updated:

```bash
cd ~/dev
git clone -b seazit_app --single-branch https://gitlab.niehs.nih.gov/ods/seazit_app.git

cd ./seazit_app
conda env create -f env_seazit.yml

# install python requirements in new conda environment
conda activate seazit
brew install freetype
pip install -r requirements/dev.txt
conda install pygraphviz ??? this may not needed.

# copy default local settings (and modify as needed)
cp ./project/main/settings/local.example.py ./project/main/settings/local.py



# install javascript libraries
cd ./project
yarn install
```

Installation notes:



### The database environment (postgreSQL)

Create a docker environment file at the root `sandbox` directory named `.env`. Add the following variables:

```
POSTGRES_USER=sandbox
POSTGRES_PASSWORD=my_dev_password
DB_USER=sandbox
```

Build and run the docker container:

```bash
docker-compose -f ./docker-compose-dev.yml build postgres
docker-compose -f ./docker-compose-dev.yml up -d postgres
```

To confirm the database is working, connect via a local psql client:

```bash
psql -U sandbox -p 5433 -h localhost
```

You can save your password in the file `~/.pgpass` instead of having to re-enter it ([docs](https://www.postgresql.org/docs/9.6/static/libpq-pgpass.html)) each time you try to connect to the database:

    localhost:5433:sandbox:sandbox:my_dev_password

Ensure that your settings in `./project/main/settings/local.py` allow you test connect to the database. Now, sync database state with python state:

```bash
source activate seazit
cd ~/dev/sandbox/project
python manage.py migrate  # sync application <-> database
python manage.py createsuperuser  # for admin login
```

### Running all the things

To run the development environment, you'll need to run an instance of the django web application, and an instance of the javascript webpack builder. You'll need to run them in two different terminal windows.

```bash
# python [in the first terminal]
conda activate seazit
cd ~/dev/sandbox/project
python manage.py runserver 8000
#Running with just:
#manage.py runserver
#only makes the system available via localhost
#if it is a server Use :
#python manage.py runserver 0.0.0.0:8000 to make it listen on all interfaces

# javascript [in a second terminal]
conda activate seazit
cd ~/dev/seazit_app/project
npm start
```
optional :

```bash
load DIVER data:
cp DIVER.sql to your server
psql -h localhost -p 5433 -d sandbox -U sandbox -f DIVER.sql
```

Navigate to [http://127.0.0.1:8000/](http://127.0.0.1:8000/), and you should be able to see the NTP sandbox homepage!

For convenience, a Makefile is available which starts a developer environment in one shell using [tmux](https://tmux.github.io/). The Makefile is designed such that if a local version of the tmux configuration is present, it is called instead, which allows more user-specific customization of the application.

```bash
cd ~/dev/sandbox
make dev

# to customize your tmux environment; edit dev.local.sh
cp ./bin/dev.sh ./bin/dev.local.sh

# remove lines 5-9 to prevent recursive seg fault in dev.local.sh
vim ./bin/dev.local.sh
```

**Note: ** Note that all conda environments must be deactivated before trying to run the tmux script, otherwise changing conda environments will fail ([details](https://github.com/conda/conda/issues/6796)).

### Simplifying commands by modifying environment variables

You can modify conda environments to set environment variables or other settings when activating the environment. Below, we create an alias to for running docker-compose with our development settings; you may find benefit in adding other settings to reduce keystrokes.

For more details, read the [docs](https://conda.io/docs/user-guide/tasks/manage-environments.html#saving-environment-variables). The example below includes all required steps:

```bash
conda activate DIVER
cd $CONDA_PREFIX
mkdir -p ./etc/conda/activate.d
mkdir -p ./etc/conda/deactivate.d
touch ./etc/conda/activate.d/env_vars.sh
touch ./etc/conda/deactivate.d/env_vars.sh
```

In ``./etc/conda/activate.d/env_vars.sh``:

```
alias dc="docker-compose -f ./docker-compose-dev.yml"
cd ~/dev/sandbox
```

In ``./etc/conda/deactivate.d/env_vars.sh``:

```
unalias dc
cd ~
```

## Documentation environment

Docs are built using [mkdocs](http://www.mkdocs.org/). The project Makefile includes a directive to create the documentation build server:

```bash
make servedocs
```

Diagrams are generated using [mermaid](https://github.com/mermaidjs/mermaid.cli); install using yarn. The [online editor](https://mermaidjs.github.io/mermaid-live-editor/) is helpful for rapidly iterating; to build from files:

```bash
cd docs

mmdc -t neutral -C ./diagrams/mmd.css \
    -i ./diagrams/containers.mmd \
    -o ./docs/static/containers.png
```

## Testing environment

Testing the base django-application is done using the ``make test`` command; tests are implemented using [pytest](https://pytest.org/); refer to the library details for more advanced testing questions.

## Additional application-specific install requirements

The installation above is the minimal installation to get a working environment; to test some features which may application-specific, see the additional notes by application:

- [job-queue](/apps/jobrunner/#developer-instructions)
- [shiny applications](/apps/shiny/#developer-instructions)

## FAQ

### Generate ER models for django applications

Entity-relationship models can be automatically created using django and the django extensions module. To create ER diagrams:

```bash
pip install pygraphviz

# for all models in a particular application
python manage.py graph_models -g -o tox21.png tox21

# for a subset of models
python manage.py graph_models -g -o tox21-assays.png \
    --include-models Gene,TargetSub,Target,Protocol,Call,Assay,Readout tox21
```

### Squash migrations migrations in django

When iterating on new development, you may end up creating lots of django migrations as your data schema evolves. After you've got a more stable version of the database, you can collapse all the migration files into a new single file.

Assuming your app is named `myapp`:

```bash
rm myapp/migrations/0*
```

Remove old migrations from database:

```python
from django.db import connection

APP_NAME = 'myapp'
with connection.cursor() as cursor:
    cursor.execute(f"DELETE FROM django_migrations WHERE app = '{APP_NAME}';")
```

Create new migration, and then fake apply it without actually modifying the db schema:

```bash
python manage.py makemigrations
python manage.py migrate --fake
```
