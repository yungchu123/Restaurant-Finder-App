from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def restaurant_home_view(request, *args, **kwargs):
    return render(request, "restaurant_home.html", {})