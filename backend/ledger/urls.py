from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ChatViewSet, DashboardViewSet

router = DefaultRouter()
# Register ChatViewSet.
# Note: It's a ViewSet but we are using @action custom routes mostly.
# We register it at 'chats' to provide base.
router.register(r"chats", ChatViewSet, basename="chat")
router.register(r"dashboard", DashboardViewSet, basename="dashboard")

urlpatterns = [
    path("", include(router.urls)),
]
