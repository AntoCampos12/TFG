from django.http import JsonResponse
from django.shortcuts import render
from authentication.models import Exchange, Jugador, EquipoJugador, Equipos, Jornada, Liga
from .forms import ExchangeForm, FichajeForm, JoinForm, LigaForm
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import random

PRECIOS_EQUIPOS = {'Girona': 0.5, 'Sevilla' : 0.80, 'Rayo Vallecano': 0.6, 'Real Sociedad': 0.85,
                    'Barcelona' : 1.00, 'Real Betis' : 0.80, 'Elche': 0.3, 'Villarreal':0.80, 'Valladolid': 0.4, 
                    'Athletic Club':0.75, 'Cadiz': 0.4, 'Getafe': 0.4, 'Celta Vigo': 0.6, 'Espanyol': 0.5, 
                 'Valencia': 0.4, 'Osasuna': 0.7, 'Atletico Madrid' : 0.85, 'Almeria': 0.4, 
                    'Real Madrid': 1.00, 'Mallorca': 0.5}

def game(request, pk):
    return render(request,"index.html")

def plantilla1(request, pk):
    return render(request,"index.html")

def plantilla2(request, pk, us):
    return render(request, "index.html")

def ranking(request, pk):
    return render(request, "index.html")

def freeAgents(request, pk):
    jugadores = Jugador.objects.exclude(rating = 0.0).values()
    jugadores = list(jugadores)
    e = Equipos.objects.get(pk = pk)
    agentes = EquipoJugador.objects.filter(liga = e.liga, equipo = None).values()[:15]
    nagentes = 15 - agentes.count()
    for i in range(0,nagentes):
        j = random.choice(jugadores)
        jug_existentes = EquipoJugador.objects.filter(liga = e.liga).values_list("jugador", flat= True)
        jug_existentes = list(jug_existentes)
        while(j['id'] in EquipoJugador.objects.filter(liga = e.liga).values_list("jugador", flat= True)):
            j = random.choice(jugadores)
        j = Jugador.objects.get(pk = j["id"])
        ej = EquipoJugador(jugador=j,liga = e.liga)
        ej.save()
    res = [e.presupuesto]
    for a in agentes:
        j = Jugador.objects.get(pk = a["jugador_id"])
        res.append({"nombre": j.nombre,"foto": j.foto,"equipo":j.equipo,"rating":j.rating})
    return JsonResponse({'jugadores': res})

@csrf_exempt
def fichar(request):
    if request.method == 'POST':
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


def vender(request, user_pk, pk):
    j = Jugador.objects.get(pk = pk)
    e = Equipos.objects.get(pk = user_pk)
    e.presupuesto = e.presupuesto + j.rating*5000000*PRECIOS_EQUIPOS[j.equipo]*0.8
    e.save()
    ej = EquipoJugador.objects.get(jugador = j, liga = e.liga)
    ej.equipo = None
    ej.save()
    return render(request,"index.html")

@csrf_exempt
def exchange_FORM(request):
    if request.method == 'POST':
        form = ExchangeForm(request.POST)
        if form.is_valid():
            usuario = Equipos.objects.get(pk = request.POST['ofrece'])
            recibe = Equipos.objects.get(pk = request.POST['recibe'])
            jofrece = request.POST.getlist('jofrece')
            jofrece = [Jugador.objects.get(pk=j) for j in jofrece]
            jrecibe = request.POST.getlist('jrecibe')
            jrecibe = [Jugador.objects.get(pk=j) for j in jrecibe]
            exchange = Exchange(usuario_ofrece = usuario, usuario_recibe = recibe)
            exchange.save()

            for jugador in jofrece:
                exchange.jugadores_ofrece.add(jugador)
            
            for jugador in jrecibe:
                exchange.jugadores_recibe.add(jugador)

            exchange.save()
        else:
            return JsonResponse({"error":"Para intercambiar debes seleccionar al menos un jugador de cada equipo"})
    else:
        form = ExchangeForm()
    return render(request, "index.html")

def getEquipoJugador(request, pk):
    e = Equipos.objects.get(pk = pk)
    j = EquipoJugador.objects.filter(equipo = e).values()
    res = [(Jugador.objects.filter(pk = i['jugador_id']).values()[0], i['posicion']) for i in j if i['posicion'] != "SUS"]

    return JsonResponse({"jugadores": res})

def getJugadoresPlantilla(request, pk):
    e = Equipos.objects.get(pk = pk)
    j = EquipoJugador.objects.filter(equipo = e).values()
    res = [(Jugador.objects.filter(pk = i['jugador_id']).values()[0],i['posicion']) for i in j]

    return JsonResponse({"jugadores": res})

def getPuntuacion(request, pk):
    res = 0.00
    desglose = []
    e = Equipos.objects.get(pk = pk)
    j = EquipoJugador.objects.filter(equipo = e).values_list("jugador", "posicion")

    jugadores = [Jugador.objects.get(pk = pk) for pk,pos in j if pos != 'SUS']

    for i in jugadores:
        jugjor = Jornada.objects.filter(jugador = i).first()
        if jugjor != None:
            res = res + jugjor.rating
            desglose.append(i.nombre + " " +  str(jugjor.rating) + "@" + i.foto)
        else:
            desglose.append(i.nombre + " " + "0.0" + "@" + i.foto)
        
    return JsonResponse({"puntuacion":round(res,2), "desglose":desglose})

def getRank(request, pk):
    e = Equipos.objects.get(pk = pk)
    equipos = Equipos.objects.filter(liga = e.liga).order_by('-puntuacion').values()
    return JsonResponse({"rank": list(equipos)})

