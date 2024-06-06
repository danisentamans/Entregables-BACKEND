from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import Desafio, Participacion
from cocina.models import Receta

class DesafioTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_create_desafio(self):
        url = reverse('desafio-list')
        data = {
            'titulo': 'Test Desafio', 
            'descripcion': 'Test Descripcion', 
            'fecha_inicio': '2024-01-01', 
            'fecha_fin': '2024-01-10'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_desafios(self):
        url = reverse('desafio-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ParticipacionTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_create_participacion(self):
        receta = Receta.objects.create(
            nombre='Test Receta', 
            ingredientes='Test Ingredientes', 
            instrucciones='Test Instrucciones', 
            tiempo_preparacion=30, 
            categoria='Test Categoría'
        )
        desafio = Desafio.objects.create(
            titulo='Test Desafio', 
            descripcion='Test Descripcion', 
            fecha_inicio='2024-01-01', 
            fecha_fin='2024-01-10'
        )
        url = reverse('participacion-list')
        data = {'receta': receta.id, 'desafio': desafio.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_participaciones(self):
        url = reverse('participacion-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_votar_participacion(self):
        receta = Receta.objects.create(
            nombre='Test Receta', 
            ingredientes='Test Ingredientes', 
            instrucciones='Test Instrucciones', 
            tiempo_preparacion=30, 
            categoria='Test Categoría'
        )
        desafio = Desafio.objects.create(
            titulo='Test Desafio', 
            descripcion='Test Descripcion', 
            fecha_inicio='2024-01-01', 
            fecha_fin='2024-01-10'
        )
        participacion = Participacion.objects.create(receta=receta, desafio=desafio)
        url = reverse('votar-participacion', args=[participacion.id])
        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
