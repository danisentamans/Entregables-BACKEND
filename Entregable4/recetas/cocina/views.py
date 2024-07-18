from rest_framework import generics, viewsets, permissions
from .models import Receta, Comentario, ListaDeCompras
from .serializers import RecetaSerializer, ComentarioSerializer, ListaDeComprasSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, DjangoModelPermissions

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

# ViewSet para Receta con permisos
class RecetaViewSet(viewsets.ModelViewSet):
    queryset = Receta.objects.all()
    serializer_class = RecetaSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

# ViewSet para Receta con permisos
class RecetaViewSet(viewsets.ModelViewSet):
    queryset = Receta.objects.all()
    serializer_class = RecetaSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

# Vistas Genéricas para Comentario con permisos
class ComentarioList(generics.ListCreateAPIView):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Todos pueden ver, autenticados pueden crear

class ComentarioDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# Vistas Genéricas para ListaDeCompras con permisos
class ListaDeComprasList(generics.ListCreateAPIView):
    queryset = ListaDeCompras.objects.all()
    serializer_class = ListaDeComprasSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Todos pueden ver, autenticados pueden crear

class ListaDeComprasDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ListaDeCompras.objects.all()
    serializer_class = ListaDeComprasSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# api_view Propia para listar comentarios de una receta específica
@api_view(['GET'])
def comentarios_de_receta(request, receta_id):
    if not request.user.is_authenticated:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    try:
        receta = Receta.objects.get(id=receta_id)
    except Receta.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    comentarios = Comentario.objects.filter(receta=receta)
    serializer = ComentarioSerializer(comentarios, many=True)
    return Response(serializer.data)
