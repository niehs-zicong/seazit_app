from django.contrib.auth.models import Group
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, viewsets
from rest_framework_extensions.cache.decorators import cache_response


def calculate_cache_key(view_instance, view_method, request, args, kwargs):
    return request.get_full_path()


class CachedReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):

    @cache_response()
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @cache_response()
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class BulkIdFilter(DjangoFilterBackend):
    """
    Filters objects on IDs. IDs must be supplied in the form ?ids=10209,10210.

    Catches AttributeError when `ids` is not supplied.
    """
    def filter_queryset(self, request, queryset, view):
        queryset = super().filter_queryset(request, queryset, view)
        ids = request.query_params.get('ids')\
            if (request.query_params.get('ids') is not '')\
            else None
        try:
            ids = ids.split(',')
            filters = {'id__in': ids}
        except AttributeError:
            ids = []
            filters = {}

        if view.action not in ('list', 'retrieve'):
            filters = {'id__in': ids}

        return queryset.filter(**filters)


class HasGroupPermission(permissions.BasePermission):
    """
    Ensure user is in required group. View requires a `required_group` name.
    """
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            return False

        return request.user.is_staff or \
            Group.objects.get(name=view.required_group).user_set.filter(id=request.user.id).exists()
