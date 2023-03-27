from django.urls import path
from . import views

urlpatterns = [
    path('<int:pk>',views.game),
    path('<int:pk>/freeAgents', views.freeAgents),
    path('<int:pk>/fichajes', views.game),
    path('fichar',views.fichar),
    path('<int:pk>/j', views.getEquipoJugador),
    path('<int:pk>/jornada', views.getPuntuacion),
    path('<int:pk>/liga', views.getRank),
    path('<int:pk>/ranking', views.ranking),
    path('<int:pk>/get', views.getEquipo)
]