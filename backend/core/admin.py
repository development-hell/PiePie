from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'phone_number', 'is_deleted')
    search_fields = ('email', 'username', 'first_name', 'phone_number')
    list_filter = ('is_deleted', 'is_staff', 'is_superuser')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone_number', 'profile_photo')}),
        ('Soft Delete', {'fields': ('is_deleted', 'deleted_at')}),
    )
