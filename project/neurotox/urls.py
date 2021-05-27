from django.conf.urls import include, url
from rest_framework.routers import DefaultRouter

from . import api, views


router = DefaultRouter()
router.register("assay", api.AssayViewSet)
router.register("readout", api.ReadoutViewSet)
router.register("plate", api.PlateViewSet)
router.register("chemical", api.ChemicalViewSet)
router.register("substance", api.SubstanceViewSet)
router.register("curvep", api.CurvePViewSet)
router.register("hill", api.HillViewSet)
router.register("exposurecurvep", api.ExposureCurvePViewSet)
router.register("exposurehill", api.ExposureHillViewSet)
router.register("exposure", api.ExposureViewSet)


urlpatterns = [
    url(r"^api/", include((router.urls, "neurotox"), namespace="api")),
    url(r"^$", views.Home.as_view(), name="home"),
    url(r"^datasets/$", views.Datasets.as_view(), name="datasets"),
    url(r"^quality-control/$", views.QC.as_view(), name="qc"),
    url(r"^concentration-response/$", views.CR.as_view(), name="cr"),
    url(r"^bmd/$", views.BMD.as_view(), name="bmd"),
    url(r"^exposure/$", views.Exposure.as_view(), name="exposure"),
    url(r"^exposurecurvep/$", views.ExposureCurvep.as_view(), name="exposurecurvep"),
    url(r"^exposurehill/$", views.ExposureHill.as_view(), name="exposurehill"),
    url(r"^integrative/$", views.Integrative.as_view(), name="integrative"),
    url(r"^resources/$", views.Resources.as_view(), name="resources"),
]
