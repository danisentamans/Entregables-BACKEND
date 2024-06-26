# Generated by Django 5.0.6 on 2024-06-04 21:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Receta",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("nombre", models.CharField(max_length=255)),
                ("ingredientes", models.TextField()),
                ("instrucciones", models.TextField()),
                (
                    "tiempo_preparacion",
                    models.IntegerField(help_text="Tiempo en minutos"),
                ),
                ("categoria", models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name="Comentario",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("autor", models.CharField(max_length=100)),
                ("contenido", models.TextField()),
                ("fecha_publicacion", models.DateTimeField(auto_now_add=True)),
                (
                    "receta",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="comentarios",
                        to="cocina.receta",
                    ),
                ),
            ],
        ),
    ]
