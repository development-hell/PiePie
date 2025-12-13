from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Contact

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email", "phone_number", "profile_photo", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data.get("last_name", ""),
            phone_number=validated_data.get("phone_number", ""),
            profile_photo=validated_data.get("profile_photo", None),
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "phone_number", "profile_photo"]
        read_only_fields = ["email", "phone_number"]


class ContactSerializer(serializers.ModelSerializer):
    contact = UserSerializer(read_only=True)

    class Meta:
        model = Contact
        fields = ["id", "user", "contact", "created_at", "allow_transactions", "auto_accept_transactions"]
        read_only_fields = ["id", "user", "created_at"]


class AddContactSerializer(serializers.Serializer):
    username = serializers.CharField()

    def validate_username(self, value):
        user = self.context["request"].user

        # 1. Check exists
        try:
            contact_user = User.objects.get(username=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this username does not exist.")

        # 2. Check not self
        if contact_user == user:
            raise serializers.ValidationError("You cannot add yourself as a contact.")

        # 3. Check not already added (active)
        if Contact.objects.filter(user=user, contact=contact_user, is_deleted=False).exists():
            raise serializers.ValidationError("This user is already in your contacts.")

        return value

    def to_representation(self, instance):
        return ContactSerializer(instance).data

    def create(self, validated_data):
        user = self.context["request"].user
        contact_user = User.objects.get(username=validated_data["username"])

        # Check if soft deleted record exists, if so reactivate
        # Note: We filter by user/contact index.
        contact_record = Contact.objects.filter(user=user, contact=contact_user).first()

        if contact_record:
            contact_record.is_deleted = False
            contact_record.deleted_at = None
            # Reset settings on re-add? Optional. Let's keep previous settings for now or reset defaults.
            # Keeping settings seems friendlier.
            contact_record.save()
            return contact_record

        return Contact.objects.create(user=user, contact=contact_user)
