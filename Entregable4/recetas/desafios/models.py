from django.db import models
from cocina.models import Receta

class Desafio(models.Model):
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()

    def __str__(self):
        return self.titulo

class Participacion(models.Model):
    receta = models.ForeignKey(Receta, on_delete=models.CASCADE)
    desafio = models.ForeignKey(Desafio, related_name='participaciones', on_delete=models.CASCADE)
    fecha_participacion = models.DateTimeField(auto_now_add=True)
    votos = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'Participación de {self.receta.nombre} en {self.desafio.titulo}'
