# -*- coding: utf-8 -*-
from django.apps import apps
from django.core.management.base import BaseCommand
from django.db.models.fields import NOT_PROVIDED
from collections import defaultdict

from textwrap import dedent


class Command(BaseCommand):
    """Generate a tabular description of all django models."""
    help = 'Generate a tabular description of all django models.'

    def handle(self, *args, **options):

        attributes = ('max_length', 'unique', 'blank', 'null', 'default', 'primary_key', 'choices',)
        models = apps.get_models()
        models_by_app = defaultdict(list)
        for model in models:
            models_by_app[model.__module__].append(model)

        texts = [
            dedent('''\
            # Django ORM schema definitions

            ![database diagram](full.png)

            The full database diagram is diagram is shown above. Note that these
            diagrams are very large, so you can right click and view all images
            in a new browser window to zoom in and explore.\
            ''')
        ]

        def add_text(txt):
            texts.append(dedent(txt))

        def add_attr(fld, attr):
            if attr is 'choices':
                return f'<li><ul>choices:{"".join([f"<li>{choice[0]}: {choice[1]}</li>" for choice in fld.choices])}</ul></li>'
            return f'<li>{attr}: {str(getattr(fld, attr))}</li>'

        def add_relation_attributes(fld):
            model_name = f'{fld.remote_field.model.__module__}.{fld.remote_field.model.__name__}'
            db_table = fld.remote_field.model._meta.db_table
            attr_list = [
                f'<li>table: [{db_table}](#{db_table})</li>',
                f'<li>django model: {model_name}</li>',
                f'<li>null: {fld.null}</li>',
            ]
            return f'<ul>{"".join(attr_list)}</ul>'

        def add_attributes(fld):
            attr_list = [
                add_attr(fld, attr)
                for attr in attributes
                if (getattr(fld, attr, False) and getattr(fld, attr) is not NOT_PROVIDED)]
            return f'<ul>{"".join(attr_list)}</ul>'

        for module, model_list in models_by_app.items():
            if any([fld in module for fld in ['django', 'rest_framework']]):
                continue

            # add header and ER schema diagram
            app_name = module.replace(".models", "")
            add_text(f'''\
                 ## {app_name}

                 ![{app_name}]({app_name}.png)\
                 ''')

            # build html table for each db table
            for model in model_list:
                add_text(f'''
                ### {model._meta.db_table}

                - Database table name: {model._meta.db_table}
                - Django model name: {module}.{model.__name__}

                **Concrete fields:**

                | Name | Type | Attributes     | Help text |
                | --- | --- | --- | --- |''')

                for fld in model._meta.concrete_fields:

                    if fld.is_relation:
                        name = f'{fld.column}<br>(in django: {fld.name})'
                        attrs = add_relation_attributes(fld)
                    else:
                        name = fld.name
                        attrs = add_attributes(fld)

                    add_text(f'''| {name} | {fld.get_internal_type()} | {attrs} | {fld.help_text}''')

                add_text(f'''

                **Many to many and reverse relations:**
                ''')
                for field in model._meta.related_objects:

                    add_text(f'''\
                    - {field.__class__.__name__}: [{field.related_model._meta.db_table}](#{field.related_model._meta.db_table})\
                    ''')

                add_text('\n\n')

        text = '\n'.join(texts)
        self.stdout.write(text)
