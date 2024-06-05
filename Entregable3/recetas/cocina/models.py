from django.db import models

class Receta(models.Model):
    nombre = models.CharField(max_length=255)
    ingredientes = models.TextField()
    instrucciones = models.TextField()
    tiempo_preparacion = models.IntegerField(help_text="Tiempo en minutos")
    categoria = models.CharField(max_length=100)
    imagen = models.ImageField(upload_to='imagenes_recetas/', null=True, blank=True)

    def __str__(self):
        return self.nombre

class Comentario(models.Model):
    autor = models.CharField(max_length=100)
    contenido = models.TextField()
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    receta = models.ForeignKey(Receta, related_name='comentarios', on_delete=models.CASCADE)

    def __str__(self):
        return f'Comentario de {self.autor} en {self.receta.nombre}'

class ListaDeCompras(models.Model):
    nombre = models.CharField(max_length=255)
    recetas = models.ManyToManyField(Receta)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre
