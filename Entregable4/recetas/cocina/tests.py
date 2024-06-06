from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import Receta, Comentario, ListaDeCompras

class RecetaTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_create_receta(self):
        url = reverse('receta-list')
        data = {
            'nombre': 'Test Receta', 
            'ingredientes': 'Test Ingredientes', 
            'instrucciones': 'Test Instrucciones', 
            'tiempo_preparacion': 30, 
            'categoria': 'Test Categoría'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_recetas(self):
        url = reverse('receta-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ComentarioTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_create_comentario(self):
        receta = Receta.objects.create(
            nombre='Test Receta', 
            ingredientes='Test Ingredientes', 
            instrucciones='Test Instrucciones', 
            tiempo_preparacion=30, 
            categoria='Test Categoría'
        )
        url = reverse('comentario-list')
        data = {
            'autor': 'Test Autor', 
            'contenido': 'Test Contenido', 
            'receta': receta.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_comentarios(self):
        url = reverse('comentario-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ListaDeComprasTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_create_lista_de_compras(self):
        url = reverse('lista-de-compras-list')
        data = {'nombre': 'Test Lista', 'recetas': []}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_listas_de_compras(self):
        url = reverse('lista-de-compras-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
