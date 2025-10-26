from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, BookingViewSet, register_user, user_profile

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', register_user, name='register'),
    path('auth/profile/', user_profile, name='profile'),
]