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
    input_id = models.IntegerField(blank=True, primary_key=True)
    screen_hours = models.IntegerField(blank=True, null=True)
    endpoint_name_only = models.TextField(blank=True, null=True)

    # def __str__(self):
    #     return self.input_id

    class Meta:
        managed = False
        db_table = 'analysis_bmc_input'


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
    # slope_ciu = models.TextField(blank=True, null=True)
    slope_ciu = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
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
    input_id = models.IntegerField(blank=True, primary_key=True)
    screen_hours = models.IntegerField(blank=True, primary_key=True)
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


class SeazitBmcMinMaxVw(models.Model):
    protocol_id = models.IntegerField(blank=True, null=True)
    endpoint_name = models.TextField(blank=True, null=True)
    dtxsid = models.TextField(blank=True, null=True)
    med_pod = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    min_pod = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    max_pod = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    med_hitconf = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    n_values = models.IntegerField(blank=True, null=True)
    mort_med_pod = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mort_min_pod = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mort_max_pod = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mort_med_hitconf = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mort_n_values = models.IntegerField(blank=True, null=True)
    casrn = models.TextField(blank=True, null=True)
    preferred_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'seazit_bmc_min_max_vw'


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
        return {
            "data": pd.DataFrame(list(qs), columns=cols).to_dict(orient="records"),

        }


class SeazitEndpointDescription(models.Model):
    endpoint_id = models.AutoField(primary_key=True)
    protocol_source = models.TextField(blank=True, null=True)
    endpoint_name = models.TextField(blank=True, null=True)
    hour_post_fertilization = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    endpoint_description = models.TextField(blank=True, null=True)

    # def __str__(self):
    #     return self.endpoint_name

    class Meta:
        managed = False
        # managed = True
        db_table = 'seazit_endpoint_description'

    # @classmethod
    # def get_flat(cls):
    #     cols = (
    #
    #         "endpoint_id",
    #         "protocol_source",
    #         "endpoint_name",
    #         "hour_post_fertilization",
    #         "endpoint_description",
    #     )
    #     qs = (
    #         cls.objects.all().values_list(*cols)
    #     )
    #     return pd.DataFrame(list(qs), columns=cols)


class SeazitOntology(models.Model):
    proposed_ontology_label = models.TextField(blank=True, null=True)
    ontology_id_number = models.TextField(blank=True, null=True)
    protocol_source = models.TextField(blank=True, null=True)
    recording_name = models.TextField(blank=True, null=True)
    hour_post_fertilization = models.IntegerField(blank=True, null=True)
    developmental_defect_catergories = models.TextField(blank=True, null=True)
    defects_mapped_to_body_region = models.TextField(blank=True, null=True)
    developmental_defect_grouping_granular = models.TextField(blank=True, null=True)
    developmental_defect_grouping_general = models.TextField(blank=True, null=True)
    seazit_recording_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'seazit_ontology'

    @classmethod
    def get_ontology(cls):
        cols = (

            "proposed_ontology_label",
            "ontology_id_number",
            "protocol_source",
            "recording_name",
            "hour_post_fertilization",
            "developmental_defect_catergories",
            "defects_mapped_to_body_region",
            "developmental_defect_grouping_granular",
            "developmental_defect_grouping_general",
            "seazit_recording_id",
        )
        qs = (
            cls.objects.all().values_list(*cols)
        )
        return pd.DataFrame(list(qs), columns=cols)

    @classmethod
    def get_sankey(cls):
        return {
            "Seazit_ontology_sankey_nodes": SeazitOntologySankeyNodes.get_nodes().to_dict(orient="records"),
            "Seazit_ontology_sankey_flow": SeazitOntologySankeyFlow.get_flow().to_dict(orient="records"),
            "Seazit_ontology": SeazitOntology.get_ontology().to_dict(orient="records"),
        }


class SeazitOntologySankeyFlow(models.Model):
    flow = models.TextField(blank=True, null=True)
    top_level = models.TextField(blank=True, null=True)
    flow_color = models.TextField(blank=True, null=True)
    source_name = models.TextField(blank=True, null=True)
    target_name = models.TextField(blank=True, null=True)
    source_id = models.IntegerField(blank=True, null=True)
    target_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'seazit_ontology_sankey_flow'

    @classmethod
    def get_flow(cls):
        cols = (
            "flow",
            "top_level",
            "flow_color",
            "source_name",
            "target_name",
            "source_id",
            "target_id",
        )
        qs = (
            cls.objects.all().values_list(*cols)
        )
        return pd.DataFrame(list(qs), columns=cols)


