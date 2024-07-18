from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import UserCreate

urlpatterns = [
    path('register/', UserCreate.as_view(), name='user-register'),
    path('login/', obtain_auth_token, name='login'),
]
