from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.conf import settings


class User(AbstractUser):
    """Custom user model to handle various authentication methods and extended profile."""
    
    email = models.EmailField(_('email address'), unique=True)
    picture = models.URLField(_('profile picture'), blank=True, null=True)
    bio = models.TextField(_('biography'), blank=True)
    
    # OAuth related fields
    provider = models.CharField(_('auth provider'), max_length=50, blank=True)
    provider_id = models.CharField(_('provider ID'), max_length=255, blank=True)
    provider_access_token = models.CharField(_('provider access token'), max_length=255, blank=True)
    provider_refresh_token = models.CharField(_('provider refresh token'), max_length=255, blank=True)
    provider_token_expiry = models.DateTimeField(_('provider token expiry'), null=True, blank=True)
    
    # Additional profile fields
    phone_number = models.CharField(_('phone number'), max_length=20, blank=True)
    location = models.CharField(_('location'), max_length=255, blank=True)
    birth_date = models.DateField(_('birth date'), null=True, blank=True)
    
    # Email verification
    verification_code = models.CharField(_('verification code'), max_length=100, blank=True, null=True)
    email_verified = models.BooleanField(_('email verified'), default=False)
    
    # Registration date (already provided by date_joined in AbstractUser)
    
    # Make email the USERNAME_FIELD
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Email & password automatically required
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        """Return the user's full name."""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username
    
    @property
    def is_google_user(self):
        """Check if user was authenticated via Google."""
        return self.provider == 'google'
    
    @property
    def is_sso_user(self):
        """Check if user was authenticated via any SSO provider."""
        return bool(self.provider and self.provider_id)
    
    def update_from_sso(self, provider_data):
        """Update user profile from SSO provider data."""
        if not self.is_sso_user:
            self.provider = provider_data.get('provider')
            self.provider_id = provider_data.get('provider_id')
        
        # Update profile fields if provided
        if 'email' in provider_data and not self.email:
            self.email = provider_data['email']
        if 'first_name' in provider_data and not self.first_name:
            self.first_name = provider_data['first_name']
        if 'last_name' in provider_data and not self.last_name:
            self.last_name = provider_data['last_name']
        if 'picture' in provider_data and not self.picture:
            self.picture = provider_data['picture']
        
        # Mark email as verified if coming from trusted SSO provider
        if self.provider in ['google', 'microsoft']:
            self.email_verified = True
        
        self.save()


class UserActivity(models.Model):
    """Model to track user activity."""
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict, blank=True)
    
    class Meta:
        verbose_name = _('user activity')
        verbose_name_plural = _('user activities')
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.user} - {self.action} - {self.timestamp}"
