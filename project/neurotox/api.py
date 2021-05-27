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


class AssayViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return an assay instance.

    list:
        Return all available assays.

    metadata:
        Return assay metadata for readouts and substances.

    """

    queryset = models.Assay. objects.all()
    serializer_class = serializers.AssaySerializer

    @cache_response()
    @list_route()
    def metadata(self, request, *args, **kwargs):
        return Response(models.Assay.get_metadata())


class ChemicalViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a substance instance.

    list:
        Return all available substances.

    responses:
        Return all responses for a given readout [flat file formats].

    """

    queryset = models.Chemical.objects.all()
    serializer_class = serializers.ChemicalSerializer

    @cache_response()
    @swagger_auto_schema(
        methods=["get"],
        manual_parameters=[
            openapi.Parameter(
                "readout",
                openapi.IN_QUERY,
                "Return results for selected readout ID",
                type=openapi.TYPE_STRING,
            ),
            format_param(),
        ],
    )
    @detail_route(methods=["get"], renderer_classes=data_frame_renderers)
    def responses(self, request, *args, **kwargs):
        object = self.get_object()
        readout = self.request.GET.get("readout")
        return Response(object.get_responses(readout))


class BmdViewset(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a substance instance.

    list:
        Return all available substances.

    responses:
        Return all responses for a given readout [flat file formats].

    bmds:
        Return a list of BMD results.

    """

    model = None  # implementation required
    queryset = None  # implementation required
    serializer_class = None  # implementation required

    def get_queryset(self):
        qs = super().get_queryset()

        casrns = self.request.GET.getlist("casrns")
        readout_ids = ints_only_list(self.request.GET.getlist("readout_ids"))

        if casrns:
            qs = qs.filter(substance__chemical__in=casrns)

        if readout_ids:
            qs = qs.filter(readout_id__in=readout_ids)

        return qs

    @cache_response()
    @swagger_auto_schema(
        methods=["get"],
        manual_parameters=[
            openapi.Parameter(
                "casrns",
                openapi.IN_QUERY,
                "Return BMD results for selected CASRNs",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "readout_ids",
                openapi.IN_QUERY,
                "Return BMD results for selected readout IDs",
                type=openapi.TYPE_STRING,
            ),
        ],
    )
    @list_route(renderer_classes=data_frame_renderers)
    def bmds(self, request, *args, **kwargs):
        casrns = self.request.GET.getlist("casrns")
        readout_ids = ints_only_list(self.request.GET.getlist("readout_ids"))
        return Response(self.model.get_bmds(casrns=casrns, readout_ids=readout_ids))

    @cache_response()
    @list_route()
    def pca_assay(self, request, *args, **kwargs):
        fig = self.model.pca_assay()
        d = plotly_figure_to_dict(fig)
        return Response(d)

    @cache_response()
    @list_route()
    def pca_chemical(self, request, *args, **kwargs):
        fig = self.model.pca_chemical()
        d = plotly_figure_to_dict(fig)
        return Response(d)


class CurvePViewSet(BmdViewset):
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

    model = models.CurveP
    queryset = models.CurveP.objects.all()
    serializer_class = serializers.CurvePSerializer


class HillViewSet(BmdViewset):
    """
    retrieve:
        Return a BMD instance.

    list:
        Return all available BMDs.

    flat:
        Return all readouts [flat file formats].
            - Can specify one or more casrns
            - Can specify one or more readout_ids

    """

    model = models.Hill
    queryset = models.Hill.objects.all()
    serializer_class = serializers.HillSerializer




class ExposureCurvePViewSet(BmdViewset):
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

    model = models.expo_curvep
    queryset = models.expo_curvep.objects.all()
    serializer_class = serializers.ExposureCurvepSerializer



class ExposureHillViewSet(BmdViewset):
    """
    retrieve:
        Return a BMD instance.

    list:
        Return all available BMDs.

    flat:
        Return all readouts [flat file formats].
            - Can specify one or more casrns
            - Can specify one or more readout_ids

    """

    model = models.expo_hill
    queryset = models.expo_hill.objects.all()
    serializer_class = serializers.ExposureHillSerializer


class ExposureViewSet(BmdViewset):

    """
    retrieve:
        Return a BMD instance.

    list:
        Return all available BMDs.

    flat:
        Return all readouts [flat file formats].
            - Can specify one or more casrns
            - Can specify one or more readout_ids

    """

    model = models.Exposure
    queryset = models.Exposure.objects.all()
    serializer_class = serializers.ExposureSerializer
    #
    #
    # model = models.Hill
    # queryset = models.Hill.objects.all()
    # serializer_class = serializers.HillSerializer



class PlateViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a plate instance.

    list:
        Return all available plates.

    grid:
        Return all data on a plate [flat file formats].
    """

    queryset = models.Plate.objects.all()
    serializer_class = serializers.PlateSerializer

    @cache_response()
    @detail_route(methods=["get"], renderer_classes=data_frame_renderers)
    def grid(self, request, *args, **kwargs):
        object = self.get_object()
        return Response(object.get_grid())


class ReadoutViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a readout instance.

    list:
        Return all available readouts.

    flat:
        Return all readouts [flat file formats].

    responses:
        Return all responses for a given readout [flat file formats].

    substances_by_readout:
        Return all substances available for each readout [flat file formats].

    drs:
        Return dose-response data and BMD curves for readout + casrn.

    vehicle_controls:
        Return all available vehicle controls.

    """

    queryset = models.Readout.objects.all()
    serializer_class = serializers.ReadoutSerializer

    @cache_response()
    @list_route(renderer_classes=data_frame_renderers)
    def flat(self, request, *args, **kwargs):
        return Response(models.Readout.get_flat())

    @cache_response()
    @swagger_auto_schema(
        methods=["get"],
        manual_parameters=[
            openapi.Parameter(
                "casrn",
                openapi.IN_QUERY,
                "Return results for selected CASRN",
                type=openapi.TYPE_STRING,
            ),
            format_param(),
        ],
    )
    @detail_route(methods=["get"], renderer_classes=data_frame_renderers)
    def responses(self, request, *args, **kwargs):
        object = self.get_object()
        casrn = self.request.GET.get("casrn")
        return Response(object.get_responses(casrn))

    @cache_response()
    @list_route(renderer_classes=data_frame_renderers)
    def substances_by_readout(self, request, *args, **kwargs):
        return Response(models.WellResponse.substances_by_readout())

    @cache_response()
    @swagger_auto_schema(
        methods=["get"],
        manual_parameters=[
            openapi.Parameter(
                "casrns",
                openapi.IN_QUERY,
                "Return results for selected CASRNs",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "readouts",
                openapi.IN_QUERY,
                "Return results for selected readout IDs",
                type=openapi.TYPE_STRING,
            ),
        ],
    )
    @list_route(methods=["get"], renderer_classes=plotly_renderers)
    def drs(self, request, *args, **kwargs):
        readouts = self.request.GET.get("readouts", None)
        casrns = self.request.GET.get("casrns", None)
        if readouts is None:
            raise ValidationError("requires `readouts` argument.")
        if casrns is None:
            raise ValidationError("requires `casrns` argument.")
        readout_ids = [int(d) for d in readouts.split(",")]
        carsns = casrns.split(",")
        if len(readout_ids) * len(carsns) > 40:
            raise ValidationError(
                "Too many dose-response curves selected; please reduce the number of selected readouts and/or chemicals"  # noqa: E501
            )
        return Response(models.WellResponse.dose_responses(readout_ids, carsns))

    @cache_response()
    @list_route(renderer_classes=data_frame_renderers)
    def vehicle_controls(self, request, *args, **kwargs):
        return Response(models.Readout.vehicle_controls())


class SubstanceViewSet(CachedReadOnlyViewSet):
    """
    retrieve:
        Return a substance instance.

    list:
        Return all available substances.

    flat:
        Return all substances [flat file formats].

    readouts_by_substance:
        Return all substances available for each readout [flat file formats].
    """

    queryset = models.Substance.objects.all()
    serializer_class = serializers.SubstanceSerializer

    @cache_response()
    @list_route(renderer_classes=data_frame_renderers)
    def flat(self, request, *args, **kwargs):
        return Response(models.Substance.get_flat())

    @cache_response()
    @list_route(renderer_classes=data_frame_renderers)
    def readouts_by_substance(self, request, *args, **kwargs):
        return Response(models.WellResponse.substances_by_readout())
