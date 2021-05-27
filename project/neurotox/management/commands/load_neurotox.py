from django.core.management.base import BaseCommand
from django.db import connection

import os


class Command(BaseCommand):
    help = "Load neurotoxicity data to path"

    TABLES = [
        "neurotox_assay",
        "neurotox_plate",
        "neurotox_readout",
        "neurotox_chemical",
        "neurotox_substance",
        "neurotox_well",
        "neurotox_wellresponse",
    ]

    SEQUENCES = [
        ["neurotox_plate_id_seq", "neurotox_plate"],
        ["neurotox_readout_id_seq", "neurotox_readout"],
        ["neurotox_substance_id_seq", "neurotox_substance"],
        ["neurotox_well_id_seq", "neurotox_well"],
        ["neurotox_wellresponse_id_seq", "neurotox_wellresponse"],
    ]

    def add_arguments(self, parser):
        parser.add_argument("output_path", help="Output path.")

    def handle(self, output_path, **options):
        path = os.path.abspath(os.path.expanduser(output_path))
        if not os.path.exists(path):
            os.makedirs(path)

        self.truncate_tables()
        self.load_data(path)
        self.update_indexes()

    def truncate_tables(self):
        with connection.cursor() as cursor:
            for table_name in reversed(self.TABLES):
                cursor.execute("TRUNCATE TABLE %s CASCADE" % table_name)

    def load_data(self, path):
        with connection.cursor() as cursor:
            psg = cursor.cursor
            for table_name in self.TABLES:
                fn = os.path.join(path, table_name + ".csv")
                with open(fn, "r") as f:
                    psg.copy_from(f, table_name)

    def update_indexes(self):
        with connection.cursor() as cursor:
            for seq, table_name in self.SEQUENCES:
                cursor.execute(
                    "SELECT setval('%s', (SELECT MAX(id) FROM %s));" % (seq, table_name)
                )
