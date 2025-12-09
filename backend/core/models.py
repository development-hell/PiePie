from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    first_name = models.CharField(max_length=150, blank=False, null=False)  # Compulsory
    last_name = models.CharField(max_length=150, blank=True, null=True)     # Optional
    email = models.EmailField(unique=True, blank=False, null=False)
    phone_number = models.CharField(max_length=15, unique=True, blank=True, null=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    
    # Soft delete fields
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)

    # Auth settings
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'phone_number']

    def __str__(self):
        return self.email
