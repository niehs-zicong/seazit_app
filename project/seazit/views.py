#from django.shortcuts import render

from django.views.generic import TemplateView


class SeazitTemplateView(TemplateView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["active_view_name"] = self.active_view_name
        return context


class Home(SeazitTemplateView):
    template_name = "seazit/home.html"
    active_view_name = "home"


class Resources(SeazitTemplateView):
    template_name = "seazit/resources.html"
    active_view_name = "resources"