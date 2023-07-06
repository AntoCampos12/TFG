from django.contrib.auth.models import User
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class Actualizar(models.Model):
    actualizar = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(1)])

class Liga(models.Model):
    name = models.CharField(max_length= 25)
    public = models.BooleanField(default=True)
    password = models.CharField(max_length=25, null= True ,blank= True)
    active = models.BooleanField(default=False)
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


OPCIONES_POSICION = (
    ("POR", "PORTERO"),
    ("LI", "LATERAL IZQUIERDO"),
    ("LD", "LATERAL DERECHO"),
    ("DFCD", "DEFENSA CENTRAL DERECHO"),
    ("DFCI", "DEFENSA CENTRAL IZQUIERDO"),
    ("MCD", "CENTROCAMPISTA DEFENSIVO"),
    ("MI", "CENTROCAMPISTA IZQUIERDO"),
    ("MD", "CENTROCAMPISTA DERECHO"),
    ("DC", "DELANTERO CENTRO"),
    ("EI", "EXTREMO IZQUIERDO"),
    ("ED", "EXTREMO DERECHO"),
    ("SUS", "BANQUILLO")
)

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

    posicion = models.CharField(
        max_length=50, choices=OPCIONES_POSICION, default="SUS"
    )

class Exchange(models.Model):
    usuario_ofrece = models.ForeignKey(
        Equipos, on_delete= models.CASCADE, related_name="usuario_ofrece"
    )
    usuario_recibe = models.ForeignKey(
        Equipos, on_delete= models.CASCADE, related_name="usuario_recibe"
    )
    jugadores_ofrece = models.ManyToManyField(Jugador, related_name="jugadores_ofrece+")
    jugadores_recibe = models.ManyToManyField(Jugador, related_name="jugadores_recibe+")
    



