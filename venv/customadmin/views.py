from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from restaurants.models import Restaurant  
from django.contrib.auth.models import User

def check_login_status(request):
    is_authenticated = request.user.is_authenticated

    # Check if the user is a restaurant manager (customize this as needed)
    if is_authenticated:
        user_is_manager = request.user.is_manager  # Assuming you have an "is_manager" attribute on your User model
        if user_is_manager:
            # Get the content type for the Restaurant model
            content_type = ContentType.objects.get_for_model(Restaurant)

            # Get the custom permission
            permission = Permission.objects.get(content_type=content_type, codename='can_manage_own_restaurants')

            # Check if the manager already has the permission
            if not request.user.user_permissions.filter(id=permission.id).exists():
                request.user.user_permissions.add(permission)

    return JsonResponse({'is_authenticated': is_authenticated})
