from django.urls import path
from . import views

urlpatterns = [
    path('<int:pk>',views.game),
    path('<int:pk>/freeAgents', views.freeAgents),
    path('<int:pk>/fichajes', views.game),
    path('fichar',views.fichar),
    path('<int:pk>/j', views.getEquipoJugador),
    path('<int:pk>/jugadores', views.getJugadoresPlantilla),
    path('<int:pk>/jornada', views.getPuntuacion),
    path('<int:pk>/liga', views.getRank),
    path('<int:pk>/ranking', views.ranking),
    path('<int:pk>/get', views.getEquipo),
    path('<int:pk>/intercambios',views.game),
    path('<int:pk>/geti',views.getIntercambios),
    path('<int:pk>/plantilla', views.plantilla1),
    path('contricante/<int:pk>/<int:us>', views.plantilla2),
    path('exchange/post', views.exchange_FORM),
    path('borrar/exchange/<int:pk>', views.borrarExchange),
    path('aceptar/exchange/<int:pk>', views.aceptarExchange),
    path('<int:user_pk>/convocar/<int:pk>/<pos>', views.Convocar),
    path('<int:user_pk>/vender/<int:pk>', views.vender),
    path('<int:pk>/abandonar', views.abandonarLiga),
    path('<int:pk>/verify', views.verify)
]
