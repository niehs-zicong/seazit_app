import json
from plotly.utils import PlotlyJSONEncoder


def try_int(val, default=None):
    """Return int or default value."""
    try:
        return int(val)
    except (ValueError, TypeError):
        return default


def ints_only_list(lst):
    # Return a list of only ints or None
    return [
        d for d in [
            try_int(d) for d in lst
        ] if d is not None
    ] or None


def plotly_figure_to_dict(fig):
    # dump/load to ensure the resulting dict can be pickled for caching
    return json.loads(
        json.dumps({
            'data': fig.get('data', []),
            'layout': fig.get('layout', {})
        }, cls=PlotlyJSONEncoder))
