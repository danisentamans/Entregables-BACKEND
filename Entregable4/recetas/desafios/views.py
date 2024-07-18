from rest_framework import generics
from .models import Desafio, Participacion
from .serializers import DesafioSerializer, ParticipacionSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Vistas genéricas Desafio y Participacion
class DesafioList(generics.ListCreateAPIView):
    queryset = Desafio.objects.all()
    serializer_class = DesafioSerializer

class DesafioDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Desafio.objects.all()
    serializer_class = DesafioSerializer

class ParticipacionList(generics.ListCreateAPIView):
    queryset = Participacion.objects.all()
    serializer_class = ParticipacionSerializer

class ParticipacionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Participacion.objects.all()
    serializer_class = ParticipacionSerializer

# Vista de api_view para votar en participaciones
@api_view(['POST'])
def votar_participacion(request, participacion_id):
    try:
        participacion = Participacion.objects.get(id=participacion_id)
        participacion.votos += 1
        participacion.save()
        return Response({'status': 'voto registrado'}, status=status.HTTP_200_OK)
    except Participacion.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
