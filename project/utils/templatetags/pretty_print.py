import json
from django import template

register = template.Library()


@register.filter
def pretty_print(value):
    """
    Indent for printing properly formatted JSON
    """
    return json.dumps(value, indent=4)
