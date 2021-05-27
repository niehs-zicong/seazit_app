#!/bin/bash

# Shell script to build  model graphs and schema descriptions
pushd ./project

# generate schema doc page
python manage.py table_models > ../docs/docs/db/schema.md

# generate ER diagram pngs
python manage.py graph_models drugmatrix -g -o ../docs/docs/db/drugmatrix.png
#python manage.py graph_models fiveday -g -o ../docs/docs/db/fiveday.png
python manage.py graph_models ivive -g -o ../docs/docs/db/ivive.png
python manage.py graph_models job_runner -g -o ../docs/docs/db/job_runner.png
python manage.py graph_models neurotox -g -o ../docs/docs/db/neurotox.png
python manage.py graph_models tox21 -g -o ../docs/docs/db/tox21.png
python manage.py graph_models -a -g -o ../docs/docs/db/full.png

popd
