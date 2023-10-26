"""
URL configuration for sc2006 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from pages.views import restaurant_home_view
from customadmin.views import check_login_status
from user_profiles.views import (
    register,
    user_profile,
    custom_login,
)
from restaurants.views import (
    restaurant_manager_view,
    register_restaurant,
)

urlpatterns = [
    path('restaurants/', include('restaurants.urls')),
    path('', restaurant_home_view, name='home'),
    path('home/', restaurant_home_view, name='home'),
    path('admin/', admin.site.urls),
    path("accounts/", include("django.contrib.auth.urls")),
    path('check_login_status/', check_login_status, name='check_login_status'),
    path('login/', custom_login, name='login'),
    path('register/', register, name='register'),
    path('profile/', user_profile, name='user_profile'),
    path('manage/', restaurant_manager_view, name='restaurant_manager'),
    path('register-restaurant/', register_restaurant, name='register_restaurant'),
]
