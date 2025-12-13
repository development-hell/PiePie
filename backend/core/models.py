from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models


class User(AbstractUser):
    username_validator = RegexValidator(regex=r"^[a-zA-Z0-9.-]+$", message="Username can only contain letters, numbers, dots, and dashes.")

    first_name = models.CharField(max_length=20, blank=False, null=False)  # Compulsory
    last_name = models.CharField(max_length=20, blank=True, null=True)  # Optional
    email = models.EmailField(unique=True, blank=False, null=False)
    phone_number = models.CharField(max_length=15, unique=True, blank=True, null=True)
    profile_photo = models.ImageField(upload_to="profile_photos/", blank=True, null=True)

    username = models.CharField(
        max_length=20,
        unique=True,
        help_text="Required. 20 characters or fewer. Letters, digits, dots and dashes only.",
        validators=[username_validator],
        error_messages={
            "unique": "A user with that username already exists.",
        },
    )

    # Soft delete fields
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)

    # Auth settings
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "phone_number"]

    def __str__(self):
        return self.email


class Contact(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="contacts")
    contact = models.ForeignKey(User, on_delete=models.CASCADE, related_name="added_by")
    created_at = models.DateTimeField(auto_now_add=True)

    # Soft delete
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)

    # Contact Level Settings
    allow_transactions = models.BooleanField(default=True)
    auto_accept_transactions = models.BooleanField(default=False)

    class Meta:
        unique_together = ("user", "contact")
        indexes = [
            models.Index(fields=["user", "contact"]),
        ]

    def __str__(self):
        return f"{self.user.username} -> {self.contact.username}"
