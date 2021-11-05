# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.db.models import F, Q


from django.contrib.postgres.fields import ArrayField
import matplotlib as mpl
import numpy as np
import pandas as pd
# import plotly.graph_objs as go
 # import seaborn as sns
# from sklearn import decomposition
# from sklearn.preprocessing import Imputer


class AnalysisBmcInput(models.Model):
    input_chembase = models.TextField(blank=True, null=True)
    substance_name_by_lab = models.TextField(blank=True, null=True)
    plate_name = models.TextField(blank=True, null=True)
    dose_id = models.IntegerField(blank=True, null=True)
    endpoint_name = models.TextField(blank=True, null=True)
    n = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    n_in = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    embryo_type = models.TextField(blank=True, null=True)
    protocol_id = models.IntegerField(blank=True, null=True)
    substance_id = models.IntegerField(blank=True, null=True)
    # input_id = models.ForeignKey('AnalysisInputKey', models.DO_NOTHING, blank=True, null=True)
    input_id = models.IntegerField(blank=True,  primary_key=True)
    screen_hours = models.IntegerField(blank=True, null=True)
    endpoint_name_only = models.TextField(blank=True, null=True)


    # def __str__(self):
    #     return self.input_id

    class Meta:
        managed = False
        db_table = 'analysis_bmc_input'


    @classmethod
    def get_flat(cls):
        cols = (
            "input_chembase",
            "endpoint_name",
            "protocol_id",
            "substance_id",
            "input_id",
        )
        qs = (
            ## the query all takes 10 second, too long. TODO
            # cls.objects.all().values_list(*cols)

            ## get top 100 values.
            cls.objects.all()[:10].values_list(*cols)

        )
        return pd.DataFrame(list(qs),columns=cols)


class AnalysisBmcOutput(models.Model):
    trsh = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    rnge = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    endpoint_name = models.TextField(blank=True, null=True)
    input_chembase = models.TextField(blank=True, null=True)
    plate_name = models.TextField(blank=True, null=True)
    lowest_conc = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    highest_conc = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    n_conc = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mean_conc_spacing = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    max_resp_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    min_resp_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    ncorrected_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    emax_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    slope_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    auc_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    wauc_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    wauc_prev_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    ec50_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    emax_ciu = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    slope_ciu = models.TextField(blank=True, null=True)
    auc_ciu = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    wauc_ciu = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    wauc_prev_ciu = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    ec50_ciu = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    pod_ciu = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    emax_cil = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    slope_cil = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    auc_cil = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    wauc_cil = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    wauc_prev_cil = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    ec50_cil = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    pod_cil = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    n_curves = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    hit_confidence = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    embryo_type = models.TextField(blank=True, null=True)
    protocol_id = models.IntegerField(blank=True, null=True)
    substance_id = models.IntegerField(blank=True, null=True)
    # input = models.ForeignKey('AnalysisInputKey', models.DO_NOTHING, unique=True, blank=True, null=True)
    input_id = models.IntegerField(blank=True,  primary_key=True)
    screen_hours = models.IntegerField(blank=True,  primary_key=True)
    endpoint_name_only = models.TextField(blank=True, null=True)


    class Meta:
        managed = False
        db_table = 'analysis_bmc_output'


class AnalysisInputKey(models.Model):
    input_chembase = models.TextField(blank=True, null=True)
    endpoint_name = models.TextField(blank=True, null=True)
    input_id = models.AutoField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'analysis_input_key'


class SeazitDose(models.Model):
    dose = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    dose_unit = models.TextField(blank=True, null=True)
    protocol_source = models.TextField(blank=True, null=True)
    dose_id = models.AutoField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'seazit_dose'

    @classmethod
    def get_doses(self):
        cols = (
            "dose",
            "dose_unit",
            "protocol_source",
            "dose_id",
        )
        qs = (
            SeazitDose.objects.all().values_list(*cols)
        )

        # print (pd.DataFrame(list(qs), columns=cols).to_dict(orient="records"))
        # return pd.DataFrame(list(qs), columns=cols)
        return {
            "data": pd.DataFrame(list(qs), columns=cols).to_dict(orient="records"),
            # "substances": Substance.get_flat().to_dict(orient="records"),
            # "substances": SeazitProtocol.get_flat().to_dict(orient="records"),
        }



class SeazitPlateScreen(models.Model):
    plate_map_name = models.TextField(blank=True, null=True)
    plate_screen_time_end = models.DateTimeField(blank=True, null=True)
    plate_name = models.TextField(blank=True, null=True)
    plate_screen_id = models.AutoField(primary_key=True)
    hour_post_fertilization = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'seazit_plate_screen'


