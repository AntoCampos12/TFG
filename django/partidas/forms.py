from django import forms
from authentication.models import Jugador



class FichajeForm(forms.Form):
    jugador = forms.CharField(max_length=100)
    equipo = forms.CharField(max_length=100)
    equipoJugador = forms.CharField(max_length=25)

CHOICES = [(j.pk,j) for j in Jugador.objects.all()]

class ExchangeForm(forms.Form):
    ofrece = forms.IntegerField()
    recibe = forms.IntegerField()
    jofrece = forms.MultipleChoiceField(choices=CHOICES)
    jrecibe = forms.MultipleChoiceField(choices=CHOICES)

class LigaForm(forms.Form):
    nombreEquipo = forms.CharField(max_length=25)
    nombreLiga = forms.CharField(max_length=25)
    isPublic = forms.CharField(max_length=25)
    password = forms.CharField(max_length=25)

class JoinForm(forms.Form):
    nombreEquipo = forms.CharField(max_length=25)
    nombreLiga = forms.CharField(max_length=25)
    password = forms.CharField(max_length=25)