class SeazitOntologySankeyNodes(models.Model):
    node_id = models.IntegerField(blank=True, null=True)
    node = models.TextField(blank=True, null=True)
    node_level = models.TextField(blank=True, null=True)
    node_color = models.TextField(blank=True, null=True)
    node_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'seazit_ontology_sankey_nodes'

    @classmethod
    def get_nodes(cls):
        cols = (
            "node_id",
            "node",
            "node_level",
            "node_color",
            "node_name",
        )
        qs = (
            cls.objects.all().values_list(*cols)
        )

        return pd.DataFrame(list(qs), columns=cols)


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
    lab_anonymous_code = models.TextField(blank=True, null=True)
    study_phase = models.TextField(blank=True, null=True)
    test_condition = models.TextField(blank=True, null=True)
    protocol_name_long = models.TextField(blank=True, null=True)
    protocol_name_plot = models.TextField(blank=True, null=True)

    # def __str__(self):
    #     return self.protocol_name

    @classmethod
    def get_metadata(self):
        cols = (
            "protocol_name",
            "protocol_type",
            "protocol_source",
            "seazit_protocol_id",
            "lab_anonymous_code",
            "study_phase",
            "test_condition",
            "protocol_name_long",
            "protocol_name_plot",
        )
        qs = (
            SeazitProtocol.objects.all().values_list(*cols)
        )

        return {
            "protocol_data": pd.DataFrame(list(qs), columns=cols).to_dict(orient="records"),
            "Seazit_chemical_info": Seazit_chemical_info.get_chemicals().to_dict(orient="records"),
            "Seazit_ui_panel": Seazit_ui_panel.get_flat().to_dict(orient="records"),
            "Seazit_ontology": SeazitOntology.get_ontology().to_dict(orient="records"),
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


class SeazitSelectivity(models.Model):
    protocol_id = models.IntegerField(blank=True, null=True)
    endpoint_name = models.TextField(blank=True, null=True)
    casrn = models.TextField(blank=True, null=True)
    dtxsid = models.TextField(blank=True, null=True)
    preferred_name = models.TextField(blank=True, null=True)
    min_lowest_conc = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    max_highest_conc = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mean_pod = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mean_selectivity = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    med_mort_hit_confidence = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    n_rep_max_dev_call = models.IntegerField(blank=True, null=True)
    n_rep = models.IntegerField(blank=True, null=True)
    f_max_dev_call = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    final_dev_call = models.TextField(blank=True, null=True)
    malformation = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'seazit_selectivity'


class SeazitSubstance(models.Model):
    substance_name_by_lab = models.TextField(blank=True, null=True)
    substance_type = models.TextField(blank=True, null=True)
    substance_lab = models.TextField(blank=True, null=True)
    substance_code = models.TextField(blank=True, null=True)
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
    substance_id = models.IntegerField(blank=True, primary_key=True)

    class Meta:
        managed = False
        db_table = 'seazit_well'


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

    use_category1 = models.TextField(blank=True, null=True)
    use_category2 = models.TextField(blank=True, null=True)
    compound_name = models.TextField(blank=True, null=True)

    # def __str__(self):
    #     return self.input_id

    class Meta:
        managed = False
        db_table = 'mvw_seazit_chemical_info'

    @classmethod
    def get_chemicals(cls):
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
            "use_category1",
            "use_category2",
            "compound_name",
        )
        qs = (
            cls.objects.all().values_list(*cols).distinct()
        )
        return pd.DataFrame(list(qs), columns=cols)


