from django.template import loader
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .forms import LigaForm, JoinForm
from authentication.models import EquipoJugador, Liga, Equipos, Jugador, Jornada
import http.client
from time import sleep
import json
import random
from datetime import datetime

def update(request, pk):
    return render(request,"index.html")

"""@csrf_exempt
def poblar(request):
        conn = http.client.HTTPSConnection("api-football-v1.p.rapidapi.com")

        headers = {
            'X-RapidAPI-Key': "58106b2756msh0b68bb38b00b62ap110f49jsn9a240f1a9691",
            'X-RapidAPI-Host': "api-football-v1.p.rapidapi.com"
            }

        for n in range(2,39):
            sleep(10)    
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
                try:
                    res = Jugador.objects.get(nombre = nombre, equipo = equipo)
                except:
                    if rating == None:
                        res = Jugador(nombre = nombre, equipo = equipo, foto = foto, posicion = posicion)
                    else:
                        res = Jugador(nombre = nombre, equipo = equipo, rating = rating, foto = foto, posicion = posicion)
                    res.save()
            print(n)"""

def jornada(request, pk):
    if(Equipos.objects.get(pk=pk).actualizar == 0):
        print("================== POBLANDO =========================")
        conn = http.client.HTTPSConnection("api-football-v1.p.rapidapi.com")

        headers = {
            'X-RapidAPI-Key': "58106b2756msh0b68bb38b00b62ap110f49jsn9a240f1a9691",
            'X-RapidAPI-Host': "api-football-v1.p.rapidapi.com"
            }

        num = Jornada.objects.all().first().jornada
        for n in range(0,10):
                sleep(10)
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
    if(e.actualizar == 0 and datetime.now().weekday() == 0):
        e.actualizar = 1
        e.puntuacion = e.puntuacion + getPuntos(pk)
        e.save()
    elif(e.actualizar == 1 and datetime.now().weekday() != 0):
        e.actualizar = 0
        e.save()
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

@csrf_exempt
def join(request):
    if request.method == 'POST':
        print(request.POST)
        form = JoinForm(request.POST)
        if form.is_valid():
            nombreLiga = request.POST['nombreLiga']
            nombreEquipo = request.POST['nombreEquipo']
            user = request.user
            try:
                liga = Liga.objects.get(name = nombreLiga)
            except:
                return JsonResponse({'errors':'el nombre introducido no es correcto.'})

            if(len(nombreEquipo) == 0 or len(nombreEquipo) > 25):
                return JsonResponse({'errors':'la longitud del campo nombre de Equipo no puede ser ni 0 ni mayor que 25'})
            if(not liga.public and request.POST['password'] == 'noProcede'):
                return JsonResponse({'errors':'Esta liga no es pública.'})
            else:
                if liga.public or request.POST['password'] == liga.password:
                    equipo = Equipos(name = nombreEquipo, owner = user, liga = liga)
                    equipo.save()
                    return render(request, "index.html")
                else:
                    return JsonResponse({'errors':'la contraseña no es correcta'})
        else:
            return JsonResponse({'errors':'La información introducida no fue válida.'})

    else:
        form = JoinForm()
    return render("index.html")

@csrf_exempt
def add(request):
    if request.method == 'POST':
        form = LigaForm(request.POST)
        if form.is_valid():
            nombreLiga = request.POST['nombreLiga']
            nombreEquipo = request.POST['nombreEquipo']
            user = request.user
            isPublic = request.POST['isPublic']
            if(isPublic == 'True'):
                isPublic = True
            else:
                isPublic = False
            password = request.POST['password']

            if(len(nombreLiga) == 0 or len(nombreLiga) > 25):
                return JsonResponse({'errors':'la longitud del campo nombre de Liga no puede ser ni 0 ni mayor que 25'})
            elif(len(Liga.objects.filter(name=nombreLiga)) != 0):
                return JsonResponse({'errors':'el nombre de la liga ya existe'})
            elif(len(nombreEquipo) == 0 or len(nombreEquipo) > 25):
                return JsonResponse({'errors':'la longitud del campo nombre de Equipo no puede ser ni 0 ni mayor que 25'})
            elif((len(password) == 0 and not isPublic) or len(password) > 25):
                return JsonResponse({'errors':'la longitud del campo contraseña no puede ser ni 0 ni mayor que 25'})
            else:
                liga = Liga(name = nombreLiga, owner = user, public = isPublic, password = password)
                liga.save()
                equipo = Equipos(name = nombreEquipo, owner = user, liga = liga)
                equipo.save()
                return render(request, "index.html")
        else:
            return JsonResponse({'errors':'La información introducida no fue válida.'})
    else:
        form = LigaForm()
    return render(request, "index.html")

def obtenerLigas(request):
    res = []
    for i in list(Equipos.objects.filter(owner = request.user).values()):
        res.append({"equipo" : i['name'], 'liga': Liga.objects.get(pk = i["liga_id"]).name, 'pk': i['id']})
    return JsonResponse({'ligas': res})
