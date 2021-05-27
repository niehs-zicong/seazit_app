from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import connections, transaction
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
import os


PIPELINE_PATH = os.path.join(settings.PROJECT_ROOT, "notebooks", "neurotox-pipeline")

os.chdir(settings.PROJECT_PATH)


class Command(BaseCommand):
    help = "Run neurotox pipeline"

    def clear_db(self):
        with transaction.atomic():
            with connections["default"].cursor() as cursor:
                cursor.execute(
                    """
                TRUNCATE
                    neurotox_assay,
                    neurotox_category,
                    neurotox_chemical,
                    neurotox_hill,
                    neurotox_curvep,
                    neurotox_plate,
                    neurotox_readout,
                    neurotox_substance,
                    neurotox_well,
                    neurotox_wellresponse
                RESTART IDENTITY CASCADE;
                """
                )

    def run_notebooks(self):
        notebooks = [
            # ingest data from labs
            "neurotox-0-ingest-sirenko.ipynb",
            "neurotox-1-ingest-leist.ipynb",
            "neurotox-2-ingest-pei.ipynb",
            "neurotox-3-ingest-leist2.ipynb",
            "neurotox-4-ingest-peterson.ipynb",
            "neurotox-5-ingest-wolozin.ipynb",
            "neurotox-6-ingest-collins.ipynb",
            "neurotox-7-ingest-leist3.ipynb",
            "neurotox-8-ingest-leist4.ipynb",
            "neurotox-9-ingest-tanguay.ipynb",
            "neurotox-10-ingest-lein.ipynb",
            "neurotox-11-ingest-shafer.ipynb",
            "neurotox-12-ingest-biobide.ipynb",
            "neurotox-13-ingest-zeclinics.ipynb",
            # data cleanup
            "neurotox-20-cleanup-assays.ipynb",
            "neurotox-21-cleanup-chemicals.ipynb",
            "neurotox-22-set-readout-metadata.ipynb",
            # data analysis
            "neurotox-30-normalize.ipynb",
            "neurotox-31-flag-outliers.ipynb",
            "neurotox-32-curvep.ipynb",
            "neurotox-33-hill.ipynb",
            "neurotox-34-selectivity.ipynb",
        ]

        ep = ExecutePreprocessor(timeout=60 * 60 * 8, kernel_name="python3")
        for notebook in notebooks:
            input = os.path.join(PIPELINE_PATH, notebook)
            self.stdout.write(f"Running {input}...")
            with open(input, "r") as f:
                nb = nbformat.read(f, as_version=4)
                ep.preprocess(nb, {"metadata": {"path": PIPELINE_PATH}})

    def handle(self, **options):
        self.clear_db()
        self.run_notebooks()
