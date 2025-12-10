from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, LogoutView, UserDataView, UpdateEmailView, UpdatePhoneView

urlpatterns = [
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    # path('auth/login/', LoginView.as_view(), name='login'), # Deprecating old session login
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/user/', UserDataView.as_view(), name='user_data'),
    path('auth/update-email/', UpdateEmailView.as_view(), name='update_email'),
    path('auth/update-phone/', UpdatePhoneView.as_view(), name='update_phone'),
]
