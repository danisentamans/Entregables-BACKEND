from rest_framework import generics
from django.contrib.auth.models import User, Group
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        # Asignar el grupo 'Empleados' al usuario recién creado
        employee_group, created = Group.objects.get_or_create(name='Empleados')
        user.groups.add(employee_group)
        user.save()
