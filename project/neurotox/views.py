from django.views.generic import TemplateView


class NeurotoxTemplateView(TemplateView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["active_view_name"] = self.active_view_name
        return context


class Home(NeurotoxTemplateView):
    template_name = "neurotox/home.html"
    active_view_name = "home"


class Datasets(NeurotoxTemplateView):
    template_name = "neurotox/datasets.html"
    active_view_name = "datasets"


class QC(NeurotoxTemplateView):
    template_name = "neurotox/qc.html"
    active_view_name = "qc"



class CR(NeurotoxTemplateView):
    template_name = "neurotox/cr.html"
    active_view_name = "cr"


class BMD(NeurotoxTemplateView):
    template_name = "neurotox/bmd.html"
    active_view_name = "bmd"

class Exposure(NeurotoxTemplateView):
    template_name = "neurotox/exposure.html"
    active_view_name = "exposure"

class ExposureCurvep(NeurotoxTemplateView):
    template_name = "neurotox/exposurecurvep.html"
    active_view_name = "exposurecurvep"

class ExposureHill(NeurotoxTemplateView):
    template_name = "neurotox/exposurehill.html"
    active_view_name = "exposurehill"


class Integrative(NeurotoxTemplateView):
    template_name = "neurotox/integrative.html"
    active_view_name = "integrative"


class Resources(NeurotoxTemplateView):
    template_name = "neurotox/resources.html"
    active_view_name = "resources"