class SeazitProtocol(models.Model):
    protocol_name = models.TextField(blank=True, null=True)
    protocol_type = models.TextField(blank=True, null=True)
    protocol_source = models.TextField(blank=True, null=True)
    seazit_protocol_id = models.AutoField(primary_key=True)

    def __str__(self):
        return self.protocol

    @classmethod
    def get_metadata(self):
        cols = (
            "protocol_name",
            "protocol_type",
            "protocol_source",
            "seazit_protocol_id",
        )
        qs = (
            SeazitProtocol.objects.all().values_list(*cols)
        )

        return {
            "protocol_data": pd.DataFrame(list(qs), columns=cols).to_dict(orient="records"),
            # "readouts": pd.DataFrame(list(qs), columns=cols).to_dict(orient="records"),
            # "substances": Substance.get_flat().to_dict(orient="records"),
            # "AnalysisBmcInput": AnalysisBmcInput.get_flat().to_dict(orient="records"),
            "Seazit_readout_result": Seazit_readout_result.get_flat().to_dict(orient="records"),
            "Seazit_chemical_info": Seazit_chemical_info.get_chemicals().to_dict(orient="records"),
            "Seazit_ui_panel": Seazit_ui_panel.get_flat().to_dict(orient="records"),
        }

    class Meta:
        managed = False
        db_table = 'seazit_protocol'


class SeazitRecording(models.Model):
    hour_post_fertilization = models.IntegerField(blank=True, null=True)
    recording_name = models.TextField(blank=True, null=True)
    protocol_source = models.TextField(blank=True, null=True)
    seazit_recording_id = models.AutoField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'seazit_recording'


class SeazitSubstance(models.Model):
    substance_name_by_lab = models.TextField(blank=True, null=True)
    substance_type = models.TextField(blank=True, null=True)
    substance_lab = models.TextField(blank=True, null=True)
    substance_code = models.ForeignKey('SeazitSubstanceMapping', models.DO_NOTHING, db_column='substance_code', blank=True, null=True)
    seazit_substance_id = models.AutoField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'seazit_substance'


class SeazitSubstanceMapping(models.Model):
    substance_code = models.TextField(primary_key=True)
    casrn = models.TextField(blank=True, null=True)
    stock_conc_mm = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    supplier = models.TextField(blank=True, null=True)
    lot_number = models.TextField(blank=True, null=True)
    coa_purity = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    determined_purity = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    dtxsid = models.TextField(blank=True, null=True)
    preferred_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'seazit_substance_mapping'


class SeazitTest(models.Model):
    students_name = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'seazit_test'


class SeazitWell(models.Model):
    well_position = models.TextField(blank=True, null=True)
    well_recording_value = models.TextField(blank=True, null=True)
    keep_well_data = models.TextField(blank=True, null=True)
    keep_well_recording = models.TextField(blank=True, null=True)
    is_empty_well = models.TextField(blank=True, null=True)
    image_filename = models.TextField(blank=True, null=True)
    embryo_type = models.TextField(blank=True, null=True)
    protocol_id = models.IntegerField(blank=True, null=True)
    plate_screen_id = models.IntegerField(blank=True, null=True)
    dose_id = models.IntegerField(blank=True, null=True)
    recording_id = models.IntegerField(blank=True, null=True)
    substance_id = models.IntegerField(blank=True,  primary_key=True)

    class Meta:
        managed = False
        db_table = 'seazit_well'


class Readout(models.Model):
    input_chembase = models.TextField(blank=True, null=True)
    substance_name_by_lab = models.TextField(blank=True, null=True)
    plate_name = models.TextField(blank=True, null=True)
    dose_id = models.IntegerField(blank=True, null=True)
    endpoint_name = models.TextField(blank=True, null=True)
    n = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    n_in = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    embryo_type = models.TextField(blank=True, null=True)
    protocol_id = models.IntegerField(blank=True, null=True)
    substance_id = models.IntegerField(blank=True, null=True)
    # input_id = models.ForeignKey('AnalysisInputKey', models.DO_NOTHING, blank=True, null=True)
    input_id = models.IntegerField(blank=True,  primary_key=True)
    screen_hours = models.IntegerField(blank=True, null=True)
    endpoint_name_only = models.TextField(blank=True, null=True)


    # def __str__(self):
    #     return self.input_id

    class Meta:
        managed = False
        db_table = 'analysis_bmc_input'



