import json
import pandas as pd
from io import BytesIO
from rest_framework.renderers import BaseRenderer, JSONRenderer, BrowsableAPIRenderer
from plotly.utils import PlotlyJSONEncoder


class BrowsableAPIRendererWithoutForms(BrowsableAPIRenderer):
    def get_context(self, *args, **kwargs):
        context = super().get_context(*args, **kwargs)
        context['display_edit_forms'] = False
        return context

    def show_form_for_method(self, view, method, request, jsonData):
        return False


class DataFrameJSONRenderer(JSONRenderer):

    def render(self, data, media_type=None, renderer_context=None):

        renderer_context = renderer_context or {}
        response = renderer_context['response']
        if response.exception:
            return json.dumps(response.data)

        if isinstance(data, pd.DataFrame):
            data = data.to_dict(orient='split')
        return super().render(data, media_type, renderer_context)


class DataFrameCSVRenderer(BaseRenderer):
    media_type = 'text/csv'
    format = 'csv'

    def render(self, df, media_type=None, renderer_context=None):
        renderer_context = renderer_context or {}
        response = renderer_context['response']
        if response.exception:
            return json.dumps(response.data)

        return df.to_csv(index=False)


class DataFrameTSVRenderer(BaseRenderer):

    media_type = 'text/plain'
    format = 'tsv'

    def render(self, df, media_type=None, renderer_context=None):
        renderer_context = renderer_context or {}
        response = renderer_context['response']
        if response.exception:
            return json.dumps(response.data)

        return df.to_csv(sep='\t', index=False)


class DataFrameXLSXRenderer(BaseRenderer):

    media_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    format = 'xlsx'

    def render(self, df, media_type=None, renderer_context=None):
        renderer_context = renderer_context or {}
        response = renderer_context['response']
        if response.exception:
            return json.dumps(response.data)

        f = BytesIO()
        writer = pd.ExcelWriter(f)
        df.to_excel(writer, index=False)
        writer.save()
        return f.getvalue()


class PlotlyJSONRenderer(JSONRenderer):
    encoder_class = PlotlyJSONEncoder


data_frame_renderers = [
    BrowsableAPIRenderer,
    DataFrameJSONRenderer,
    DataFrameCSVRenderer,
    DataFrameTSVRenderer,
    DataFrameXLSXRenderer,
]


plotly_renderers = [
    BrowsableAPIRenderer,
    PlotlyJSONRenderer,
]

noform_renderers = [
    BrowsableAPIRendererWithoutForms,
    JSONRenderer,
]
