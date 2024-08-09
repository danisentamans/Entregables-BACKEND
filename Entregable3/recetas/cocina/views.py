from rest_framework import generics
from .models import Receta, Comentario, ListaDeCompras
from .serializers import RecetaSerializer, ComentarioSerializer, ListaDeComprasSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Vistas Genéricas para Receta
class RecetaList(generics.ListCreateAPIView):
    queryset = Receta.objects.all()
    serializer_class = RecetaSerializer

class RecetaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Receta.objects.all()
    serializer_class = RecetaSerializer

# Vistas Genéricas para Comentario
class ComentarioList(generics.ListCreateAPIView):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer

class ComentarioDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer

# Vistas Genéricas para ListaDeCompras
class ListaDeComprasList(generics.ListCreateAPIView):
    queryset = ListaDeCompras.objects.all()
    serializer_class = ListaDeComprasSerializer

class ListaDeComprasDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ListaDeCompras.objects.all()
    serializer_class = ListaDeComprasSerializer

# api_view Propia para listar comentarios de una receta específica
@api_view(['GET'])
def comentarios_de_receta(request, receta_id):
    try:
        receta = Receta.objects.get(id=receta_id)
    except Receta.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    comentarios = Comentario.objects.filter(receta=receta)
    serializer = ComentarioSerializer(comentarios, many=True)
    return Response(serializer.data)
