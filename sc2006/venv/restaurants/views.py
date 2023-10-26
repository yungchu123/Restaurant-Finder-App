from django.shortcuts import render, get_object_or_404, redirect
from .models import Restaurant
from sc2006 import settings
from django.contrib.auth.decorators import login_required
import googlemaps
from django.http import JsonResponse
import requests
import json 

@login_required
def register_restaurant(request):
    if request.method == 'POST':
        place_id = request.POST.get('place_id')  # Get the place_id from the submitted form
        if place_id:
            # Use the place_id to fetch details of the selected place
            google_api_key = 'AIzaSyB5QT73H-2TdL7JXjjZOg_FzRzwF_4nFhk'
            place_details_url = f"https://maps.googleapis.com/maps/api/place/details/json"
            place_details_params = {
                'place_id': place_id,
                'key': google_api_key,
            }
            place_details_response = requests.get(place_details_url, params=place_details_params)
            restaurant_data = json.loads(place_details_response.text)
            existing_restaurant = Restaurant.objects.filter(place_id=place_id).first()

            if existing_restaurant:
                restaurant_exists = True  # Set the flag
                return render(request, 'restaurant/manager_register_restaurant.html', {'restaurant_exists': restaurant_exists})

            if 'result' in restaurant_data:
                # Check if 'result' is present
                # Create a new Restaurant object with the retrieved data
                new_restaurant = Restaurant(
                    name=restaurant_data['result']['name'],
                    address=restaurant_data['result'].get('vicinity', ''),
                    place_id=place_id,
                    manager = request.user,
                    # Add other fields as needed
                )
                # Save the new restaurant
                new_restaurant.save()

                return redirect('http://127.0.0.1:8000/manage/')
            else:
                return JsonResponse({'status': 'error', 'message': 'Restaurant not found on Google'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid place_id'})
    return render(request, 'restaurant/manager_register_restaurant.html')

def manager_dashboard(request, restaurant_id):
    # Only show the restaurants created by the current manager
    restaurants = Restaurant.objects.filter(manager=request.user)
    restaurant = Restaurant.objects.get(pk=restaurant_id)
    return render(request, 'manager_dashboard.html', {'restaurants': restaurants})

def restaurant_detail(request, restaurant_id):
    restaurant = get_object_or_404(Restaurant, pk=restaurant_id)
    google_api_key = 'AIzaSyB5QT73H-2TdL7JXjjZOg_FzRzwF_4nFhk'
    
    # Construct the URL for the Place Details API
    place_details_url = f"https://maps.googleapis.com/maps/api/place/details/json"
    place_details_params = {
        'fields': 'name,rating,formatted_phone_number,photos',
        'place_id': restaurant.place_id,
        'key': google_api_key,
    }

    place_details_response = requests.get(place_details_url, params=place_details_params)

    if place_details_response.status_code == 200:
        place_data = json.loads(place_details_response.text)
        name = place_data['result'].get('name', 'N/A')
        rating = place_data['result'].get('rating', 'N/A')
        formatted_phone_number = place_data['result'].get('formatted_phone_number', 'N/A')
        photos = place_data['result'].get('photos', [])

        # Retrieve photo references and construct image URLs
        photo_urls = []
        for photo_info in photos:
            photo_reference = photo_info['photo_reference']
            photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={google_api_key}"
            photo_urls.append(photo_url)

        context = {
            'restaurant': restaurant,
            'name': name,
            'rating': rating,
            'formatted_phone_number': formatted_phone_number,
            'photo_urls': photo_urls,
        }

        return render(request, 'restaurant_detail.html', context)

# Show all restaurants to regular users
@login_required
def restaurant_list_view(request):
    queryset = Restaurant.objects.all()
    context = {
        "object_list": queryset
    }
    return render(request, "restaurant/restaurant_list.html", context)

@login_required
def restaurant_manager_view(request):
    if request.user.is_authenticated:
        if request.user.userprofile.is_manager:
            # Add logic here for manager view
            return render(request, "restaurant/restaurant_manager.html")
        else:
            return redirect('http://127.0.0.1:8000/restaurants/')

def restaurant_delete_view(request, id):
    obj = get_object_or_404(Restaurant, id=id)
    if request.method == "POST":
        if "delete" in request.POST:
            obj.delete()
            return redirect('http://127.0.0.1:8000/restaurants/')
        else:
            return redirect('http://127.0.0.1:8000/restaurants/')
    context = {
        'object': obj
    }
    return render(request, "restaurant/restaurant_delete.html", context)

def dynamic_lookup_view(request, id):
    obj = get_object_or_404(Restaurant, id=id)
    context = {
        'object': obj
    }
    return render(request, "restaurant/restaurant_detail.html", context)

def restaurant_create_view(request):
    context = {}
    return render(request, "restaurant/restaurant_create.html", context)
# def restaurant_create_view(request):
#     form = RestaurantForm(request.POST or None)
#     if form.is_valid():
#         form.save()
#         form = RestaurantForm
#     context = {
#         'form': form
#     }
#     return render(request, "restaurant/restaurant_create.html", context)
