from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    # Check if the user doesn't have a user profile
    if created and not hasattr(instance, 'userprofile'):
        UserProfile.objects.create(user=instance)
    if created:
        UserProfile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    # Check if the user doesn't have a user profile
    if not hasattr(instance, 'userprofile'):
        UserProfile.objects.create(user=instance)
    try:
        instance.userprofile.save()
    except UserProfile.DoesNotExist:
        UserProfile.objects.create(user=instance)
