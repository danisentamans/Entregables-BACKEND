from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from cocina.models import Receta

class Command(BaseCommand):
    help = 'Crear grupos de usuarios'

    def handle(self, *args, **kwargs):
        # Crear grupos
        admin_group, created = Group.objects.get_or_create(name='Administradores')
        employee_group, created = Group.objects.get_or_create(name='Empleados')

        # Obtener permisos
        content_type = ContentType.objects.get_for_model(Receta)
        permissions = Permission.objects.filter(content_type=content_type)

        # Asignar permisos a los grupos
        admin_group.permissions.set(permissions)
        employee_group.permissions.set(permissions.exclude(codename='delete_receta'))

        self.stdout.write(self.style.SUCCESS('Grupos creados con éxito'))
