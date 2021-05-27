from django.conf import settings
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView

from .forms import LoginForm


class Home(TemplateView):
    template_name = 'home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        #context['cebs_enabled'] = 'cebs' in settings.INSTALLED_APPS
        return context


class LoginView(auth_views.LoginView):
    form_class = LoginForm
