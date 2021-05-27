from django.contrib import admin

from . import forms


# this is a singleton
site = admin.site

site.login_form = forms.LoginForm
site.site_header = 'NTP Sandbox Administration'
site.site_title = 'NTP Sandbox Admin'
