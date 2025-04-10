from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User, UserActivity


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'picture', 'bio')}),
        (_('OAuth info'), {'fields': ('provider', 'provider_id')}),
        (_('Additional info'), {'fields': ('phone_number', 'location', 'birth_date')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_staff', 'provider')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'provider')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('email',)


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'timestamp')
    list_filter = ('action', 'timestamp')
    search_fields = ('user__username', 'user__email', 'action')
    date_hierarchy = 'timestamp'
    readonly_fields = ('user', 'action', 'timestamp', 'details')
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
