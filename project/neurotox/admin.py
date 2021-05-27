from django.contrib import admin

from utils.admin import AllListFieldAdmin
from . import models


class AssayAdmin(AllListFieldAdmin):
    pass


class PlateAdmin(AllListFieldAdmin):
    pass


class ReadoutAdmin(AllListFieldAdmin):
    list_filter = ("protocol_id", "category")


class CategoryAdmin(AllListFieldAdmin):
    pass


class ChemicalAdmin(AllListFieldAdmin):
    search_fields = ("name", "casrn")
    list_filter = ("category_id",)


class SubstanceAdmin(AllListFieldAdmin):
    pass


class WellAdmin(AllListFieldAdmin):
    pass


class WellResponseAdmin(AllListFieldAdmin):
    pass


class HillAdmin(AllListFieldAdmin):
    pass


class CurvePAdmin(AllListFieldAdmin):
    pass


admin.site.register(models.Assay, AssayAdmin)
admin.site.register(models.Plate, PlateAdmin)
admin.site.register(models.Readout, ReadoutAdmin)
admin.site.register(models.Category, CategoryAdmin)
admin.site.register(models.Chemical, ChemicalAdmin)
admin.site.register(models.Substance, SubstanceAdmin)
admin.site.register(models.Well, WellAdmin)
admin.site.register(models.WellResponse, WellResponseAdmin)
admin.site.register(models.Hill, HillAdmin)
admin.site.register(models.CurveP, CurvePAdmin)
