# Tox21 Enricher

## Purpose

Tox21 Enricher allows users to submit lists of chemicals using their CAS Registry Numbers as input. Enriched chemical and biological annotations are presented in multiple formats: matrices in Excel file, heatmap images visualizing the level of similarity and dissimilarity of enriched annotations across the input chemical sets, and annotation network views illustrating the associations among the significant annotations. Tox21 Enricher also allows users to search using chemical structures (SMILES strings) that are not contained in the Tox21 10K library. This feature allows researchers to identify list of chemicals that structurally similar to chemicals in the library and then perform chemical annotation enrichment to infer the potential toxicological properties on chemicals not in the Tox21 library.

For more details, see [https://doi.org/10.1002/minf.201700129](https://doi.org/10.1002/minf.201700129).

## Application details

The application was originally written by collaborators at the University of North Dakota. Therefore, the application stack is as follows:

- Database: PostgreSQL with Rdkit cartridge
- Application: Java Tomcat application
    + Bioinformatics scripts written in Perl

## Developer instructions

The enricher application uses the powerful [rdkit](http://www.rdkit.org/) cheminformatics python package, which is unfortunately a difficult beast to install. Installation instructions described below were originally written for Mac OS; hopefully they should be portable to other OS.

#### Loading the data

Enricher data are saved in export format here:

    smb://ntp-nas.niehs.nih.gov/ntp-tools-dev/sandbox/enricher/2018-04-30-enricher-db.tar.gz

To load the export:

```bash
pg_restore \
    --host=localhost --port=5433 --username=sandbox \
    --dbname=sandbox --clean \
    --disable-triggers \
    --no-owner \
    ~/Desktop/2018-04-30-enricher-db.tar.gz
```

To (re)build the export:

```bash
pg_dump sandbox \
    --host=localhost --port=5433 --username=sandbox \
    --clean --format=custom --no-owner \
    -t dataenricher_mols \
    -t dataenricher_annotation_class \
    -t dataenricher_annotation_detail \
    -t dataenricher_annoterm_pairwise \
    -t dataenricher_chemical_detail \
    -t dataenricher_chemicals_tox21 \
    -t dataenricher_term2casrn_mapping \
    -t result_set_model \
        > ~/Desktop/2018-04-30-enricher-db.tar.gz
```

Alternatively, individual CSV files for each table are available, since loading/restoring database dumps can fail. CSVs are here:

    smb://ntp-nas.niehs.nih.gov/ntp-tools-dev/sandbox/enricher/data/2018-04-30-enricher-csvs.zip

Each table can be dumped or loaded using the example commands below in a `psql` client:

```sql
--- Load data into database
\copy dataenricher_mols FROM '~/Desktop/enricher-2018-04-30/dataenricher_mols.csv' CSV HEADER;

--- Dump data into file
\copy dataenricher_mols TO '~/Desktop/dataenricher_mols.csv' CSV HEADER;
```

### The Java environment

The Enricher Java environment is deployed using Tomcat. An application consists of a war file and a collection of perl scripts. Builds are available here:

    smb://ntp-nas.niehs.nih.gov/ntp-tools-dev/sandbox/enricher/enricherWarFiles/

Note that war files include configuration variables such as database passwords, therefore to use the ``enricherDevWar/tox21_test.war`` the database credentials must be as follows in your development environment (consistent with the installation guide):

- database name: sandbox
- user name: sandbox
- password: my_dev_password
- host: localhost
- port: 5433

Move this file to ``./compose/enricher/apps``. Also, copy the contents of `./enricher/perl` to the same path. The following information should be in `compose/enricher/apps`:

```bash
 ~/dev/sandbox/compose/enricher $ tree -L 3

.
├── Dockerfile
└── apps
    ├── tox21_test.war
    └── tox21_web
        ├── output
        └── perl
```

Then, build the container and run:

```bash
docker-compose -f ./docker-compose-dev.yml build enricher
docker-compose -f ./docker-compose-dev.yml up -d enricher
```
Enricher staging https://sandbox-staging.ntp.niehs.nih.gov/tox21_test/ .
Test in development by navigating to [http://127.0.0.1:8080/tox21_test/](http://127.0.0.1:8080/tox21_test/). Make sure to test an execution to ensure the Perl scripts work; and click the image files to ensure the Java image libraries work.
