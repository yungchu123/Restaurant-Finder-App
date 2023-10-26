from django.contrib import admin
from restaurants.models import Restaurant

class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'place_id')
    search_fields = ('name', 'address', 'place_id')

    def get_queryset(self, request):
        # Get the original queryset
        queryset = super().get_queryset(request)

        # Filter the queryset based on the user's permissions
        if request.user.is_superuser:
            return queryset  # Superusers can see all restaurants
        elif request.user.has_perm('restaurants.can_manage_own_restaurants'):
            return queryset.filter(registered_by=request.user)
        else:
            return queryset.none()  # Users without permission see no restaurants

# Register the Restaurant model with the custom admin class
admin.site.register(Restaurant, RestaurantAdmin)