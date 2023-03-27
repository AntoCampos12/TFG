from django.shortcuts import render
from .forms import AuthenticateForm, UserForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
import re

@csrf_exempt
def index(request):
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            username = request.POST['username'] 
            email = request.POST['email']
            first_name = request.POST['first_name']
            last_name = request.POST['last_name']
            password = request.POST['password']
            password2 = request.POST['password2']

            if(len(username) > 25 or len(username) < 3 and len(first_name) > 25 or len(first_name) < 3 and len(last_name) > 25 or len(last_name)<3):
                return JsonResponse({'errors':'El tamaño del nombre de usuario, nombre y apellidos deben estar entre 3 y 25'})
            elif(len(email) < 3 or len(email) > 25):
                return JsonResponse({'errors':'El tamaño del correo debe estar entre 3 y 25'})
            elif(not re.fullmatch(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',email)):
                return JsonResponse({'errors':'El email debe seguir la estructura nombredecorreo@correo.algo'})
            elif(password != password2):
                return JsonResponse({'errors':'las contraseñas deben ser iguales'})
            elif(username == '' or email == '' or first_name == '' or last_name == '' or password == ''):
                return JsonResponse({'errors':'Los campos no pueden ser vacíos'})
            elif(len(password) < 8):
                return JsonResponse({'errors':'la contraseña debe tener al menos 8 caracteres.'})
            else:
                usuario = User(username = username, email = email, first_name = first_name, last_name = last_name, password = password)
                usuario.set_password(password)
                usuario.save()
            return render(request, 'index.html')
    else:
        form = UserForm()
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
