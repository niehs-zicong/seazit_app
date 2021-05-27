from django.conf import settings
from django.conf.urls import include, url
from django.urls import reverse_lazy
from django.contrib.auth.views import LogoutView
from django.views.generic import TemplateView, RedirectView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

from admin.site import site as admin_site

from .views import Home, LoginView


desc = """Sandbox API Documentation

- View the [Swagger](/api/swagger) user interface.
- View the [ReDoc](/api/redoc) user interface.
- View the swagger specification in [json](/api/swagger.json) or [yaml](/api/swagger.yaml)
"""
schema_view = get_schema_view(
    openapi.Info(
        title="Sandbox API",
        default_version='v1',
        description=desc,
    ),
    validators=['flex', 'ssv'],
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# serve production apps
urlpatterns = [
    url(r'^$', Home.as_view(), name='home'),
    url(r'^selectable/', include('selectable.urls')),
    url(r'^neurotox/', include(('neurotox.urls', 'neurotox'), namespace='neurotox')),

    url(r'^niehs-alumni/$',
        TemplateView.as_view(template_name='shiny/niehs-alumni.html'),
        name='niehs-alumni'),

    # api schema docs
    url(r'^api/$',
        RedirectView.as_view(url=reverse_lazy('schema-swagger-ui'), permanent=False),
        name='api-schema'),
    url(r'^api/swagger/$',
        schema_view.with_ui('swagger', cache_timeout=settings.TIMEOUT),
        name='schema-swagger-ui'),
    url(r'^api/redoc/$',
        schema_view.with_ui('redoc', cache_timeout=settings.TIMEOUT),
        name='schema-redoc'),
    url(r'^api/swagger(?P<format>.json|.yaml)$',
        schema_view.without_ui(cache_timeout=settings.TIMEOUT),
        name='schema-json'),

    # general accounts
    url(r'accounts/', include('django.contrib.auth.urls')),

    # login & logout
    url(r'^login/$', LoginView.as_view(), name='login'),
    url(r'^logout/$', LogoutView.as_view(), name='logout'),

    # admin
    url(r'^batcave/', admin_site.urls),
]

# serve apps currently under development
if settings.ENVIRONMENT_NAME != 'Production':

    urlpatterns.extend([       

        url(r'^react-pfc/$',
            TemplateView.as_view(template_name='shiny/react-pfc.html'),
            name='react-pfc'),

        url(r'^plate-viewer/$',
            TemplateView.as_view(template_name='shiny/plate-viewer.html'),
            name='plate-viewer'),
    ])



# server media-only in debug mode
if settings.DEBUG:
    from django.views import static
    import debug_toolbar
    urlpatterns.extend([
        url(r'^__debug__/', include(debug_toolbar.urls)),
        url(r'^media/(?P<path>.*)$',
            static.serve,
            {'document_root': settings.MEDIA_ROOT, }),
        url(r'^403/$', TemplateView.as_view(template_name="403.html")),
        url(r'^404/$', TemplateView.as_view(template_name="404.html")),
        url(r'^500/$', TemplateView.as_view(template_name="500.html")),
    ])
