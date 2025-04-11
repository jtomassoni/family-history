from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.conf import settings
import uuid


class User(AbstractUser):
    """Custom user model to handle various authentication methods and extended profile."""
    
    email = models.EmailField(_('email address'), unique=True)
    picture = models.URLField(_('profile picture'), blank=True, null=True)
    bio = models.TextField(_('biography'), blank=True)
    
    # OAuth related fields
    provider = models.CharField(_('auth provider'), max_length=50, blank=True)
    provider_id = models.CharField(_('provider ID'), max_length=255, blank=True)
    
    # Additional profile fields
    phone_number = models.CharField(_('phone number'), max_length=20, blank=True)
    location = models.CharField(_('location'), max_length=255, blank=True)
    birth_date = models.DateField(_('birth date'), null=True, blank=True)
    
    # Email verification
    verification_code = models.UUIDField(default=uuid.uuid4, editable=False)
    has_clicked_activation_link = models.BooleanField(default=False)
    
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
