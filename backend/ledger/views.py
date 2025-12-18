import datetime

from core.serializers import PublicUserSerializer
from django.contrib.auth import get_user_model
from django.db.models import Q, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .models import Message, Transaction
from .serializers import CreateMessageSerializer, MessageSerializer

User = get_user_model()


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class ChatViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    @action(detail=False, methods=["get"])
    def recent_chats(self, request):
        """
        Returns a list of users the current user has chatted/transacted with,
        ordered by the most recent activity.
        """
        user = request.user

        # We need to find the latest message for each distinct counterpart.
        # Strategy: Get all messages involving user, annotate/order, then distinct in Python.
        # Note: distinct on fields is Postgres only, but we want universal support if possible.
        # Python set filtering is easier for MVP.

        start_msgs = (
            Message.objects.filter(Q(sender=user) | Q(recipient=user)).select_related("sender", "recipient", "transaction").order_by("-created_at")
        )

        chats = []
        seen_users = set()

        for msg in start_msgs:
            other_user = msg.recipient if msg.sender == user else msg.sender
            if other_user.id not in seen_users:
                seen_users.add(other_user.id)
                chats.append({"user": PublicUserSerializer(other_user).data, "last_message": MessageSerializer(msg).data})

        return Response(chats)

    @action(detail=False, methods=["get"], url_path=r"(?P<username>[^/.]+)/messages")
    def messages(self, request, username=None):
        """
        Get chat history with a specific user.
        Supports:
        - Pagination (default 20 items)
        - Polling via '?after=<timestamp>' (returns messages created after this time)
        """
        user = request.user
        try:
            other_user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        # Base Query
        msgs = Message.objects.filter((Q(sender=user) & Q(recipient=other_user)) | (Q(sender=other_user) & Q(recipient=user))).select_related(
            "transaction", "sender", "recipient"
        )

        # Polling: If 'after' is provided, we just want everything NEWER than that
        after_timestamp = request.query_params.get("after")
        if after_timestamp:
            msgs = msgs.filter(created_at__gt=after_timestamp).order_by("created_at")  # Oldest -> Newest for appending
            return Response(MessageSerializer(msgs, many=True).data)

        # Pagination: Standard history load (Latest First)
        paginator = StandardResultsSetPagination()
        msgs = msgs.order_by("-created_at")
        page = paginator.paginate_queryset(msgs, request)

        if page is not None:
            # We return paged results. Note: They are ordered -created_at (Newest First).
            # Frontend will likely want to reverse them to display Chronologically.
            serializer = MessageSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = MessageSerializer(msgs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"], url_path=r"(?P<username>[^/.]+)/send")
    def send_message(self, request, username=None):
        """
        Send a message or create a transaction (Pay or Request).
        """
        user = request.user
        try:
            recipient = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        if recipient == user:
            return Response({"error": "Cannot chat with yourself"}, status=400)

        serializer = CreateMessageSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data

            # 1. Handle Transaction if amount present
            transaction = None
            if data.get("amount"):
                t_type = data.get("transaction_type", "pay")

                # Determine Payer/Recipient based on type
                if t_type == "pay":
                    real_payer = user
                    real_recipient = recipient
                else:  # request
                    real_payer = recipient
                    real_recipient = user

                transaction = Transaction.objects.create(
                    payer=real_payer,
                    recipient=real_recipient,
                    amount=data["amount"],
                    description=data.get("description", "Money Transfer"),
                    created_by=user,
                    status=Transaction.Status.PENDING,
                )

            # 2. Create Message
            # If no content but transaction exists, generate default content
            content = data.get("content")
            if not content and transaction:
                if data.get("transaction_type") == "request":
                    content = f"📄 Requested ${data['amount']}"
                else:
                    content = f"💸 Sent ${data['amount']}"

            message = Message.objects.create(sender=user, recipient=recipient, content=content, transaction=transaction)

            return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path=r"transaction/(?P<pk>[^/.]+)/confirm")
    def confirm_transaction(self, request, pk=None):
        try:
            txn = Transaction.objects.get(pk=pk)
        except Transaction.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=404)

        # Security: Only the user who DID NOT create it can confirm it
        if request.user == txn.created_by:
            return Response({"error": "You cannot confirm your own request"}, status=403)

        # Also verify the user is actually involved
        if request.user not in [txn.payer, txn.recipient]:
            return Response({"error": "Not involved in transaction"}, status=403)

        if txn.status != Transaction.Status.PENDING:
            return Response({"error": "Transaction already processed"}, status=400)

        txn.status = Transaction.Status.CONFIRMED
        txn.save()
        return Response({"status": "confirmed"})

    @action(detail=False, methods=["post"], url_path=r"transaction/(?P<pk>[^/.]+)/reject")
    def reject_transaction(self, request, pk=None):
        try:
            txn = Transaction.objects.get(pk=pk)
        except Transaction.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=404)

        # Security: Only the user who DID NOT create it can reject it (usually)
        # Actually, maybe the creator can cancel?
        # Requirement: "option for other user to confirm".
        # Let's allow counterparty to reject. Creator can maybe delete? Soft delete covers deletion.

        if request.user == txn.created_by:
            return Response({"error": "You cannot reject your own request (delete it instead)"}, status=403)

        if request.user not in [txn.payer, txn.recipient]:
            return Response({"error": "Not involved"}, status=403)

        if txn.status != Transaction.Status.PENDING:
            return Response({"error": "Transaction already processed"}, status=400)

        txn.status = Transaction.Status.REJECTED
        txn.save()
        return Response({"status": "rejected"})


