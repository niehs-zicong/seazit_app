from django import forms
import json


class HtmlTextWidget(forms.widgets.Textarea):
    """
    Pretty-render JSON if possible in text area widget.
    """
    def __init__(self, attrs=None):
        super().__init__(dict(
            cols=120,
            rows=30,
            style='font-family: monospace'
        ))


class JsonTextWidget(forms.widgets.Textarea):
    """
    Pretty-render JSON if possible in text area widget.
    """

    def __init__(self, attrs=None):
        super().__init__(dict(
            cols=120,
            rows=60,
            style='font-family: monospace'
        ))

    def render(self, name, value, attrs=None):
        if value is None:
            value = '{}'

        if type(value) is str:
            try:
                value = json.dumps(json.loads(value), indent=2)
            except:
                pass

        return super().render(name, value, attrs)
