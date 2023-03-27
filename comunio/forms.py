from django import forms

class LigaForm(forms.Form):
    nombreEquipo = forms.CharField(max_length=25)
    nombreLiga = forms.CharField(max_length=25)
    isPublic = forms.CharField(max_length=25)
    password = forms.CharField(max_length=25)

class JoinForm(forms.Form):
    nombreEquipo = forms.CharField(max_length=25)
    nombreLiga = forms.CharField(max_length=25)
    password = forms.CharField(max_length=25)