class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["get"])
    def stats(self, request):
        """
        Returns aggregated stats:
        - total_sent: Confirmed payments made by user
        - total_received: Confirmed payments received by user
        - pending_action_count: Transactions waiting for user's action
        """
        user = request.user

        # 1. Totals (Confirmed only)
        # Sent: User is payer
        total_sent = Transaction.objects.filter(payer=user, status=Transaction.Status.CONFIRMED).aggregate(total=Sum("amount"))["total"] or 0

        # Received: User is recipient
        total_received = Transaction.objects.filter(recipient=user, status=Transaction.Status.CONFIRMED).aggregate(total=Sum("amount"))["total"] or 0

        # 2. Pending Actions (Where user needs to act)
        # - Received a REQUEST (user is payer, status pending)
        # - Received a PAYMENT to confirm (user is recipient, status pending)
        # Wait, per 'confirm_transaction' logic:
        # "Only the user who DID NOT create it can confirm it"
        # So we check if user is NOT created_by AND is involved.
        pending_count = (
            Transaction.objects.filter(status=Transaction.Status.PENDING).filter(Q(payer=user) | Q(recipient=user)).exclude(created_by=user).count()
        )

        return Response({"total_sent": total_sent, "total_received": total_received, "pending_action_count": pending_count})

    @action(detail=False, methods=["get"])
    def activity(self, request):
        """
        Returns top 10 most recent transactions across all chats.
        """
        user = request.user
        # All transactions involving user
        recent_txns = (
            Transaction.objects.filter(Q(payer=user) | Q(recipient=user))
            .select_related("payer", "recipient", "created_by")
            .order_by("-created_at")[:10]
        )

        from .serializers import TransactionSerializer

        return Response(TransactionSerializer(recent_txns, many=True).data)

    @action(detail=False, methods=["get"])
    def graph_data(self, request):
        """
        Returns time-series data for graphs.
        Params:
        - filter: 'all' (default), 'sent', 'received'
        - range: '7d' (default), '30d', '90d', '1y'
        """
        user = request.user
        filter_type = request.query_params.get("filter", "all")
        range_param = request.query_params.get("range", "7d")

        # 1. Determine Date Range
        now = timezone.now()
        if range_param == "30d":
            start_date = now - datetime.timedelta(days=30)
        elif range_param == "90d":
            start_date = now - datetime.timedelta(days=90)
        elif range_param == "1y":
            start_date = now - datetime.timedelta(days=365)
        else:  # 7d
            start_date = now - datetime.timedelta(days=7)

        # 2. Base Query (Confirmed Only)
        queryset = Transaction.objects.filter(status=Transaction.Status.CONFIRMED, created_at__gte=start_date)

        # 3. Apply Filter
        if filter_type == "sent":
            queryset = queryset.filter(payer=user)
        elif filter_type == "received":
            queryset = queryset.filter(recipient=user)
        elif filter_type == "owned":
            queryset = queryset.filter(created_by=user)
        elif filter_type == "not_owned":
            queryset = queryset.exclude(created_by=user)
        else:
            queryset = queryset.filter(Q(payer=user) | Q(recipient=user))

        # 4. Aggregation by Date
        # We want a list of { date: 'YYYY-MM-DD', amount: X }
        # TruncDate is useful here.

        data = queryset.annotate(date=TruncDate("created_at")).values("date").annotate(amount=Sum("amount")).order_by("date")

        # Limit valid return format
        return Response(list(data))
