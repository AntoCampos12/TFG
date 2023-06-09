from django.contrib import admin
from .models import Actualizar, Liga, Equipos, Jugador, EquipoJugador, Jornada, Exchange

class JugadorAdmin(admin.ModelAdmin):
    search_fields = [
        "nombre",
        "equipo",    
    ]

    list_display = [
        "nombre",
        "equipo",
        "posicion",
        "rating"
    ]

class JornadaAdmin(admin.ModelAdmin):
    model = Jornada
    search_fields = [
        "jugador__equipo"    
    ]

    list_display = [
        "get_nombre",
        "rating",
    ]

    def get_nombre(self, obj):
        return obj.jugador.nombre
    

admin.site.register(Exchange)
admin.site.register(Liga)
admin.site.register(Jugador, JugadorAdmin)
admin.site.register(Equipos)
admin.site.register(EquipoJugador)
admin.site.register(Jornada, JornadaAdmin)
admin.site.register(Actualizar)
