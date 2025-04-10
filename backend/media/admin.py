from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html

from .models import (
    MediaCategory, MediaItem, Tag, MediaTag, 
    PersonInMedia, Album, MediaInAlbum
)


class MediaTagInline(admin.TabularInline):
    model = MediaTag
    extra = 1
    autocomplete_fields = ['tag']


class PersonInMediaInline(admin.TabularInline):
    model = PersonInMedia
    extra = 1
    autocomplete_fields = ['person', 'added_by']


class MediaInAlbumInline(admin.TabularInline):
    model = MediaInAlbum
    extra = 1
    autocomplete_fields = ['media_item']


@admin.register(MediaCategory)
class MediaCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name', 'description')


@admin.register(MediaItem)
class MediaItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'media_type', 'date_taken', 'uploader', 'thumbnail_preview', 'is_public')
    list_filter = ('media_type', 'is_public', 'date_uploaded', 'categories')
    search_fields = ('title', 'description', 'location')
    readonly_fields = ('date_uploaded', 'last_modified', 'thumbnail_preview', 'file_extension')
    autocomplete_fields = ['uploader']
    filter_horizontal = ('categories',)
    inlines = [MediaTagInline, PersonInMediaInline]
    
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'media_type', 'is_public')
        }),
        (_('File / URL'), {
            'fields': ('file', 'url', 'thumbnail_preview')
        }),
        (_('Dates'), {
            'fields': ('date_taken', 'date_uploaded', 'last_modified')
        }),
        (_('Location'), {
            'fields': ('location', ('latitude', 'longitude'))
        }),
        (_('Organization'), {
            'fields': ('categories', 'uploader')
        }),
        (_('Metadata'), {
            'fields': ('metadata',)
        }),
    )
    
    def thumbnail_preview(self, obj):
        if obj.is_image and obj.file:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 300px;" />', obj.file.url)
        elif obj.url and obj.is_image:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 300px;" />', obj.url)
        return "No image preview available"
    
    thumbnail_preview.short_description = _('Thumbnail')


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name', 'description')


@admin.register(MediaTag)
class MediaTagAdmin(admin.ModelAdmin):
    list_display = ('media_item', 'tag', 'added_by', 'added_at')
    list_filter = ('tag', 'added_at')
    search_fields = ('media_item__title', 'tag__name')
    autocomplete_fields = ['media_item', 'tag', 'added_by']


@admin.register(PersonInMedia)
class PersonInMediaAdmin(admin.ModelAdmin):
    list_display = ('person', 'media_item', 'added_by', 'added_at')
    list_filter = ('added_at',)
    search_fields = ('person__first_name', 'person__last_name', 'media_item__title')
    autocomplete_fields = ['person', 'media_item', 'added_by']


@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'created_at', 'is_public')
    list_filter = ('is_public', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ['cover_image', 'created_by']
    inlines = [MediaInAlbumInline]


@admin.register(MediaInAlbum)
class MediaInAlbumAdmin(admin.ModelAdmin):
    list_display = ('media_item', 'album', 'order', 'added_at')
    list_filter = ('album', 'added_at')
    search_fields = ('media_item__title', 'album__title')
    autocomplete_fields = ['media_item', 'album']
