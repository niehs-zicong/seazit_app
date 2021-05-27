from django.core.management.base import BaseCommand
from django.db import connection
from django.apps import apps

import os


class Command(BaseCommand):
    help = "Export neurotoxicity data to path"

    def add_arguments(self, parser):
        parser.add_argument("output_path", help="Output path.")

    def handle(self, output_path, **options):
        path = os.path.abspath(os.path.expanduser(output_path))
        if not os.path.exists(path):
            os.makedirs(path)

        self.dump_data(path)

    def dump_data(self, path):
        with connection.cursor() as cursor:
            psg = cursor.cursor

            models = apps.get_app_config("neurotox").get_models()
            for model in models:
                table_name = model._meta.db_table

                with open(os.path.join(path, table_name + ".csv"), "w") as f:
                    psg.copy_to(f, table_name)
