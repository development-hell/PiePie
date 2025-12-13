from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import ContactViewSet, RegisterView, UpdateEmailView, UpdatePhoneView, UserDataView

router = DefaultRouter()
router.register(r"contacts", ContactViewSet, basename="contact")

urlpatterns = [
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    # path('auth/login/', LoginView.as_view(), name='login'), # Deprecating old session login
    path("auth/user/", UserDataView.as_view(), name="user_data"),
    path("auth/update-email/", UpdateEmailView.as_view(), name="update_email"),
    path("auth/update-phone/", UpdatePhoneView.as_view(), name="update_phone"),
    path("", include(router.urls)),
]
