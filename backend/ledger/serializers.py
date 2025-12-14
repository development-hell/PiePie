from core.models import User
from core.serializers import UserSerializer
from rest_framework import serializers

from .models import Message, Transaction


class TransactionSerializer(serializers.ModelSerializer):
    payer = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)

    payer_id = serializers.PrimaryKeyRelatedField(source="payer", queryset=User.objects.all(), write_only=True)
    recipient_id = serializers.PrimaryKeyRelatedField(source="recipient", queryset=User.objects.all(), write_only=True)

    class Meta:
        model = Transaction
        fields = ["id", "payer", "payer_id", "recipient", "recipient_id", "created_by", "amount", "description", "status", "created_at"]


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    # We might not need full recipient details in every message if we know the context
    transaction = TransactionSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "sender", "recipient", "content", "transaction", "created_at", "is_read"]


class CreateMessageSerializer(serializers.Serializer):
    recipient_username = serializers.CharField()
    content = serializers.CharField(required=False, allow_blank=True)

    # Optional transaction fields
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    transaction_type = serializers.ChoiceField(choices=["pay", "request"], required=False, default="pay")

    def validate(self, data):
        if not data.get("content") and not data.get("amount"):
            raise serializers.ValidationError("Must provide either content or transaction amount.")
        return data
