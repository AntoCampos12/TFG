from django.http import JsonResponse
from django.shortcuts import render
from authentication.models import Liga, Jugador, EquipoJugador, Equipos, Jornada
from .forms import FichajeForm
from django.views.decorators.csrf import csrf_exempt
import random

PRECIOS_EQUIPOS = {'Girona': 0.5, 'Sevilla' : 0.80, 'Rayo Vallecano': 0.6, 'Real Sociedad': 0.85, 'Barcelona' : 1.00, 'Real Betis' : 0.80, 'Elche': 0.3, 'Villarreal':0.80, 'Valladolid': 0.4, 'Athletic Club':0.75, 'Cadiz': 0.4, 'Getafe': 0.4, 'Celta Vigo': 0.6, 'Espanyol': 0.5, 'FC Cartagena' : 0.2, 'Valencia': 0.4, 'Osasuna': 0.7, 'Atletico Madrid' : 0.85, 'Almeria': 0.4, 'Real Madrid': 1.00, 'Mallorca': 0.5}

def game(request, pk):
    return render(request,"index.html")

def ranking(request, pk):
    return render(request, "index.html")

def freeAgents(request, pk):
    jugadores = Jugador.objects.exclude(rating = 0.0).values()
    jugadores = list(jugadores)
    e = Equipos.objects.get(pk = pk)
    nagentes = 5 - EquipoJugador.objects.filter(liga = e.liga, equipo = None).count()
    for i in range(0,nagentes):
        j = random.choice(jugadores)
        j = Jugador.objects.get(pk = j["id"])
        ej = EquipoJugador(jugador=j,liga = e.liga)
        ej.save()
    aux = EquipoJugador.objects.filter(liga = e.liga, equipo = None).values()
    res = [e.presupuesto]
    for a in aux:
        j = Jugador.objects.get(pk = a["jugador_id"])
        res.append({"nombre": j.nombre,"foto": j.foto,"equipo":j.equipo,"rating":j.rating})
    return JsonResponse({'jugadores': res})

@csrf_exempt
def fichar(request):
    if request.method == 'POST':
        print(request.POST)
        form = FichajeForm(request.POST)
        if form.is_valid():
            j = Jugador.objects.get(nombre = request.POST['jugador'], equipo = request.POST['equipoJugador'])
            e = Equipos.objects.get(pk = request.POST['equipo'])
            e.presupuesto = e.presupuesto - j.rating*5000000*PRECIOS_EQUIPOS[j.equipo]
            e.save()
            ej = EquipoJugador.objects.get(jugador = j, liga = e.liga)
            ej.equipo = e
            ej.save()
    else:
        form = FichajeForm()
    return render(request,"index.html")

def getEquipoJugador(request, pk):
    e = Equipos.objects.get(pk = pk)
    j = EquipoJugador.objects.filter(equipo = e).values()
    res = [Jugador.objects.filter(pk = i['jugador_id']).values()[0] for i in j]
    return JsonResponse({"jugadores":res})

def getPuntuacion(request, pk):
    res = 0.00
    desglose = []
    e = Equipos.objects.get(pk = pk)
    j = EquipoJugador.objects.filter(equipo = e).values_list("jugador")
    jugadores = [Jugador.objects.get(pk = pk[0]) for pk in j]
    for i in jugadores:
        jugjor = Jornada.objects.filter(jugador = i).first()
        if jugjor != None:
            res = res + jugjor.rating
            desglose.append(i.nombre + " " +  str(jugjor.rating))
        
    return JsonResponse({"puntuacion":round(res,2), "desglose":desglose})

def getRank(request, pk):
    e = Equipos.objects.get(pk = pk)
    equipos = Equipos.objects.filter(liga = e.liga).values()
    return JsonResponse({"rank": list(equipos)})

def getEquipo(request, pk):
    e = Equipos.objects.get(pk = pk)
    return JsonResponse({"equipo":e.actualizar})


