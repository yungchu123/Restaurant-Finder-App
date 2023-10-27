from django import forms
from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User 
from django.contrib.auth.forms import AuthenticationForm

class CustomLoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'custom-class'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'custom-class'}))

class CustomUserCreationForm(UserCreationForm):
    is_manager = forms.BooleanField(
        required=False,
        initial=False,  # Set the initial value to False
        label="Are you a restaurant manager? (Tick if yes)"
    )

    class Meta:
        model = User
        fields = UserCreationForm.Meta.fields + ('is_manager',)
