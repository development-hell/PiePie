from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ChatViewSet

router = DefaultRouter()
# Register ChatViewSet.
# Note: It's a ViewSet but we are using @action custom routes mostly.
# We register it at 'chats' to provide base.
router.register(r"chats", ChatViewSet, basename="chat")

urlpatterns = [
    path("", include(router.urls)),
]
