from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework_extensions.cache.decorators import cache_response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from utils.api import CachedReadOnlyViewSet
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
    model = models.AnalysisBmcInput
    queryset = models.AnalysisBmcInput.objects.all()
    serializer_class = serializers.AnalysisBmcInputSerializer


class AnalysisBmcOutputViewSet(CachedReadOnlyViewSet):
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
    model = models.SeazitDose
    queryset = models.SeazitDose.objects.all()
    serializer_class = serializers.SeazitDoseSerializer

    @action(detail=False, methods=['get'], renderer_classes=data_frame_renderers)
    def doses(self, request, *args, **kwargs):
        return Response(self.model.get_doses())


class SeazitPlateScreenViewSet(CachedReadOnlyViewSet):
    model = models.SeazitPlateScreen
    queryset = models.SeazitPlateScreen.objects.all()
    serializer_class = serializers.SeazitPlateScreenSerializer


class SeazitProtocolViewSet(CachedReadOnlyViewSet):
    model = models.SeazitProtocol
    queryset = models.SeazitProtocol.objects.all()
    serializer_class = serializers.SeazitProtocolSerializer

    @cache_response()
    @action(detail=False, methods=['get'])
    def metadata(self, request, *args, **kwargs):
        return Response(models.SeazitProtocol.get_metadata())


class SeazitOntologyViewSet(CachedReadOnlyViewSet):
    model = models.SeazitOntology
    queryset = models.SeazitOntology.objects.all()
    serializer_class = serializers.SeazitOntologySerializer

    @cache_response()
    @action(detail=False, methods=['get'])
    def sankeydata(self, request, *args, **kwargs):
        return Response(models.SeazitOntology.get_sankey())


class SeazitOntologySankeyFlowViewSet(CachedReadOnlyViewSet):
    model = models.SeazitOntologySankeyFlow
    queryset = models.SeazitOntologySankeyFlow.objects.all()
    serializer_class = serializers.SeazitOntologySankeyFlowSerializer


class SeazitOntologySankeyNodesViewSet(CachedReadOnlyViewSet):
    model = models.SeazitOntologySankeyNodes
    queryset = models.SeazitOntologySankeyNodes.objects.all()
    serializer_class = serializers.SeazitOntologySankeyNodesSerializer


class SeazitRecordingViewSet(CachedReadOnlyViewSet):
    model = models.SeazitRecording
    queryset = models.SeazitRecording.objects.all()
    serializer_class = serializers.SeazitRecordingSerializer


class SeazitSubstanceViewSet(CachedReadOnlyViewSet):
    model = models.SeazitSubstance
    queryset = models.SeazitSubstance.objects.all()
    serializer_class = serializers.SeazitSubstanceSerializer


class SeazitSubstanceMappingViewSet(CachedReadOnlyViewSet):
    model = models.SeazitSubstanceMapping
    queryset = models.SeazitSubstanceMapping.objects.all()
    serializer_class = serializers.SeazitSubstanceMappingSerializer


class SeazitWellViewSet(CachedReadOnlyViewSet):
    model = models.SeazitWell
    queryset = models.SeazitWell.objects.all()
    serializer_class = serializers.SeazitWellSerializer


class Seazit_readout_resultViewSet(CachedReadOnlyViewSet):
    model = models.Seazit_readout_result
    queryset = models.Seazit_readout_result.objects.all()
    serializer_class = serializers.Seazit_readout_resultSerializer

    @action(methods=["get"],  detail=False,  renderer_classes=plotly_renderers)
    def bmcByLabResult(self, request, *args, **kwargs):
        protocol_ids = self.request.GET.get("protocol_ids", None)
        readouts = self.request.GET.get("readouts", None).replace(" ", "+")

        if protocol_ids is None:
            raise ValidationError("requires `protocol_ids` argument.")
        if readouts is None:
            raise ValidationError("requires `readouts` argument.")

        protocol_ids = protocol_ids.split(",")
        readout_ids = readouts.split(",")

        return Response(models.Seazit_readout_result.bmds_responses(protocol_ids, readout_ids))

    @action(methods=["get"] , detail=False,  renderer_classes=plotly_renderers)
    def crResult(self, request, *args, **kwargs):
        protocol_ids = self.request.GET.get("protocol_ids", None)
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
        carsns_ids = casrns.split(",")
        if len(readout_ids) * len(carsns_ids) > 100:
            raise ValidationError(
                "Too many dose-response curves selected; please reduce the number of selected readouts and/or chemicals"
            )
        return Response(models.Seazit_readout_result.concentration_responses(protocol_ids, readout_ids, carsns_ids))

    @action(methods=["get"], detail=False,  renderer_classes=plotly_renderers)
    def integrativeResult(self, request, *args, **kwargs):
        protocol_ids = self.request.GET.get("protocol_ids", None)
        casrns = self.request.GET.get("casrns", None)
        if protocol_ids is None:
            raise ValidationError("requires `protocol_ids` argument.")
        if casrns is None:
            raise ValidationError("requires `casrns` argument.")

        protocol_ids = protocol_ids.split(",")
        carsns_ids = casrns.split(",")
        return Response(models.Seazit_readout_result.integrative_responses(protocol_ids, carsns_ids))


class Seazit_bmc_readout_resultViewSet(CachedReadOnlyViewSet):
    model = models.Seazit_bmc_readout_result
    queryset = models.Seazit_bmc_readout_result.objects.all()
    serializer_class = serializers.Seazit_bmc_readout_resultSerializer
