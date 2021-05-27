# Job execution

## Purpose

The NTP sandbox job queue is designed to allow users to submit computational jobs to a queue, and after a period of time, results are returned. Jobs are generally in the toxicology scientific domain, but may also include cheminformatics or general data analysis. The job-queue is currently publicly available, but to use you'll need to request an authentication token. Job execution may take take a few seconds or hours, depending on the size of the job. All jobs are deleted 7 days after submission.

## Application details

The ``job_runner`` application is a python django application. A single Job database table handles all inputs and outputs for jobs; jobs are created in Python but may call R or Python functions currently.

### Jobs in the job runner

Below is a list of jobs in the job-runner and details on their uses:

- **BMDS**: BMDS model execution. This proxies all bmd modeling requests to [bmds webservers](https://bmds-server.readthedocs.io/en/master/) hosted internally on the NTP website. For details on API inputs, go to [https://bmds-server.readthedocs.io/en/master/inputs.html](https://bmds-server.readthedocs.io/en/master/inputs.html) There are currently no known users of this service.
    - On production, it sends requests to [http://ehsbmdvwp03/](http://ehsbmdvwp03/)
    - On staging, it sends requests to [http://ehsbmdvwd03/](http://ehsbmdvwd03/)
- **BMDS d-file**: The python [bmds](http://bmds.readthedocs.io/en/latest/) interface can only execute bmd models on a Windows computer, due to instability on the models used. Therefore, the library has a monkeypatch on non-Windows platforms to execute the model and then return result at a low level. This webservice is used for executing these files. Currently the service is used to execute BMD modeling for [HAWC](https://hawcproject.org/).
    - On production, it sends requests to [http://ehsbmdvwp03/](http://ehsbmdvwp03/)
    - On staging, it sends requests to [http://ehsbmdvwd03/](http://ehsbmdvwd03/)
- **CASRN to SMILES**: This was the original proof-of-concept job created to be a piece of the NICEATM ICE pipeline for predicting phys-chem properties from a list of CASRN substances. It uses the EPA comptox dashboard to execute the query. There are currently no known users of this service.
- **CurveP**: This allows non-parametric dose-response modeling using the [CurveP](https://github.com/moggces/Rcurvep) library. This was a proof of concept for executing tasks in R. It also can parallelize large tasks by automatically building a map-reduce type workflow of tasks. There are currently no known users of this service.

The following jobs are test-jobs, and are therefore only in staging:

- **Parallel Square** - A test job for building map-reduce workflows, used in the unit tests.
- **Test Job** - A test job for ensuring the success/wait/failure handshakes for the jobs run as expected, used in the unit tests.
- **Test R Job** - A test job for ensuring R tasks work as expected, used in the unit-tests.

### Using the job runner

Details on the job-runner are described extensively on the [main site](https://sandbox-staging.ntp.niehs.nih.gov/job-runner/). Example job clients are available in [Python, R, and curl](https://gist.github.com/shapiromatron/0f04fa1f2626229cce28b06b02b7af4f/). Authorization is required for remote-job viewing or execution. The following token will work both on sandbox-staging and sandbox production:

    Authorization: Token cde2a117f9f78cba2d7c3dab20c92bb9dd93d657

## Developer instructions

Instructions for sandbox developers to add/modify jobs.

### Tokens for using the API

Authentication/Authorization is implemented using standard Django [User](https://docs.djangoproject.com/en/latest/ref/contrib/auth/#user-model) and [Group](https://docs.djangoproject.com/en/1.11/ref/contrib/auth/#group-model) objects. Any users who have been assigned to the ``jobrunner`` group has the ability to execute all jobs on the server. All users can create a Token for API access. The token above refers to the Token created for the user ``jobrunner`` who is part of the ``jobrunner`` group. All staff members can run jobs, regardless of their user account's group status.

No user-specific data are stored with jobs; if you have the appropriate token (and UUID job id), then a job can be accessed.

### Creating a new job

1. Add new job class which inherits from BaseJob in ``job_runner.jobs``
2. Add the newly created Job class to the ``job_runner.jobs.__init__.job_list``
3. Run ``python manage.py makemigrations`` to reflect the newly created task
4. In ``job_runner.serializers``, add new Serializer inheriting from ``BaseJobSerializer``
5. In ``job_runner.api``, create new Viewset inheriting from ``BaseJobViewset``
6. In ``job_runner.urls``, register new route for the newly created Viewset
7. Add unit-tests in ``job_runner.tests.test_jobs``

### Job parallelization

- ``BaseJob``: Run task within a single python process.
- ``BaseParallelJob``: executes [embarrassingly parallel](https://en.wikipedia.org/wiki/Embarrassingly_parallel) jobs, following a map-reduce pattern. The input is split into chunks using the ``split_input`` method (map), and then the results of chunks are combined in the ``reduce_outputs`` step (reduce). Both methods must be implemented.

### Testing jobs

Note that by default, tests are executed only within the django unit-test environment. Some tests require other resources and have been flatted with an integration test decorator. By default, [py.test](https://docs.pytest.org/) skips integration tests; to include all integration tests use the command:

```bash
# run standard unit-tests
py.test

# run integration tests too; requires additional config
PYTEST_INTEGRATION=TRUE py.test
```

Test placement is as follows:

1. Model testing for calling jobs and handling success/failure is in ``test_models.py``
2. Testing the client API and authentication in ``test_jobs.py``
3. Testing tasks for the jobs, synchronously, outside the job frameowork are in ``test_api.py``

### Testing R-code in `jobrunner`

To test R-code using [Rserve](https://www.rforge.net/Rserve/), you'll need to build create the rserve docker container. This requires installation of [docker](https://www.docker.com/get-docker) and [docker-compose](https://docs.docker.com/compose/install/), then using the following commands:

```bash
docker-compose -f ./docker-compose-staging.yml build rserve
docker-compose -f ./docker-compose-staging.yml up rserve
```

### Running celery task workers

The default configuration of the NTP sandbox runs the task workers synchronously in the main thread of the application. This makes it easier to test tasks and ensure the jobs inside the tasks behave as expected. To run celery task workers as separate tasks:

1.  In ``main/settings/local.py``, set `CELERY_TASK_ALWAYS_EAGER==False`
2.  Start an instance of the celery worker queue:

```
cd ~/dev/sandbox/project
source ../venv/bin/activate
celery worker --app=main --loglevel=INFO
```

Note that whenever code inside a celery task is changed, the celery worker must be manually restarted; it will not automatically update.
