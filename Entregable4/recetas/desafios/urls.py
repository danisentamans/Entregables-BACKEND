from django.urls import path
from .views import DesafioList, DesafioDetail, ParticipacionList, ParticipacionDetail, votar_participacion

urlpatterns = [
    path('desafios/', DesafioList.as_view(), name='desafio-list'),
    path('desafios/<int:pk>/', DesafioDetail.as_view(), name='desafio-detail'),
    path('participaciones/', ParticipacionList.as_view(), name='participacion-list'),
    path('participaciones/<int:pk>/', ParticipacionDetail.as_view(), name='participacion-detail'),
    path('participaciones/<int:participacion_id>/votar/', votar_participacion, name='votar-participacion'),
]
