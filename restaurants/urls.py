from django.urls import path, include

from .views import (
    restaurant_delete_view,
    dynamic_lookup_view,
    restaurant_list_view,
)

app_name = 'restaurants'
urlpatterns = [
    path("accounts/", include("django.contrib.auth.urls")),
    path('', restaurant_list_view, name = 'restaurant-list'),
    path('<int:id>/', dynamic_lookup_view, name = 'restaurant-detail'),
    path('<int:id>/delete', restaurant_delete_view, name = 'restaurant-delete'),
    path('', restaurant_list_view, name = 'restaurant_list'),
]