from rest_framework import serializers

from . import models


class AssaySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Assay
        fields = "__all__"


class PlateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Plate
        fields = "__all__"


class ChemicalSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Chemical
        fields = "__all__"


class SubstanceSerializer(serializers.ModelSerializer):
    chemical = ChemicalSerializer(read_only=True)

    class Meta:
        model = models.Substance
        fields = "__all__"


class ReadoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Readout
        fields = "__all__"


class HillSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Hill
        fields = "__all__"


class CurvePSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CurveP
        fields = "__all__"



class ExposureSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Exposure
        fields = "__all__"

class ExposureCurvepSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.expo_curvep
        fields = "__all__"
class ExposureHillSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.expo_hill
        fields = "__all__"
