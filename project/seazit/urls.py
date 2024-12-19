from django.urls import include, path
from rest_framework.routers import DefaultRouter

# Importing views and API views
from . import api, views

# Initialize router
router = DefaultRouter()

# Register API views with the router
router.register("seazit_bmcByLab", api.AnalysisInputKeyViewSet)
router.register("seazit_metadata", api.SeazitProtocolViewSet)
router.register("seazit_sankeydata", api.SeazitOntologyViewSet)
router.register("seazit_result", api.Seazit_readout_resultViewSet)

urlpatterns = [
    # Include the router URLs under the 'api' namespace
    path("api/", include((router.urls, "seazit"), namespace="api")),

    # Define regular paths for your views
    path("", views.Home.as_view(), name="home"),
    path("dataset/", views.Dataset.as_view(), name="dataset"),
    path("quality-control/", views.QC.as_view(), name="qc"),
    path("resources/", views.Resources.as_view(), name="resources"),
    path("seazit_cr/", views.SeazitCR.as_view(), name="seazit_cr"),
    path("seazit_bmcByLab/", views.SeazitBmcByLab.as_view(), name="seazit_bmcByLab"),
    path("seazit_integrative/", views.SeazitIntegrative.as_view(), name="seazit_integrative"),
]
