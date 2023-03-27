from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('login', views.InicioSesion),
    path('logout',views.cerrarSesion)
]