.PHONY: docs help
.DEFAULT_GOAL := help
define BROWSER_PYSCRIPT
import os, webbrowser, sys
try:
	from urllib import pathname2url
except:
	from urllib.request import pathname2url

webbrowser.open("file://" + pathname2url(os.path.abspath(sys.argv[1])))
endef
export BROWSER_PYSCRIPT

define PRINT_HELP_PYSCRIPT
import re, sys

for line in sys.stdin:
	match = re.match(r'^([a-zA-Z_-]+):.*?## (.*)$$', line)
	if match:
		target, help = match.groups()
		print("%-20s %s" % (target, help))
endef
export PRINT_HELP_PYSCRIPT

BROWSER := python -c "$$BROWSER_PYSCRIPT"

# How to run Python.
PYTHON = python

help:
	@python -c "$$PRINT_HELP_PYSCRIPT" < $(MAKEFILE_LIST)

dbdocs: ## Build auto-generated database documentation
	./docs/dbdocs.sh

dev: ## Start developer environment
	@if [ -a ./bin/dev.local.sh ]; then \
		./bin/dev.local.sh; \
	else \
		./bin/dev.sh; \
	fi;

notebook:  ## Start jupyter notebook server
	jupyter notebook --notebook-dir=./notebooks

test: ## Run unit tests.
	# To run an individual test, use the -k flag to grep for matching:
	# 	$ py.test -k test_monkey_has_tail
	#
	# To show print statements when debugging tests, use the -s flag:
	# 	$ py.test -k test_monkey_has_tail -s
	#
	cd project; py.test

test_all: ## Run unit + integration tests.
	cd project; PYTEST_INTEGRATION=T py.test

servedocs: ## Run mkdocs server
	cd docs; mkdocs serve -a localhost:8002
