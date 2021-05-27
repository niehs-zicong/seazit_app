from django.contrib.admin.forms import AdminAuthenticationForm


class LoginForm(AdminAuthenticationForm):
    # disable password autocomplete for login form

    def __init__(self, request=None, *args, **kwargs):
        super().__init__(request=None, *args, **kwargs)
        self.fields['password'].widget.attrs['autocomplete'] = 'off'
