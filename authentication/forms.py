from django import forms

class UserForm(forms.Form):
    username = forms.CharField(max_length= 25)
    email = forms.CharField(max_length=25)
    first_name = forms.CharField(max_length=25)
    last_name = forms.CharField(max_length=25)
    password = forms.CharField(max_length=25)
    password2 = forms.CharField(max_length=25)

class AuthenticateForm(forms.Form):
    username = forms.CharField(max_length=25)
    password = forms.CharField(max_length=25)