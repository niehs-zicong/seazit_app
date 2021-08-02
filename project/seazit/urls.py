from django.conf.urls import include, url
from rest_framework.routers import DefaultRouter

#from . import api, views
from . import  views

router = DefaultRouter()
'''router.register("assay", api.AssayViewSet)
router.register("readout", api.ReadoutViewSet)
router.register("plate", api.PlateViewSet)
router.register("chemical", api.ChemicalViewSet)
router.register("substance", api.SubstanceViewSet)
router.register("curvep", api.CurvePViewSet)
router.register("hill", api.HillViewSet)
router.register("exposurecurvep", api.ExposureCurvePViewSet)
router.register("exposurehill", api.ExposureHillViewSet)
router.register("exposure", api.ExposureViewSet)
'''

urlpatterns = [
    url(r"^api/", include((router.urls, "seazit"), namespace="api")),
    url(r"^$", views.Home.as_view(), name="home"),
    #url(r'^home/', views.Home.as_view(),name='home'),    
    url(r"^resources/$", views.Resources.as_view(), name="resources"),
]