class Seazit_readout_result(models.Model):
    input_chembase = models.TextField(blank=True, null=True)
    substance_name_by_lab = models.TextField(blank=True, null=True)
    plate_name = models.TextField(blank=True, null=True)
    dose_id = models.IntegerField(blank=True, null=True)
    endpoint_name = models.TextField(blank=True, null=True)
    n = models.FloatField(blank=True, null=True)
    n_in = models.FloatField(blank=True, null=True)
    embryo_type = models.TextField(blank=True, null=True)
    protocol_id = models.IntegerField(blank=True, null=True)
    substance_id = models.IntegerField(blank=True, null=True)
    input_id = models.IntegerField(blank=True, null=True)
    endpoint_name_only = models.TextField(blank=True, null=True)

    endpoint_name_protocol = models.TextField(blank=True, null=True)

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

    use_category1 = models.TextField(blank=True, null=True)
    use_category2 = models.TextField(blank=True, null=True)
    compound_name = models.TextField(blank=True, null=True)

    lab_anonymous_code = models.TextField(blank=True, null=True)
    # study_phase = models.TextField(blank=True, null=True)
    test_condition = models.TextField(blank=True, null=True)
    protocol_name_long = models.TextField(blank=True, null=True)
    protocol_name_plot = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mvw_seazit_readout_result'

    @classmethod
    def concentration_responses(cls, protocol_ids, readout_ids, chemical_ids):
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
            "endpoint_name_protocol",
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
            "use_category1",
            "use_category2",
            "compound_name",
            "lab_anonymous_code",
            "test_condition",
            "protocol_name_long",
            "protocol_name_plot",
        )
        dr = cls.objects.filter(
            protocol_id__in=protocol_ids, endpoint_name_protocol__in=readout_ids, casrn__in=chemical_ids
        ).values(*cols)
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
            "endpoint_name_only",
            "casrn",
            "dtxsid",
            "preferred_name",
            "use_category1",
            "use_category2",
            "compound_name",
            "substance_code",
            "lab_anonymous_code",
            "test_condition",
            "protocol_name_long",
            "protocol_name_plot",
            "endpoint_name_protocol",
        )
        analysisbmcoutput = Seazit_bmc_readout_result.objects.filter(
            protocol_id__in=protocol_ids, endpoint_name_protocol__in=readout_ids, casrn__in=chemical_ids
        ).values(*cols)

        return dict(dose_response=list(dr), bmcoutput=list(analysisbmcoutput))

    @classmethod
    def bmds_responses(cls, protocol_ids, readout_ids):
        cols = (
            "protocol_id",
            "endpoint_name",
            "casrn",
            "preferred_name",
            "use_category1",
            "dtxsid",
            "min_pod_med",
            "med_pod_med",
            "max_pod_med",
            "med_hitconf",
            "n_values",
            "mort_min_pod_med",
            "mort_med_pod_med",
            "mort_max_pod_med",
            "mort_med_hitconf",
            "mort_n_values",
            "min_lowest_conc",
            "max_highest_conc",
            "mean_pod",
            "mean_selectivity",
            "med_mort_hit_confidence",
            "n_rep_max_dev_call",
            "n_rep",
            "f_max_dev_call",
            "final_dev_call",
            "malformation",
            "combin_ontology",
            "combin_ontology_id",
            "endpoint_name_protocol",
            "lab_anonymous_code",
            "test_condition",
            "protocol_name_long",
            "protocol_name_plot",
        )
        bmdActivitySelectivity = Seazit_bmc_result.objects.filter(
            protocol_id__in=protocol_ids, endpoint_name_protocol__in=readout_ids
        ).values(*cols)

        return dict(
            bmd_activity_selectivity=list(bmdActivitySelectivity))

    @classmethod
    def integrative_responses(cls, protocol_ids, chemical_ids):
        cols = (
            "protocol_id",
            "endpoint_name",
            "casrn",
            "preferred_name",
            "use_category1",
            "dtxsid",
            "min_pod_med",
            "med_pod_med",
            "max_pod_med",
            "med_hitconf",
            "n_values",

            "mort_min_pod_med",
            "mort_med_pod_med",
            "mort_max_pod_med",
            "mort_med_hitconf",
            "mort_n_values",

            "min_lowest_conc",
            "max_highest_conc",
            "mean_pod",
            "mean_selectivity",
            "med_mort_hit_confidence",
            "n_rep_max_dev_call",
            "n_rep",
            "f_max_dev_call",
            "final_dev_call",
            "malformation",
            "endpoint_name_protocol",

            "combin_ontology",
            "combin_ontology_id",
            "protocol_source",
            "lab_anonymous_code",
            "study_phase",

            "test_condition",
            "protocol_name_long",
            "protocol_name_plot",

            "proposed_ontology_label",
            "ontology_id_number",
            "recording_name",
            "developmental_defect_catergories",
            "defects_mapped_to_body_region",
            "developmental_defect_grouping_granular",
            "developmental_defect_grouping_general",
            "seazit_recording_id",

        )

        integrativeActivitySelectivity = Seazit_integrative_result.objects.filter(
            protocol_id__in=protocol_ids, casrn__in=chemical_ids
        ).values(*cols)

        return dict(
            integrative_activity_selectivity=list(integrativeActivitySelectivity))


