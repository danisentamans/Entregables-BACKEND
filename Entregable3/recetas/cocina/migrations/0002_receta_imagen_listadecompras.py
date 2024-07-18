# Generated by Django 5.0.6 on 2024-06-04 21:57

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("cocina", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="receta",
            name="imagen",
            field=models.ImageField(
                blank=True, null=True, upload_to="imagenes_recetas/"
            ),
        ),
        migrations.CreateModel(
            name="ListaDeCompras",
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
                ("fecha_creacion", models.DateTimeField(auto_now_add=True)),
                ("recetas", models.ManyToManyField(to="cocina.receta")),
            ],
        ),
    ]