#TODO
## this substance function = bmc input function. we may conbime them later
class Substance(models.Model):
    input_chembase = models.TextField(blank=True, null=True)
    substance_name_by_lab = models.TextField(blank=True, null=True)
    plate_name = models.TextField(blank=True, null=True)
    dose_id = models.IntegerField(blank=True, null=True)
    endpoint_name = models.TextField(blank=True, null=True)
    n = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    n_in = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    embryo_type = models.TextField(blank=True, null=True)
    protocol_id = models.IntegerField(blank=True, null=True)
    substance_id = models.IntegerField(blank=True, null=True)
    # input_id = models.ForeignKey('AnalysisInputKey', models.DO_NOTHING, blank=True, null=True)
    input_id = models.IntegerField(blank=True,  primary_key=True)
    screen_hours = models.IntegerField(blank=True, null=True)
    endpoint_name_only = models.TextField(blank=True, null=True)


    # def __str__(self):
    #     return self.input_id

    class Meta:
        managed = False
        db_table = 'analysis_bmc_input'

    @classmethod
    def get_flat(cls):


        cols = (
            "input_chembase",
            "endpoint_name",
            "protocol_id",
            "substance_id",
            "input_id",
        )
        qs = (
            ## the query all takes 10 second, too long. TODO
            # cls.objects.all().values_list(*cols)
            ## get top 100 values.
            cls.objects.all()[:10].values_list(*cols)

            ## filter let protocol_id = 1
        )
        return pd.DataFrame(list(qs),columns=cols)




class Seazit_chemical_info(models.Model):

    substance_name_by_lab = models.TextField(blank=True, null=True)
    substance_type = models.IntegerField(blank=True, null=True)
    substance_lab = models.TextField(blank=True, null=True)
    substance_code = models.TextField(blank=True, null=True)
    seazit_substance_id = models.IntegerField(blank=True, null=True)
    casrn = models.TextField(blank=True, null=True)

    stock_conc_mm = models.FloatField(blank=True, null=True)
    supplier = models.TextField(blank=True, null=True)
    lot_number = models.TextField(blank=True, null=True)
    coa_purity = models.FloatField(blank=True, null=True)
    determined_purity = models.FloatField(blank=True, null=True)

    dtxsid = models.TextField(blank=True, null=True)
    preferred_name = models.TextField(blank=True, null=True)



    # def __str__(self):
    #     return self.input_id

    class Meta:
        managed = False
        db_table = 'mvw_seazit_chemical_info'

    @classmethod
    def get_flat(cls):
        cols = (
            "substance_name_by_lab",
            "substance_type",
            "substance_lab",
            "substance_code",
            "seazit_substance_id",
            "casrn",
            "stock_conc_mm",
            "supplier",
            "lot_number",
            "coa_purity",
            "determined_purity",
            "dtxsid",
            "preferred_name",
        )
        qs = (
            cls.objects.all().values_list(*cols)
        )
        return pd.DataFrame(list(qs),columns=cols)


    @classmethod
    def get_chemicals(cls):
        cols = (
            "preferred_name",
            "casrn",
        )
        qs = (
            cls.objects.all().values_list(*cols).distinct()
        )
        return pd.DataFrame(list(qs),columns=cols)