class Seazit_bmc_readout_result(models.Model):
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
    # slope_ciu = models.TextField(blank=True, null=True)
    slope_ciu = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
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
    input_id = models.IntegerField(blank=True, primary_key=True)
    screen_hours = models.IntegerField(blank=True, primary_key=True)
    endpoint_name_only = models.TextField(blank=True, null=True)
    casrn = models.TextField(blank=True, null=True)
    dtxsid = models.TextField(blank=True, null=True)
    preferred_name = models.TextField(blank=True, null=True)

    use_category1 = models.TextField(blank=True, null=True)
    use_category2 = models.TextField(blank=True, null=True)
    compound_name = models.TextField(blank=True, null=True)
    substance_code = models.TextField(blank=True, null=True)

    lab_anonymous_code = models.TextField(blank=True, null=True)
    test_condition = models.TextField(blank=True, null=True)
    protocol_name_long = models.TextField(blank=True, null=True)
    protocol_name_plot = models.TextField(blank=True, null=True)

    endpoint_name_protocol = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mvw_seazit_bmc_readout_result'


class Seazit_bmc_selectivity_result(models.Model):
    protocol_id = models.IntegerField(blank=True, null=True)
    endpoint_name = models.TextField(blank=True, null=True)
    casrn = models.TextField(blank=True, null=True)
    dtxsid = models.TextField(blank=True, null=True)
    preferred_name = models.TextField(blank=True, null=True)
    min_lowest_conc = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    max_highest_conc = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mean_pod = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mean_selectivity = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    med_mort_hit_confidence = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    n_rep_max_dev_call = models.IntegerField(blank=True, null=True)
    n_rep = models.IntegerField(blank=True, null=True)
    f_max_dev_call = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    final_dev_call = models.TextField(blank=True, null=True)
    malformation = models.TextField(blank=True, null=True)
    endpoint_name_protocol = models.TextField(blank=True, null=True)
    lab_anonymous_code = models.TextField(blank=True, null=True)
    test_condition = models.TextField(blank=True, null=True)
    protocol_name_long = models.TextField(blank=True, null=True)
    protocol_name_plot = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mvw_seazit_bmc_selectivity_result'


class Seazit_bmc_min_max(models.Model):
    protocol_id = models.IntegerField(blank=True, null=True)
    endpoint_name = models.TextField(blank=True, null=True)
    casrn = models.TextField(blank=True, null=True)
    preferred_name = models.TextField(blank=True, null=True)
    use_category1 = models.TextField(blank=True, null=True)
    dtxsid = models.TextField(blank=True, null=True)
    min_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    med_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    max_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    med_hitconf = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    n_values = models.BigIntegerField(blank=True, null=True)
    mort_min_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mort_med_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mort_max_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mort_med_hitconf = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mort_n_values = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mvw_seazit_bmc_min_max'


class Seazit_bmc_result(models.Model):
    protocol_id = models.IntegerField(blank=True, null=True)
    endpoint_name = models.TextField(blank=True, null=True)
    casrn = models.TextField(blank=True, null=True)
    preferred_name = models.TextField(blank=True, null=True)
    use_category1 = models.TextField(blank=True, null=True)
    dtxsid = models.TextField(blank=True, null=True)

    min_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    med_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    max_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    med_hitconf = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    n_values = models.BigIntegerField(blank=True, null=True)
    mort_min_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mort_med_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mort_max_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mort_med_hitconf = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mort_n_values = models.BigIntegerField(blank=True, null=True)

    min_lowest_conc = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    max_highest_conc = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mean_pod = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mean_selectivity = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    med_mort_hit_confidence = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    n_rep_max_dev_call = models.IntegerField(blank=True, null=True)
    n_rep = models.IntegerField(blank=True, null=True)
    f_max_dev_call = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    final_dev_call = models.TextField(blank=True, null=True)

    malformation = models.TextField(blank=True, null=True)
    combin_ontology = models.TextField(blank=True, null=True)
    combin_ontology_id = models.TextField(blank=True, null=True)

    endpoint_name_protocol = models.TextField(blank=True, null=True)
    protocol_source = models.TextField(blank=True, null=True)

    lab_anonymous_code = models.TextField(blank=True, null=True)
    test_condition = models.TextField(blank=True, null=True)
    protocol_name_long = models.TextField(blank=True, null=True)
    protocol_name_plot = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mvw_seazit_bmc_result'