def getEquipo(request, pk):
    e = Equipos.objects.get(pk = pk)
    print(e.actualizar)
    return JsonResponse({"equipo":e.actualizar})

def getIntercambios(request, pk):
    e = Equipos.objects.get(pk = pk)
    ofrecidos = Exchange.objects.filter(usuario_recibe = e)
    intercambio_o = []
    for i in ofrecidos:
        jugadores_ofrece = i.jugadores_ofrece.all()
        jugadores_recibe = i.jugadores_recibe.all()
        d = {"o": [i.nombre for i in list(jugadores_ofrece)],"r": [i.nombre for i in list(jugadores_recibe)], 'id': i.pk}
        intercambio_o.append(d)        
    recibidos = Exchange.objects.filter(usuario_ofrece = e)
    intercambio_r = []
    for i in recibidos:
        jugadores_ofrece = i.jugadores_ofrece.all()
        jugadores_recibe = i.jugadores_recibe.all()
        d = {"o": [i.nombre for i in list(jugadores_ofrece)],"r": [i.nombre for i in list(jugadores_recibe)]}
        intercambio_r.append(d)   
    return JsonResponse({"recibidos": intercambio_r, "ofrecidos": intercambio_o})

def borrarExchange(request, pk):
    intercambio = Exchange.objects.get(pk = pk)
    intercambio.delete()
    return render(request, "index.html")

def aceptarExchange(request, pk):
    intercambio = Exchange.objects.get(pk = pk)
    intercambio_u1 = intercambio.usuario_ofrece
    intercambio_u2 = intercambio.usuario_recibe
    jugadores_u1 = intercambio.jugadores_ofrece.all()
    jugadores_u2 = intercambio.jugadores_recibe.all()
    print(jugadores_u1)
    for j in jugadores_u1:
        je = EquipoJugador.objects.get(equipo = intercambio_u1, jugador = j)
        je.equipo = intercambio_u2
        je.save()

    for j in jugadores_u2:
        je = EquipoJugador.objects.get(equipo = intercambio_u2, jugador = j)
        je.equipo = intercambio_u1
        je.save()

    intercambio.delete()
    return render(request, "index.html")

def Convocar(request, user_pk, pos, pk):
    j = Jugador.objects.get(pk = pk)
    e = Equipos.objects.get(pk = user_pk)
    ej1 = EquipoJugador.objects.get(equipo = e, jugador = j)
    ej2 = EquipoJugador.objects.filter(equipo = e, posicion = pos)
    if len(ej2) > 0:
        ej2 = ej2[0]
        ej2.posicion = "SUS"
        ej2.save()
    ej1.posicion = pos
    ej1.save()
    return render(request, "index.html")


def abandonarLiga(request, pk):
    e = Equipos.objects.filter(pk = pk)
    e.delete()
    return render(request, "index.html")

def verify(request, pk):
    if(request.user.is_authenticated):
        e = Equipos.objects.filter(owner = request.user).values("id")
        e = [i['id'] for i in e]
        if(pk in e):
            return JsonResponse({"v":"true"})
    return JsonResponse({"v":"false"})


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

                    if(Equipos.objects.all().filter(liga = liga).count() >= 4):
                        liga.active = True
                        liga.save()
                    return render(request, "index.html")
                else:
                    return JsonResponse({'errors':'la contraseña no es correcta'})
        else:
            return JsonResponse({'errors':'Los campos no pueden ser vacíos.'})

    else:
        form = JoinForm()
    return render(request,"index.html")

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
            return JsonResponse({'errors':'Los campos no pueden ser vacíos.'})
    else:
        form = LigaForm()
    return render(request, "index.html")

def obtenerLigas(request):
    res = []
    for i in list(Equipos.objects.filter(owner = request.user).values()):
        l = Liga.objects.get(pk = i["liga_id"])
        res.append({"equipo" : i['name'], 'liga': l.name, 
                    'pk': i['id'], 'active': l.active, "eowner": request.user.pk, 
                    "owner": l.owner.pk, "publica": l.public})
    return JsonResponse({'ligas': res})

def getPublicas(request):
    equipos = Liga.objects.all().filter(public = True).values_list("id", flat=True)
    equipos_user = Equipos.objects.all().filter(owner = request.user).values_list('liga', flat=True)
    equipos = list(equipos)
    equipos_user = list(equipos_user)
    equipos = [e for e in equipos if e not in equipos_user]
    res = [{'valores': Liga.objects.filter(pk = i).values().first(), 'numeros': Equipos.objects.filter(liga = i).count()} for i in equipos]
    return JsonResponse({'ligas': res[:5]})

def globalRank(request):
    dict = {}
    for e in Equipos.objects.all():
        if e.owner.username in dict:
            dict[e.owner.username] = dict[e.owner.username] + e.puntuacion
        else:
            dict[e.owner.username] = e.puntuacion
    aux = list(dict.items())
    aux.sort(key= lambda x: x[1], reverse=True)
    return JsonResponse({'global1': {'jugador': aux[0][0], 'puntuacion': aux[0][1]},
                          'global2': {'jugador': aux[1][0], 'puntuacion': aux[1][1]},
                          'global3': {'jugador': aux[2][0], 'puntuacion': aux[2][1]}})
@csrf_exempt
def iniciarLiga(request):
    e = Equipos.objects.get(pk = request.POST['liga'])
    liga = Liga.objects.get(pk = e.liga.pk)
    liga.active = True
    liga.save()
    return render(request, "index.html")