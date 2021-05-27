from django import template

register = template.Library()


@register.simple_tag
def url_replace(request, field, value):
    """
    Adds current url query params to url.
    <a href="?{% url_replace request 'page' paginator.next_page_number %}">
    """

    dict_ = request.GET.copy()

    dict_[field] = value

    return dict_.urlencode()