class Seazit_ui_panel(models.Model):
    protocol_name = models.TextField(blank=True, null=True)
    protocol_source = models.TextField(blank=True, null=True)
    seazit_protocol_id = models.IntegerField(blank=True, null=True)
    study_phase = models.TextField(blank=True, null=True)
    test_condition = models.TextField(blank=True, null=True)
    protocol_name_long = models.TextField(blank=True, null=True)
    protocol_name_plot = models.TextField(blank=True, null=True)
    endpoint_name = models.TextField(blank=True, null=True)

    endpoint_name_only = models.TextField(blank=True, null=True)
    endpoint_name_protocol = models.TextField(blank=True, null=True)
    hour_post_fertilization = models.IntegerField(blank=True, null=True)
    endpoint_description = models.TextField(blank=True, null=True)

    developmental_defect_grouping_granular = models.TextField(blank=True, null=True)
    developmental_defect_grouping_general = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mvw_seazit_ui_panel'

    @classmethod
    def get_flat(cls):
        cols = (

            "protocol_name",
            "protocol_source",
            "seazit_protocol_id",
            "study_phase",
            "test_condition",
            "protocol_name_long",
            "protocol_name_plot",
            "endpoint_name",
            "endpoint_name_only",
            "endpoint_name_protocol",

            "hour_post_fertilization",
            "endpoint_description",
            "developmental_defect_grouping_granular",
            "developmental_defect_grouping_general",
        )
        qs = (
            cls.objects.all().values_list(*cols)
        )
        return pd.DataFrame(list(qs), columns=cols)


class Seazit_integrative_result(models.Model):
    protocol_id = models.IntegerField(blank=True, null=True)
    endpoint_name = models.TextField(blank=True, null=True)
    casrn = models.TextField(blank=True, null=True)
    preferred_name = models.TextField(blank=True, null=True)
    use_category1 = models.TextField(blank=True, null=True)
    dtxsid = models.TextField(blank=True, null=True)
    min_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    med_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    max_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    med_hitconf = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    n_values = models.BigIntegerField(blank=True, null=True)
    mort_min_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mort_med_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mort_max_pod_med = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mort_med_hitconf = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mort_n_values = models.BigIntegerField(blank=True, null=True)
    min_lowest_conc = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    max_highest_conc = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mean_pod = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    mean_selectivity = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    med_mort_hit_confidence = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    n_rep_max_dev_call = models.IntegerField(blank=True, null=True)
    n_rep = models.IntegerField(blank=True, null=True)
    f_max_dev_call = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    final_dev_call = models.TextField(blank=True, null=True)
    malformation = models.TextField(blank=True, null=True)
    endpoint_name_protocol = models.TextField(blank=True, null=True)
    combin_ontology = models.TextField(blank=True, null=True)
    combin_ontology_id = models.TextField(blank=True, null=True)
    protocol_source = models.TextField(blank=True, null=True)
    lab_anonymous_code = models.TextField(blank=True, null=True)
    study_phase = models.TextField(blank=True, null=True)
    test_condition = models.TextField(blank=True, null=True)
    protocol_name_long = models.TextField(blank=True, null=True)
    protocol_name_plot = models.TextField(blank=True, null=True)

    proposed_ontology_label = models.TextField(blank=True, null=True)
    ontology_id_number = models.TextField(blank=True, null=True)
    recording_name = models.TextField(blank=True, null=True)
    developmental_defect_catergories = models.TextField(blank=True, null=True)
    defects_mapped_to_body_region = models.TextField(blank=True, null=True)
    developmental_defect_grouping_granular = models.TextField(blank=True, null=True)
    developmental_defect_grouping_general = models.TextField(blank=True, null=True)
    seazit_recording_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mvw_seazit_integrative_result'
