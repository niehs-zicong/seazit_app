from functools import wraps
from django.utils.cache import add_never_cache_headers
from django.utils.decorators import available_attrs, method_decorator
from django.views.generic import ListView


def never_cache(view_func):
    """Add headers for no client-side caching."""
    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view_func(request, *args, **kwargs):
        response = view_func(request, *args, **kwargs)
        add_never_cache_headers(response)
        if not response.has_header('Pragma'):
            response['Pragma'] = 'no-Cache'
        if not response.has_header('Cache-Control'):
            response['Cache-Control'] = 'no-Store, no-Cache'
        return response

    return _wrapped_view_func


class NeverCacheFormMixin(object):

    @method_decorator(never_cache)
    def dispatch(self, *args, **kwargs):
        return super(NeverCacheFormMixin, self).dispatch(*args, **kwargs)


class FilterListView(NeverCacheFormMixin, ListView):
    model = None  # required
    paginate_by = 30
    form_class = None  # required

    def get(self, request, *args, **kwargs):
        if len(self.request.GET) > 0:
            self.form = self.form_class(self.request.GET)
        else:
            self.form = self.form_class()
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        qs = super().get_queryset()

        if self.form.is_valid():
            order_by, annotation = self.form.get_order_by_with_annotation()
            qs = qs.annotate(annotation).order_by(order_by)
            qs = self.form.get_form_queryset(qs)
        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = self.form
        return context
