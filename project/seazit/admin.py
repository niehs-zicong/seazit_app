from django.contrib import admin

# Register your models here.
from django.contrib import admin

from utils.admin import AllListFieldAdmin
from . import models


class AnalysisBmcInputAdmin(AllListFieldAdmin):
    pass


class SubstanceAdmin(AllListFieldAdmin):
    pass

class ReadoutAdmin(AllListFieldAdmin):
    pass

admin.site.register(models.AnalysisBmcInput, AnalysisBmcInputAdmin)
# admin.site.register(models.Readout, ReadoutAdmin)
# admin.site.register(models.Substance, SubstanceAdmin)
