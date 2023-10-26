from django.db import models
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
from django.contrib.auth.models import User


# Create your models here.
class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField(blank=True, null=True)
    place_id = models.CharField(max_length=255, null=True)
    is_featured = models.BooleanField(default=False)
    manager = models.ForeignKey(User, on_delete=models.CASCADE)

    def get_absolute_url(self):
        return reverse("restaurants:restaurant-detail", kwargs={"id": self.id})
