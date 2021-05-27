import decimal
import logging
from collections import OrderedDict

from django.core.cache import cache
from django.core.serializers.json import DjangoJSONEncoder

from rest_framework.renderers import JSONRenderer


class BaseJSONEncoder(DjangoJSONEncoder):
    """
    Modified to return a float instead of a string.
    """
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return float(o)
        else:
            return super(BaseJSONEncoder, self).default(o)


class SerializerHelper(object):
    """
    helper-object for getting serialized objects and setting cache.
    Sets cache names based on django models and primary keys automatically.
    Sets a cache using the serialized object, and also a JSON object.
    """

    serializers = {}

    @classmethod
    def _get_cache_name(cls, model, id, json=True):
        name = "{}.{}.{}".format(model.__module__, model.__name__, id)
        if json:
            name += ".json"
        return name

    @classmethod
    def get_serialized(cls, jsonData, json=True, from_cache=True):
        if from_cache:
            name = cls._get_cache_name(jsonData.__class__, jsonData.pk, json)
            cached = cache.get(name)
            if cached:
                logging.debug('using cache: {}'.format(name))
            else:
                cached = cls._serialize_and_cache(jsonData, json=json)
            return cached
        else:
            return cls._serialize(jsonData, json=json)

    @classmethod
    def _serialize(cls, jsonData, json=False):
        serializer = cls.serializers.get(jsonData.__class__)
        serialized = serializer(jsonData).data
        if json:
            serialized = JSONRenderer().render(serialized)
        return serialized

    @classmethod
    def _serialize_and_cache(cls, jsonData, json):
        # get expected object names
        name = cls._get_cache_name(jsonData.__class__, jsonData.pk, json=False)
        json_name = cls._get_cache_name(jsonData.__class__, jsonData.pk, json=True)

        # serialize data and get json-representation
        if hasattr(jsonData, 'optimized_for_serialization'):
            jsonData = jsonData.optimized_for_serialization()
        serialized = cls._serialize(jsonData, json=False)
        json_str = JSONRenderer().render(serialized)
        serialized = OrderedDict(serialized)  # for pickling

        logging.debug('setting cache: {}'.format(name))
        cache.set_many({name: serialized, json_name: json_str})

        if json:
            return json_str
        else:
            return serialized

    @classmethod
    def add_serializer(cls, model, serializer):
        cls.serializers[model] = serializer

    @classmethod
    def delete_caches(cls, model, ids):
        names = [cls._get_cache_name(model, id, json=False) for id in ids]
        names.extend([cls._get_cache_name(model, id, json=True) for id in ids])
        logging.debug("Removing caches: {}".format(', '.join(names)))
        cache.delete_many(names)
