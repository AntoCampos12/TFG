from django.contrib.auth.models import User
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class Liga(models.Model):
    name = models.CharField(max_length= 25)
    public = models.BooleanField(default=True)
    password = models.CharField(max_length=25, null= True ,blank= True)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE
    )

class Equipos(models.Model):
    name = models.CharField(max_length=25)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE
    )
    liga = models.ForeignKey(
        Liga, on_delete=models.CASCADE
    )
    presupuesto = models.IntegerField(
        default = 150000000
    )

    actualizar = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(1)])

    puntuacion = models.FloatField(
        default= 0.0
    )

class Jugador(models.Model):
    nombre = models.CharField(max_length=100)
    equipo = models.CharField(max_length=100)
    foto = models.CharField(max_length=100, default="noProcede")
    posicion = models.CharField(max_length=100, default="banquillo")
    rating = models.FloatField(default=0.00)

class Jornada(models.Model):
    jugador = models.ForeignKey(
        Jugador, on_delete=models.CASCADE
    )
    rating = models.FloatField(default=0.00)
    jornada = models.IntegerField(default=0) 

class EquipoJugador(models.Model):
    liga = models.ForeignKey(
        Liga, on_delete=models.CASCADE
    )
    equipo = models.ForeignKey(
        Equipos, on_delete=models.CASCADE, null=True, blank= True
    )
    jugador = models.ForeignKey(
        Jugador, on_delete=models.CASCADE
    )
    



