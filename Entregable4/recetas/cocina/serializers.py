from rest_framework import serializers
from .models import Receta, Comentario, ListaDeCompras

class RecetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receta
        fields = '__all__'

class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = '__all__'

class ListaDeComprasSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListaDeCompras
        fields = '__all__'