class Seazit_readout_result(models.Model):

    input_chembase = models.TextField(blank=True, null=True)
    substance_name_by_lab = models.TextField(blank=True, null=True)
    plate_name = models.TextField(blank=True, null=True)
    dose_id = models.IntegerField(blank=True, null=True)
    endpoint_name = models.TextField(blank=True, null=True)
    protocol_name = models.TextField(blank=True, null=True)
    endpoint_name_only = models.TextField(blank=True, null=True)
    n = models.FloatField(blank=True, null=True)
    n_in = models.FloatField(blank=True, null=True)
    embryo_type = models.TextField(blank=True, null=True)
    protocol_id = models.IntegerField(blank=True, null=True)
    substance_id = models.IntegerField(blank=True, null=True)
    input_id = models.IntegerField(blank=True, null=True)
    endpoint_name_only = models.TextField(blank=True, null=True)
    dose = models.FloatField(blank=True, null=True)
    dose_unit = models.TextField(blank=True, null=True)
    protocol_source = models.TextField(blank=True, null=True)
    plate_map_name = models.TextField(blank=True, null=True)
    plate_screen_time_end = models.DateTimeField(auto_now_add=True)
    plate_screen_id = models.IntegerField(blank=True, null=True)
    hour_post_fertilization = models.IntegerField(blank=True, null=True)
    substance_type = models.TextField(blank=True, null=True)
    substance_lab = models.TextField(blank=True, null=True)
    substance_code = models.TextField(blank=True, null=True)
    seazit_substance_id = models.IntegerField(blank=True, null=True)
    casrn = models.TextField(blank=True, null=True)
    stock_conc_mm = models.FloatField(blank=True, null=True)
    supplier = models.TextField(blank=True, null=True)
    lot_number = models.TextField(blank=True, null=True)
    coa_purity = models.FloatField(blank=True, null=True)
    determined_purity = models.FloatField(blank=True, null=True)
    dtxsid = models.TextField(blank=True, null=True)
    preferred_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mvw_seazit_readout_result'

    @classmethod
    def get_flat(cls):
        cols = (
            "input_chembase",
            "substance_name_by_lab",
            "plate_name",
            "dose_id",
            "endpoint_name",
            "n",
            "n_in",
            "embryo_type",
            "protocol_id",
            "substance_id",
            "input_id",
            "endpoint_name_only",
            "dose",
            "dose_unit",
            "protocol_source",
            "plate_map_name",
            "plate_screen_time_end",
            "plate_screen_id",
            "hour_post_fertilization",
            "substance_type",
            "substance_lab",
            "substance_code",
            "seazit_substance_id",
            "casrn",
            "stock_conc_mm",
            "supplier",
            "lot_number",
            "coa_purity",
            "determined_purity",
            "dtxsid",
            "preferred_name",
        )
        qs = (
            cls.objects.all()[:10].values_list(*cols)
        )
        return pd.DataFrame(list(qs),columns=cols)

    @classmethod
    def dose_responses(cls, protocol_ids, readout_ids, chemical_ids):


        cols = (
                "endpoint_name",
                "casrn",
                "input_chembase",
                "substance_name_by_lab",
                "plate_name",
                "dose_id",
                "n",
                "n_in",
                "embryo_type",
                "protocol_id",
                "substance_id",
                "input_id",
                "endpoint_name_only",
                "dose",
                "dose_unit",
                "protocol_source",
                "plate_map_name",
                "plate_screen_time_end",
                "plate_screen_id",
                "hour_post_fertilization",
                "substance_type",
                "substance_lab",
                "substance_code",
                "seazit_substance_id",
                "stock_conc_mm",
                "supplier",
                "lot_number",
                "coa_purity",
                "determined_purity",
                "dtxsid",
                "preferred_name",
            )
        dr = (
            cls.objects.filter(
                # readout__in=readout_ids, well__substance__chemical__in=chemical_ids)
                protocol_id__in=protocol_ids , endpoint_name__in=readout_ids, casrn__in=chemical_ids)
                # .select_related("readout", "substance", "substance__chemical")
                .values(*cols)
        )
        print ("3+++++++")
        print (protocol_ids)
        print (readout_ids)
        print (chemical_ids)
        df =  pd.DataFrame(list(dr))
        input_ids = set(df['input_id'].tolist())


        cols = (
                "trsh",
                "rnge",
                "endpoint_name",
                "input_chembase",
                "plate_name",
                "lowest_conc",
                "highest_conc",
                "n_conc",
                "mean_conc_spacing",
                "max_resp_med",
                "min_resp_med",
                "ncorrected_med",
                "emax_med",
                "slope_med",
                "auc_med",
                "wauc_med",
                "wauc_prev_med",
                "ec50_med",
                "pod_med",
                "emax_ciu",
                "slope_ciu",
                "auc_ciu",
                "wauc_ciu",
                "wauc_prev_ciu",
                "ec50_ciu",
                "pod_ciu",
                "emax_cil",
                "slope_cil",
                "auc_cil",
                "wauc_cil",
                "wauc_prev_cil",
                "ec50_cil",
                "pod_cil",
                "n_curves",
                "hit_confidence",
                "embryo_type",
                "protocol_id",
                "substance_id",
                "input_id",
                "screen_hours",
                "endpoint_name_only"
        )
        analysisbmcoutput = (
            AnalysisBmcOutput.objects.filter(
                input_id__in=input_ids
            )
            .values(*cols)
        )
        return dict(dose_response=list(dr), bmcoutput=list(analysisbmcoutput))


class Seazit_ui_panel(models.Model):

    protocol_name = models.TextField(blank=True, null=True)
    seazit_protocol_id = models.IntegerField(blank=True, null=True)
    endpoint_name = models.TextField(blank=True, null=True)
    endpoint_name_only = models.TextField(blank=True, null=True)



    # def __str__(self):
    #     return self.input_id

    class Meta:
        managed = False
        db_table = 'mvw_seazit_ui_panel'

    @classmethod
    def get_flat(cls):
        cols = (
            "protocol_name",
            "seazit_protocol_id",
            "endpoint_name",
            "endpoint_name_only",
        )
        qs = (
            cls.objects.all().values_list(*cols)
        )
        return pd.DataFrame(list(qs),columns=cols)

