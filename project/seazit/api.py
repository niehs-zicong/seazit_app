from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import detail_route, list_route
from rest_framework_extensions.cache.decorators import cache_response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from utils.api import CachedReadOnlyViewSet
from utils.general import ints_only_list, plotly_figure_to_dict
from utils.renderers import data_frame_renderers, plotly_renderers

from . import models, serializers



def format_param():
    return openapi.Parameter(
        "format",
        openapi.IN_QUERY,
        "Format of returned data. One of tsv, csv, xlsx, api, or json",
        type=openapi.TYPE_STRING,
    )

class AnalysisBmcInputViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a CurveP BMD instance.
    list:
        Return all available CurveP BMDs.
    flat:
        Return all readouts [flat file formats].
            - Can specify one or more casrns
            - Can specify one or more readout_ids
    """
    model = models.AnalysisBmcInput
    queryset = models.AnalysisBmcInput.objects.all()
    serializer_class = serializers.AnalysisBmcInputSerializer

class AnalysisBmcOutputViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a CurveP BMD instance.
    list:
        Return all available CurveP BMDs.
    flat:
        Return all readouts [flat file formats].
            - Can specify one or more casrns
            - Can specify one or more readout_ids
    """
    model = models.AnalysisBmcOutput
    queryset = models.AnalysisBmcOutput.objects.all()
    serializer_class = serializers.AnalysisBmcOutputSerializer



class AnalysisInputKeyViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a CurveP BMD instance.
    list:
        Return all available CurveP BMDs.
    flat:
        Return all readouts [flat file formats].
            - Can specify one or more casrns
            - Can specify one or more readout_ids
    """
    model = models.AnalysisInputKey
    queryset = models.AnalysisInputKey.objects.all()
    serializer_class = serializers.AnalysisInputKeySerializer



class SeazitDoseViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a CurveP BMD instance.
    list:
        Return all available CurveP BMDs.
    flat:
        Return all readouts [flat file formats].
            - Can specify one or more casrns
            - Can specify one or more readout_ids
    """
    model = models.SeazitDose
    queryset = models.SeazitDose.objects.all()
    serializer_class = serializers.SeazitDoseSerializer

    @list_route(renderer_classes=data_frame_renderers)
    def doses(self, request, *args, **kwargs):
        return Response(self.model.get_doses())



class SeazitPlateScreenViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a CurveP BMD instance.
    list:
        Return all available CurveP BMDs.
    flat:
        Return all readouts [flat file formats].
            - Can specify one or more casrns
            - Can specify one or more readout_ids
    """
    model = models.SeazitPlateScreen
    queryset = models.SeazitPlateScreen.objects.all()
    serializer_class = serializers.SeazitPlateScreenSerializer




class SeazitProtocolViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a CurveP BMD instance.
    list:
        Return all available CurveP BMDs.
    flat:
        Return all readouts [flat file formats].
            - Can specify one or more casrns
            - Can specify one or more readout_ids
    """
    model = models.SeazitProtocol
    queryset = models.SeazitProtocol.objects.all()
    serializer_class = serializers.SeazitProtocolSerializer

    @cache_response()
    @list_route()
    def metadata(self, request, *args, **kwargs):
        return Response(models.SeazitProtocol.get_metadata())



class SeazitRecordingViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a CurveP BMD instance.
    list:
        Return all available CurveP BMDs.
    flat:
        Return all readouts [flat file formats].
            - Can specify one or more casrns
            - Can specify one or more readout_ids
    """
    model = models.SeazitRecording
    queryset = models.SeazitRecording.objects.all()
    serializer_class = serializers.SeazitRecordingSerializer


class SeazitSubstanceViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a CurveP BMD instance.
    list:
        Return all available CurveP BMDs.
    flat:
        Return all readouts [flat file formats].
            - Can specify one or more casrns
            - Can specify one or more readout_ids
    """
    model = models.SeazitSubstance
    queryset = models.SeazitSubstance.objects.all()
    serializer_class = serializers.SeazitSubstanceSerializer




class SeazitSubstanceMappingViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a CurveP BMD instance.
    list:
        Return all available CurveP BMDs.
    flat:
        Return all readouts [flat file formats].
            - Can specify one or more casrns
            - Can specify one or more readout_ids
    """
    model = models.SeazitSubstanceMapping
    queryset = models.SeazitSubstanceMapping.objects.all()
    serializer_class = serializers.SeazitSubstanceMappingSerializer




class SeazitTestViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a CurveP BMD instance.
    list:
        Return all available CurveP BMDs.
    flat:
        Return all readouts [flat file formats].
            - Can specify one or more casrns
            - Can specify one or more readout_ids
    """
    model = models.SeazitTest
    queryset = models.SeazitTest.objects.all()
    serializer_class = serializers.SeazitTestSerializer



class SeazitWellViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a CurveP BMD instance.
    list:
        Return all available CurveP BMDs.
    flat:
        Return all readouts [flat file formats].
            - Can specify one or more casrns
            - Can specify one or more readout_ids
    """
    model = models.SeazitWell
    queryset = models.SeazitWell.objects.all()
    serializer_class = serializers.SeazitWellSerializer



class Seazit_readout_resultViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a CurveP BMD instance.
    list:
        Return all available CurveP BMDs.
    flat:
        Return all readouts [flat file formats].
            - Can specify one or more casrns
            - Can specify one or more readout_ids
    """
    model = models.Seazit_readout_result
    queryset = models.Seazit_readout_result.objects.all()
    serializer_class = serializers.Seazit_readout_resultSerializer

    @list_route(methods=["get"], renderer_classes=plotly_renderers)
    def drs(self, request, *args, **kwargs):

        protocol_ids = self.request.GET.get("protocol_ids", None)
        # readouts contains plus sign (+), it will replace by white space in Django,
        # So I reaplace whitespace back to +
        readouts = self.request.GET.get("readouts", None).replace(" ", "+")
        casrns = self.request.GET.get("casrns", None)
        if protocol_ids is None:
             raise ValidationError("requires `protocol_ids` argument.")
        if readouts is None:
            raise ValidationError("requires `readouts` argument.")
        if casrns is None:
            raise ValidationError("requires `casrns` argument.")

        protocol_ids = protocol_ids.split(",")
        readout_ids = readouts.split(",")
        carsns = casrns.split(",")
        if len(readout_ids) * len(carsns) > 100:
        # if len(readout_ids) * len(carsns) > 40:

            raise ValidationError(
                "Too many dose-response curves selected; please reduce the number of selected readouts and/or chemicals"  # noqa: E501
            )

        return Response(models.Seazit_readout_result.dose_responses(protocol_ids, readout_ids, carsns))

