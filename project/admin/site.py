from django.contrib import admin

from . import forms


# this is a singleton
site = admin.site

site.login_form = forms.LoginForm
site.site_header = 'NTP SEAZIT Administration'
site.site_title = 'NTP SEAZIT Admin'
