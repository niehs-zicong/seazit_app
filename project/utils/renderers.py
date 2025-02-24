import json
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

        if isinstance(data, list):  # Check if data is a list of dictionaries
            data = {
                "columns": list(data[0].keys()) if data else [],
                "records": data
            }
        return super().render(data, media_type, renderer_context)


class DataFrameCSVRenderer(BaseRenderer):
    media_type = 'text/csv'
    format = 'csv'

    def render(self, data, media_type=None, renderer_context=None):
        renderer_context = renderer_context or {}
        response = renderer_context['response']
        if response.exception:
            return json.dumps(response.data)

        # Assuming data is a list of dictionaries
        if isinstance(data, list):
            if not data:
                return ""
            columns = data[0].keys()
            csv_data = ",".join(columns) + "\n"
            for row in data:
                csv_data += ",".join(str(row[col]) for col in columns) + "\n"
            return csv_data
        return ""


class DataFrameTSVRenderer(BaseRenderer):
    media_type = 'text/plain'
    format = 'tsv'

    def render(self, data, media_type=None, renderer_context=None):
        renderer_context = renderer_context or {}
        response = renderer_context['response']
        if response.exception:
            return json.dumps(response.data)

        # Assuming data is a list of dictionaries
        if isinstance(data, list):
            if not data:
                return ""
            columns = data[0].keys()
            tsv_data = "\t".join(columns) + "\n"
            for row in data:
                tsv_data += "\t".join(str(row[col]) for col in columns) + "\n"
            return tsv_data
        return ""


class DataFrameXLSXRenderer(BaseRenderer):
    media_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    format = 'xlsx'

    def render(self, data, media_type=None, renderer_context=None):
        renderer_context = renderer_context or {}
        response = renderer_context['response']
        if response.exception:
            return json.dumps(response.data)

        # Assuming data is a list of dictionaries
        if isinstance(data, list) and data:
            f = BytesIO()
            # Write the data to the BytesIO object in an Excel-compatible format
            from openpyxl import Workbook
            wb = Workbook()
            ws = wb.active
            columns = data[0].keys()
            ws.append(columns)
            for row in data:
                ws.append([row[col] for col in columns])
            wb.save(f)
            return f.getvalue()
        return b""


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
