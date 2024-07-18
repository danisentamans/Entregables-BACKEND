from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group, Permission
from django.contrib.contenttypes.models import ContentType
from cocina.models import Receta

class Command(BaseCommand):
    help = 'Crear grupos de usuarios y usuarios por defecto'

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

        # Crear usuario administrador
        if not User.objects.filter(username='admin2').exists():
            admin_user = User.objects.create_superuser(
                username='admin2',
                password='adminpassword'
            )
            admin_user.groups.add(admin_group)
            self.stdout.write(self.style.SUCCESS('Usuario administrador creado con éxito'))
        else:
            self.stdout.write(self.style.WARNING('Usuario administrador ya existe'))

        # Crear usuario normal
        if not User.objects.filter(username='user2').exists():
            normal_user = User.objects.create_user(
                username='user2',
                password='userpassword'
            )
            normal_user.groups.add(employee_group)
            self.stdout.write(self.style.SUCCESS('Usuario normal creado con éxito'))
        else:
            self.stdout.write(self.style.WARNING('Usuario normal ya existe'))
