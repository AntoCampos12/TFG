from django.urls import path
from . import views

urlpatterns = [
    path('', views.registro),
    path('login', views.InicioSesion),
    path('logout',views.cerrarSesion),
    path('update', views.update_jugador),
    path('user', views.getUsuario),
    path('pwd', views.recuperarPwd),
    path('rpwd/<us>',views.gestionPwd)
]