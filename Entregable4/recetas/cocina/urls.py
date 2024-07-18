from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecetaViewSet, ComentarioList, ComentarioDetail, ListaDeComprasList, ListaDeComprasDetail, comentarios_de_receta

router = DefaultRouter()
router.register(r'recetas', RecetaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('comentarios/', ComentarioList.as_view(), name='comentario-list'),
    path('comentarios/<int:pk>/', ComentarioDetail.as_view(), name='comentario-detail'),
    path('listas-de-compras/', ListaDeComprasList.as_view(), name='lista-de-compras-list'),
    path('listas-de-compras/<int:pk>/', ListaDeComprasDetail.as_view(), name='lista-de-compras-detail'),
    path('recetas/<int:receta_id>/comentarios/', comentarios_de_receta, name='comentarios-de-receta'),
]
