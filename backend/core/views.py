from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from .serializers import UserRegistrationSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class LogoutView(views.APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)

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
