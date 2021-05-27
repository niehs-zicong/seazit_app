from jinja2 import Environment
from django.conf import settings
from django.contrib.staticfiles.storage import staticfiles_storage
from django.core.urlresolvers import reverse

import os

from docx.shared import Inches
from docxtpl import InlineImage


def get_static_url(request, fn):
    return '{}://{}{}'.format(
        request.scheme, request.get_host(), staticfiles_storage.url(fn))


def get_static_path(fn):
    return os.path.join(settings.STATIC_ROOT, fn)


def get_media_url(fn):
    return os.path.join(settings.MEDIA_URL, fn)


def get_media_path(fn):
    return os.path.join(settings.MEDIA_ROOT, fn)


def get_docx_image(tmpl, fn, width=6.5):
    fn = os.path.join(settings.MEDIA_ROOT, fn)
    return InlineImage(tmpl, fn, width=Inches(width))


def format_tbl_string(v):
    if v < 0.001:
        return f'{v:.1E}'
    else:
        return f'{v:.3f}'


def environment(**options):
    env = Environment(**options)
    env.globals.update({
        'static': get_static_url,
        'static_path': get_static_path,
        'media': get_media_url,
        'media_path': get_media_path,
        'url': reverse,
        'get_docx_image': get_docx_image,
        'f': format_tbl_string,
    })
    return env
