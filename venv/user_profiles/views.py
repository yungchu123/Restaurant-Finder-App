from django.shortcuts import render, redirect
from django.contrib.auth import login
from .models import UserProfile
from .forms import CustomUserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from .forms import CustomLoginForm  # Create a custom login form

from django.contrib import messages


def custom_login(request):
    if request.method == 'POST':
        form = CustomLoginForm(request, request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                # Redirect to the desired page after successful login
                if user.userprofile.is_manager:
                    return redirect('http://127.0.0.1:8000/manage/')
                else:
                    return redirect('http://127.0.0.1:8000/restaurants/')
    else:
        form = CustomLoginForm()
    return render(request, 'registration/login.html', {'form': form})

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            
            # Set the is_manager property on the UserProfile model
            user.userprofile.is_manager = form.cleaned_data['is_manager']
            user.userprofile.save()

            password = form.cleaned_data['password1']
            user.set_password(password)
            user.save()

            user = authenticate(username=user.username, password=password)
            if user is not None:
                login(request, user)

            if user.userprofile.is_manager:
                return redirect('http://127.0.0.1:8000/manage/')
            else:
                return redirect('http://127.0.0.1:8000/restaurants/')
    else:
        form = CustomUserCreationForm()
    return render(request, 'registration/register.html', {'form': form})



@login_required
def user_profile(request):
    user = request.user
    is_manager = user.userprofile.is_manager  # Assuming you have a user profile model with is_manager field
    # Add any additional logic or data you want to display on the profile page
    if is_manager:
        # If the user is a manager, redirect to the manager page
        return redirect('http://127.0.0.1:8000/restaurants/manage/')
    else:
        # If the user is a regular user, redirect to the list of all restaurants
        return redirect('http://127.0.0.1:8000/restaurants/')
