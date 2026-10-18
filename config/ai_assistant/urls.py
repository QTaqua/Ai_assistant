from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='index'),
    path('api/chat/', views.api_chat, name='api_chat'),
]