from rest_framework import serializers

from . import models





class AnalysisBmcInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AnalysisBmcInput
        fields = "__all__"



class AnalysisBmcOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AnalysisBmcOutput
        fields = "__all__"


class AnalysisInputKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AnalysisInputKey
        fields = "__all__"


class SeazitDoseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SeazitDose
        fields = "__all__"



class SeazitPlateScreenSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SeazitPlateScreen
        fields = "__all__"



class SeazitProtocolSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SeazitProtocol
        fields = "__all__"



class SeazitRecordingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SeazitRecording
        fields = "__all__"


class SeazitSubstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SeazitSubstance
        fields = "__all__"




class SeazitSubstanceMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SeazitSubstanceMapping
        fields = "__all__"




class SeazitTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SeazitTest
        fields = "__all__"



class SeazitWellSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SeazitWell
        fields = "__all__"



class Seazit_readout_resultSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Seazit_readout_result
        fields = "__all__"

