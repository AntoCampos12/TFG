from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('login', views.InicioSesion),
    path('logout',views.cerrarSesion),
    path('update', views.update_jugador),
    path('user', views.getUsuario)
]