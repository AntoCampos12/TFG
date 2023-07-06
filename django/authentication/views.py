from django.shortcuts import render
from .forms import AuthenticateForm, UpdateForm, UserForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.core.mail import send_mail
import re

@csrf_exempt
def registro(request):
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            username = request.POST['username'] 
            email = request.POST['email']
            first_name = request.POST['first_name']
            last_name = request.POST['last_name']
            password = request.POST['password']
            password2 = request.POST['password2']
            if(len(username) > 25 or len(username) < 3 and len(first_name) > 25 or 
               len(first_name) < 3 and len(last_name) > 25 or len(last_name)<3):
                return JsonResponse({'errors':'El tamaño del nombre de usuario, \
                                     nombre y apellidos deben estar entre 3 y 25'})
            elif(len(email) < 3 or len(email) > 25):
                return JsonResponse({'errors':'El tamaño del correo debe estar entre 3 y 25'})
            elif(not re.fullmatch(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',email)):
                return JsonResponse({'errors':'El email debe seguir la estructura nombredecorreo@correo.algo'})
            elif(password != password2):
                return JsonResponse({'errors':'las contraseñas deben ser iguales'})
            elif(len(password) < 8):
                return JsonResponse({'errors':'la contraseña debe tener al menos 8 caracteres.'})
            elif(username in list(User.objects.all().values_list(username,flat=True))):
                return JsonResponse({'errors': 'Ya existe un usuario con tu nombre'})
            else:
                usuario = User(username = username, email = email, first_name = first_name, 
                               last_name = last_name, password = password)
                usuario.set_password(password)
                usuario.save()
        else:
            if(request.POST['username'] == '' or request.POST['email']  == '' or 
               request.POST['first_name']  == '' or request.POST['last_name']  == ''
                 or request.POST['password']  == '' or request.POST['password2'] == ''):
                return JsonResponse({'errors':'Los campos no pueden ser vacíos'})
    else:
        form = UserForm()
    return render(request, 'index.html')

@csrf_exempt
def update_jugador(request):
    if request.method == 'POST':
        form = UpdateForm(request.POST)
        if form.is_valid():
            username = request.POST['username'] 
            email = request.POST['email']
            first_name = request.POST['first_name']
            last_name = request.POST['last_name']

            user_existentes = list(User.objects.all().values_list("username", flat=True))

            if(len(username) > 25 or len(username) < 3 and len(first_name) > 25 or len(first_name) < 3 and len(last_name) > 25 or len(last_name)<3):
                return JsonResponse({'errors':'El tamaño del nombre de usuario, nombre y apellidos deben estar entre 3 y 25'})
            elif(len(email) < 3 or len(email) > 25):
                return JsonResponse({'errors':'El tamaño del correo debe estar entre 3 y 25'})
            elif(not re.fullmatch(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',email)):
                return JsonResponse({'errors':'El email debe seguir la estructura nombredecorreo@correo.algo'})
            elif(username in user_existentes and username != request.user):
                return JsonResponse({'errors': 'El nombre de usuario seleccionado ya existe'})
            else:
                usuario = User.objects.get(pk = request.user.pk)
                usuario.email = email
                usuario.username = username
                usuario.first_name = first_name
                usuario.last_name = last_name
                usuario.save()
            return render(request, 'index.html')
        else:
            if(request.POST["username"] == '' or request.POST["email"] == '' or request.POST["first_name"] == '' or request.POST["last_name"] == ''):
                return JsonResponse({'errors':'Los campos no pueden ser vacíos'})
    else:
        form = UpdateForm()
    return render(request, 'index.html')
 

@csrf_exempt
def InicioSesion(request):
    if request.method == 'POST':
        form = AuthenticateForm(request.POST)
        if form.is_valid():
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(request, username=username, password=password)
            print(user)
            if user is not None:
                login(request, user)
            else:
                return JsonResponse({'errors':'el usuario o la contraseña introducidas no son correctas.'})
        else:
            return JsonResponse({'errors':'el usuario o la contraseña introducidas no son correctas.'})
    else:
        form = AuthenticateForm()
    return render(request, "index.html")

@csrf_exempt
def cerrarSesion(request):
    logout(request)
    return render(request,"index.html")

def getUsuario(request):
    res = []
    user = User.objects.get(username = request.user)
    res.append(user.username)
    res.append(user.first_name)
    res.append(user.email)
    res.append(user.last_name)
    res.append(user.renew)
    return JsonResponse({'usuario': res})

@csrf_exempt
def recuperarPwd(request):
    try:
        user = User.objects.get(username = request.POST['username'])
        user.renew = True
        user.save()

        subject = f'SIMSOCCER Recupera tu contraseña'
        message = f'Este correo es para recuperar tu pwd \n' \
                    f'para poder realizarlo acceder al siguiente enlace 127.0.0.1:8000/authentication/rpwd/{user.username}'                    
        send_mail(subject, message, 'simsoccertfg@gmail.com', [user.email])
    except:
        print("El nombre de usuario no existe")

@csrf_exempt
def gestionPwd(request, us):
    if request.method == 'POST':
        if request.POST['password'] == request.POST['password2']:
            if(len(request.POST['password']) >= 8 and len(request.POST['password']) < 25):
                user = User.objects.get(username = us)
                if user.renew == False:
                    return JsonResponse({'errors': '1'})
                user.renew = False
                user.set_password(request.POST['password'])
                user.save()
                return JsonResponse({'errors': 'Contraseña actualizada correctamente'})
            else:
                return JsonResponse({'errors': 'Las contraseñas tienen que tener entre 8 y 25 caracteres'})
        else:
            return JsonResponse({'errors':'Las contraseñas tienen que ser iguales.'})
    else:
        return render(request,"index.html")