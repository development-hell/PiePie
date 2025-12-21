from core.models import User
from core.serializers import PublicUserSerializer
from rest_framework import serializers

from .models import Message, Transaction


class TransactionSerializer(serializers.ModelSerializer):
    payer = PublicUserSerializer(read_only=True)
    recipient = PublicUserSerializer(read_only=True)
    created_by = PublicUserSerializer(read_only=True)

    payer_id = serializers.PrimaryKeyRelatedField(source="payer", queryset=User.objects.all(), write_only=True)
    recipient_id = serializers.PrimaryKeyRelatedField(source="recipient", queryset=User.objects.all(), write_only=True)

    message_id = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = ["id", "payer", "payer_id", "recipient", "recipient_id", "created_by", "amount", "description", "status", "created_at", "message_id"]

    def get_message_id(self, obj):
        if hasattr(obj, "message"):
            return obj.message.id
        return None


class MessageSerializer(serializers.ModelSerializer):
    sender = PublicUserSerializer(read_only=True)
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

        if data.get("amount") is not None and data["amount"] <= 0:
            raise serializers.ValidationError({"amount": "Transaction amount must be positive."})

        return data
