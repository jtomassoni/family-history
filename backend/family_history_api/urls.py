"""
URL configuration for family_history_api project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from users.views import UserViewSet, login, register, verify_email, google_callback, password_reset, get_user_profile

# API Router setup
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

# Authentication URLs
auth_urls = [
    path('login/', login, name='login'),
    path('register/', register, name='register'),
    path('verify-email/<str:verification_code>/', verify_email, name='verify-email'),
    path('google/callback/', google_callback, name='google-callback'),
    path('password-reset/', password_reset, name='password-reset'),
    path('user/', get_user_profile, name='get-user-profile'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    # API endpoints
    path('api/', include(router.urls)),
    path('api/auth/', include(auth_urls)),
    # Social auth URLs
    path('auth/', include('allauth.urls')),
    # We'll add more app-specific URL patterns here later
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
