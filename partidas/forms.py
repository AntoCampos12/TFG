from django import forms
from authentication.models import Jugador

CHOICES = [(j.pk,j) for j in Jugador.objects.all()]

class FichajeForm(forms.Form):
    jugador = forms.CharField(max_length=100)
    equipo = forms.CharField(max_length=100)
    equipoJugador = forms.CharField(max_length=25)

class ExchangeForm(forms.Form):
    ofrece = forms.IntegerField()
    recibe = forms.IntegerField()
    jofrece = forms.MultipleChoiceField(choices=CHOICES)
    jrecibe = forms.MultipleChoiceField(choices=CHOICES)
