from django.conf import settings
from django.urls import include, path, re_path
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
        title="Seazit API",
        default_version='v1',
        description=desc,
    ),
    validators=['flex', 'ssv'],
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# serve production apps
urlpatterns = [
    path('', Home.as_view(), name='home'),
    # path('selectable/', include('selectable.urls')),
    path('seazit/', include(('seazit.urls', 'seazit'), namespace='seazit')),

    # API schema docs
    path('api/',
        RedirectView.as_view(url=reverse_lazy('schema-swagger-ui'), permanent=False),
        name='api-schema'),
    path('api/swagger/',
        schema_view.with_ui('swagger', cache_timeout=settings.TIMEOUT),
        name='schema-swagger-ui'),
    path('api/redoc/',
        schema_view.with_ui('redoc', cache_timeout=settings.TIMEOUT),
        name='schema-redoc'),
    re_path(r'^api/swagger(?P<format>.json|.yaml)$',
        schema_view.without_ui(cache_timeout=settings.TIMEOUT),
        name='schema-json'),

    # General accounts
    path('accounts/', include('django.contrib.auth.urls')),

    # Login & logout
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # Admin
    re_path(r'^batcave/', admin_site.urls),
]

# Serve apps under development (uncomment to enable)
'''
if settings.ENVIRONMENT_NAME != 'Production' or settings.ENVIRONMENT_NAME != 'Sandbox' :
    urlpatterns.extend([       
        path('react-pfc/', TemplateView.as_view(template_name='shiny/react-pfc.html'), name='react-pfc'),
        path('plate-viewer/', TemplateView.as_view(template_name='shiny/plate-viewer.html'), name='plate-viewer'),
    ])
'''

# Server media-only in debug mode
if settings.DEBUG:
    from django.views import static
    import debug_toolbar
    urlpatterns.extend([
        path('__debug__/', include(debug_toolbar.urls)),
        re_path(r'^media/(?P<path>.*)$',
            static.serve,
            {'document_root': settings.MEDIA_ROOT, }),
        path('403/', TemplateView.as_view(template_name="403.html")),
        path('404/', TemplateView.as_view(template_name="404.html")),
        path('500/', TemplateView.as_view(template_name="500.html")),
    ])
