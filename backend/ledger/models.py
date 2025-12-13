from core.models import User
from django.db import models


class Transaction(models.Model):
    payer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions_paid")
    # For MVP 1:1, we can have a single borrower/recipient.
    # In future, this could be a separate Split model, but for now let's keep it simple.
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions_received")

    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=255)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.payer} paid {self.amount} to {self.recipient}"


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")

    content = models.TextField(blank=True)  # Can be empty if it's just a transaction wrapper

    # Optional link to a transaction
    transaction = models.OneToOneField(Transaction, on_delete=models.SET_NULL, null=True, blank=True, related_name="message")

    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["sender", "recipient", "created_at"]),
        ]

    def __str__(self):
        return f"Msg from {self.sender} to {self.recipient} at {self.created_at}"
