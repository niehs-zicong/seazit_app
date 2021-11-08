from django.conf.urls import include, url
from rest_framework.routers import DefaultRouter

#from . import api, views
from . import  api,  views

router = DefaultRouter()
router.register("seazit_cr1", api.AnalysisBmcInputViewSet)
router.register("seazit_cr2", api.AnalysisBmcOutputViewSet)
router.register("seazit_cr3", api.AnalysisInputKeyViewSet)
router.register("seazit_cr4", api.SeazitDoseViewSet)
router.register("seazit_cr5", api.SeazitPlateScreenViewSet)
router.register("seazit_cr6", api.SeazitProtocolViewSet)
router.register("seazit_cr7", api.SeazitRecordingViewSet)
router.register("seazit_cr8", api.SeazitSubstanceViewSet)
router.register("seazit_cr9", api.SeazitSubstanceMappingViewSet)
router.register("seazit_cr10", api.SeazitTestViewSet)
router.register("seazit_cr11", api.SeazitWellViewSet)
router.register("seazit_cr12", api.Seazit_readout_resultViewSet)


urlpatterns = [
    url(r"^api/", include((router.urls, "seazit"), namespace="api")),
    url(r"^$", views.Home.as_view(), name="home"),
    url(r"^quality-control/$", views.QC.as_view(), name="qc"),
    #url(r'^home/', views.Home.as_view(),name='home'),
    url(r"^resources/$", views.Resources.as_view(), name="resources"),
    url(r"^seazit_cr/$", views.SeazitCR.as_view(), name="seazit_cr"),
    url(r"^seazit_cr2/$", views.seazit_cr, name="seazit_cr2"),
    url(r"^seazit_cr3/$", views.SeazitCR3.as_view(), name="seazit_cr3"),
    url(r"^seazit_cr4/$", views.seazit_cr4, name="seazit_cr4"),

]
