from django import forms

class FichajeForm(forms.Form):
    jugador = forms.CharField(max_length=100)
    equipo = forms.CharField(max_length=100)
    equipoJugador = forms.CharField(max_length=25)
