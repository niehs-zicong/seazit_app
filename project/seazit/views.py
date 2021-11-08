#from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader
from django.db.models import F, Q
from django.views.generic import TemplateView
from django.core import serializers
from json import dumps
from rest_framework.response import Response
from django.template.response import TemplateResponse

from django.shortcuts import render
from json import dumps
from django.http import JsonResponse
from . import models, serializers
from .models import SeazitWell, AnalysisBmcInput, AnalysisBmcOutput
import pandas as pd
from json import dumps



from django.views.generic import TemplateView


class SeazitTemplateView(TemplateView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["active_view_name"] = self.active_view_name
        return context


class Home(SeazitTemplateView):
    template_name = "seazit/home.html"
    active_view_name = "home"


class Resources(SeazitTemplateView):
    template_name = "seazit/resources.html"
    active_view_name = "resources"

class SeazitCR(SeazitTemplateView):
    template_name = "seazit/seazit_cr.html"
    active_view_name = "seazit_cr"


class SeazitCR3(SeazitTemplateView):
    template_name = "seazit/seazit_cr3.html"
    active_view_name = "seazit_cr3"


def seazit_cr2(request):
    # assy input
    id = 1

    ## endpoint input.
    endpoint = 0
    #####
    #  substance code. in  table : seazit_substance_mapping,  get casn data, substance_code, preferred_name(chemicals)
    code = 1825

    # code = 1036
    deselect_cols = ("dose_id", "plate_map_name")

    cols = (
        "dose",
        "dose_unit",
        "protocol_source",
        "dose_id",
    )
    qs =  models.SeazitDose.objects.all().values_list(*cols)
    dosed = pd.DataFrame(list(qs), columns=cols)
    # print ('dosed')
    # print (dosed)


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
        "screen_hours",
        "endpoint_name_only"
    )
    qs =  models.AnalysisBmcInput.objects.filter(protocol_id=id).values_list(*cols)
    inputd = pd.DataFrame(list(qs), columns=cols).rename(columns={"screen_hours": "hour_post_fertilization"})


    cols = (
        "plate_map_name",
        "plate_screen_time_end",
        "plate_name",
        "plate_screen_id",
        "hour_post_fertilization",

    )
    qs =  models.SeazitPlateScreen.objects.all().values_list(*cols)
    plated = pd.DataFrame(list(qs), columns=cols)
    # print ("plated")
    # print (plated)

    inputd = (inputd.merge(dosed, on='dose_id', how='left')
                            .merge(plated, on=("plate_name", "hour_post_fertilization"), how='left')
              )
    result = (inputd.merge(dosed, on='dose_id', how='left')
                            .merge(plated, on=("plate_name", "hour_post_fertilization"), how='left')
              )
    # print ("result")
    # print (result)


##  get_substances  function part.
    cols = (
        "substance_name_by_lab",
        "substance_type",
        "substance_lab",
        "substance_code",
        "seazit_substance_id",
    )
    # qs =  models.SeazitSubstance.objects.all().values_list(*cols)
    # sub = pd.DataFrame(list(qs), columns=cols)

    qs =  models.SeazitSubstance.objects.filter(substance_code = "1825").values_list(*cols)
    sub = pd.DataFrame(list(qs), columns=cols)

    # print ("sub")
    # print (sub)

    cols = (
        "substance_code",
        # casrn info
        "casrn",
        "stock_conc_mm",
        "supplier",
        "lot_number",
        "coa_purity",
        "determined_purity",
        "dtxsid",
        # this is the chemical input for coulmns
        "preferred_name",
    )
    # qs =  models.SeazitSubstanceMapping.objects.all().values_list(*cols)
    # sub_map = pd.DataFrame(list(qs), columns=cols)

    qs =  models.SeazitSubstanceMapping.objects.filter(substance_code = "1825").values_list(*cols)
    sub_map = pd.DataFrame(list(qs), columns=cols)

    # print ("sub_map")
    # print (sub_map)

    get_substances_result = (sub.merge(sub_map, on='substance_code', how='left')
                                                 .rename(columns={"seazit_substance_id": "substance_id"})
              )
    # print ("get_substances_result")
    # print (get_substances_result)

    get_substances_result = get_substances_result[["substance_id", "substance_code"]]
    # print("result")
    # print(result)
    # print("get_substances_result")
    # print(get_substances_result)

    result = (result.merge(get_substances_result, on='substance_id', how='left'))
    result = (result[result['substance_code'] == str(code)])
    d1825 = result
    print ("d1825")
    print(d1825)
    # pd.set_option('display.max_columns', None)
    # # print(result.head(1))
    # result = result.head(1).to_json(orient='index')

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
    )
    qs = models.AnalysisBmcOutput.objects.filter(protocol_id=id).values_list(*cols)
    outputd = pd.DataFrame(list(qs), columns=cols) \
        .rename(columns={"screen_hours": "hour_post_fertilization"})
    #

    result = outputd
    #
    # print("outputd")
    # print(outputd)

    ## get substance part
    cols = (
        "substance_name_by_lab",
        "substance_type",
        "substance_lab",
        "substance_code",
        "seazit_substance_id",
    )
    qs = models.SeazitSubstance.objects.all().values_list(*cols)
    sub = pd.DataFrame(list(qs), columns=cols)

    cols = (
        "substance_code",
        "casrn",
        "stock_conc_mm",
        "supplier",
        "lot_number",
        "coa_purity",
        "determined_purity",
        "dtxsid",
        "preferred_name",
    )
    qs = models.SeazitSubstanceMapping.objects.all().values_list(*cols)
    sub_map = pd.DataFrame(list(qs), columns=cols)

    get_substances_result = (sub.merge(sub_map, on='substance_code', how='left')
                             .rename(columns={"seazit_substance_id": "substance_id"})
                             )

    bmcd = (result.merge(get_substances_result, on='substance_id', how='left'))
    print("bmcd")
    print(bmcd)
    bmcf = (bmcd.merge(d1825, on='input_id', how='left'))

    # tihs part is semi join.
    bmcf = bmcd[bmcd.input_id.isin(d1825.input_id)]

    print("bmcf")
    print(bmcf)
    # pd.set_option('display.max_columns', None)
    # print(d1825.head(5))
    # print(bmcd.head(5))
    # print(bmcf.head(5))


    # pd.set_option('display.max_columns', None)
    # # print(result.head(1))
    # result = result.head(1).to_json(orient='index')
    # bmcf = d1825.semijoin
    # return HttpResponse('hello')


    return render(request, "seazit/seazit_cr2.html", context = {'data': bmcf.head(5)})

def seazit_cr(request):
    # assy input
    cols = (
        "preferred_name",
        "casrn",
    )
    qs =  models.Seazit_chemical_info.objects.all().values_list(*cols).distinct()
    data = pd.DataFrame(list(qs), columns=cols)
    print(data)
    return render(request, "seazit/seazit_cr2.html", context = {'data': data})


def seazit_cr4(request):

    cols = (
        "protocol_name",
        "seazit_protocol_id",
        "endpoint_name",
        "endpoint_name_only",
    )
    qs =  models.Seazit_ui_panel.objects.all().values_list(*cols)
    data = pd.DataFrame(list(qs), columns=cols)
    print (data)
    return render(request, "seazit/seazit_cr4.html", context = {'data': data})


