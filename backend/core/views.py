from django.utils import timezone
from rest_framework import generics, permissions, status, views, viewsets
from rest_framework.response import Response

from .models import Contact
from .serializers import AddContactSerializer, ContactSerializer, UserRegistrationSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class UserDataView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UpdateEmailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        return Response({"error": "Cannot update email address at this time."}, status=status.HTTP_403_FORBIDDEN)


class UpdatePhoneView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        return Response({"error": "Cannot update phone number at this time."}, status=status.HTTP_403_FORBIDDEN)


class ContactViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user, is_deleted=False)

    def get_serializer_class(self):
        if self.action == "create":
            return AddContactSerializer
        return ContactSerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()
