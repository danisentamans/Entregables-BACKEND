from django.urls import path
from .views import RecetaList, RecetaDetail, ComentarioList, ComentarioDetail, comentarios_de_receta, ListaDeComprasList, ListaDeComprasDetail

urlpatterns = [
    path('recetas/', RecetaList.as_view(), name='receta-list'),
    path('recetas/<int:pk>/', RecetaDetail.as_view(), name='receta-detail'),
    path('comentarios/', ComentarioList.as_view(), name='comentario-list'),
    path('comentarios/<int:pk>/', ComentarioDetail.as_view(), name='comentario-detail'),
    path('recetas/<int:receta_id>/comentarios/', comentarios_de_receta, name='comentarios-de-receta'),
    path('listas-de-compras/', ListaDeComprasList.as_view(), name='lista-de-compras-list'),
    path('listas-de-compras/<int:pk>/', ListaDeComprasDetail.as_view(), name='lista-de-compras-detail'),
]
