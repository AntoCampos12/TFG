from django.template import loader
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from authentication.models import EquipoJugador, Liga, Equipos, Jugador, Jornada, Actualizar
from django.contrib.auth.models import User
import http.client
from time import sleep
import json
from datetime import datetime
from django.db.models import Q

def update(request, pk):
    return render(request,"index.html")

"""
def poblar(request):
        conn = http.client.HTTPSConnection("api-football-v1.p.rapidapi.com")

        headers = {
            'X-RapidAPI-Key': "58106b2756msh0b68bb38b00b62ap110f49jsn9a240f1a9691",
            'X-RapidAPI-Host': "api-football-v1.p.rapidapi.com"
            }

        print("==============POBLANDO====================")

        for n in range(40,42):
            sleep(2)    
            conn.request("GET", "/v3/players?league=140&season=2022&page={}".format(n), headers=headers)

            res = conn.getresponse()
            data = res.read()

            data = data.decode("utf-8")
            res = json.loads(data)
            for i in res['response']:
                jugador = i['player']
                foto = jugador['photo']
                nombre = jugador['name']
                estadisticas = i['statistics']
                juegos = estadisticas[0]
                equipo = juegos['team']
                equipo = equipo['name']
                juegos = juegos['games']
                posicion = juegos['position']
                rating = juegos['rating']
                print("NOMBRE: " + nombre)
                print("POSICION: " + posicion)
                res = Jugador.objects.filter(nombre = nombre, equipo = equipo).first()
                try:
                    if res.posicion == "banquillo":
                        print("ACTUALIZADO")
                        print("================")
                        res.posicion = posicion
                        res.save()
                    else:
                        print("JUGADOR CORRECTO")
                        print("================")
                except:
                    if rating == "" or rating == None:
                        rating = 0.0
                    j = Jugador(nombre=nombre, equipo = equipo, foto = foto, rating = rating, posicion = posicion)
                    if posicion != None:
                        j.save()
                    print("INTRODUCIDO")
                    print("===================")
            print(n)"""

def jornada(request, pk):
    print(Equipos.objects.get(pk=pk).actualizar)
    print(Actualizar.objects.all().first().actualizar)
    print(datetime.now().weekday())
    if(Equipos.objects.get(pk=pk).actualizar == 0 and Actualizar.objects.all().first().actualizar == 0 and datetime.now().weekday() == 1):
        print("================== POBLANDO =========================")
        conn = http.client.HTTPSConnection("api-football-v1.p.rapidapi.com")

        headers = {
            'X-RapidAPI-Key': "58106b2756msh0b68bb38b00b62ap110f49jsn9a240f1a9691",
            'X-RapidAPI-Host': "api-football-v1.p.rapidapi.com"
            }

        num = Jornada.objects.all().last().jornada
        for n in range(0,10):
                conn.request("GET", "/v3/fixtures/players?fixture={}".format(num + n), headers=headers)

                res = conn.getresponse()
                data = res.read()
                res = json.loads(data)
                for j in res['response']:
                    equipo = j["team"]
                    equipo = equipo["name"]
                    jugadores = j["players"]
                    for i in jugadores:
                        jugador = i["player"]
                        estadisticas = i["statistics"]
                        estadisticas = estadisticas[0]
                        estadisticas = estadisticas["games"]
                        rating = estadisticas["rating"]
                        if rating == None:
                            rating = 0.0
                        nombre = jugador["name"]
                        try:
                            jugador = Jugador.objects.filter(nombre = nombre, equipo = equipo).first()
                            jugalt = Jornada.objects.filter(jugador = jugador).first()
                            if jugador != None and jugalt != None:
                                print(nombre)
                                if rating > jugalt.rating:
                                    rating = 1.05*rating
                                if rating > jugador.rating:
                                    rating = 1.05 * rating
                                jugalt.rating = rating
                                jugalt.jornada = num + 10
                                jugalt.save()
                        except:
                            pass
        cambiardia(request, pk)
        return JsonResponse({'hola': 'hola'})
    else:
        return JsonResponse({'hola': 'hola'})


def cambiardia(request, pk):
    e = Equipos.objects.get(pk = pk)
    act = Actualizar.objects.first()
    if(e.actualizar == 0 and datetime.now().weekday() == 1):
        e.actualizar = 1
        e.puntuacion = e.puntuacion + getPuntos(pk)
        e.save()
        act.actualizar = 1
        act.save()
    elif(e.actualizar == 1 and datetime.now().weekday() != 1):
        e.actualizar = 0
        e.save()
        act.actualizar = 0
        act.save()
    return render(request, "index.html") 

def getPuntos(pk):
    rating = 0
    e = Equipos.objects.get(pk = pk)
    j = EquipoJugador.objects.filter(equipo = e).values()
    rating = 0
    for i in j:
        jornada = Jornada.objects.filter(jugador = i['jugador_id']).first()
        if jornada != None:
            rating += jornada.rating
    return round(rating,2)

@csrf_exempt
def home(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            return JsonResponse({'user':request.user.username})
    return render(request, "index.html")
