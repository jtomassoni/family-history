from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html

from .models import (
    Story, StoryTag, StoryReference, Comment,
    StoryCollection, StoryInCollection
)


class StoryTagInline(admin.TabularInline):
    model = StoryTag
    extra = 1
    autocomplete_fields = ['tag']


class StoryReferenceInline(admin.TabularInline):
    model = StoryReference
    extra = 1
    autocomplete_fields = ['person', 'media_item']


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    fields = ('author', 'content', 'created_at')
    readonly_fields = ('created_at',)
    autocomplete_fields = ['author', 'parent']


class StoryInCollectionInline(admin.TabularInline):
    model = StoryInCollection
    extra = 1
    autocomplete_fields = ['story']


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'status', 'is_public', 'created_at', 'event_date')
    list_filter = ('status', 'is_public', 'created_at')
    search_fields = ('title', 'content', 'summary', 'event_location')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ['created_by', 'featured_image']
    inlines = [StoryTagInline, StoryReferenceInline, CommentInline]
    
    fieldsets = (
        (None, {
            'fields': ('title', 'content', 'summary')
        }),
        (_('Publishing'), {
            'fields': ('status', 'is_public', 'publish_date')
        }),
        (_('Event Information'), {
            'fields': ('event_date', 'event_location')
        }),
        (_('Media'), {
            'fields': ('featured_image',)
        }),
        (_('Metadata'), {
            'fields': ('created_by', 'created_at', 'updated_at')
        }),
    )


@admin.register(StoryTag)
class StoryTagAdmin(admin.ModelAdmin):
    list_display = ('story', 'tag')
    list_filter = ('tag',)
    search_fields = ('story__title', 'tag__name')
    autocomplete_fields = ['story', 'tag']


@admin.register(StoryReference)
class StoryReferenceAdmin(admin.ModelAdmin):
    list_display = ('story', 'reference_type', 'get_reference_details', 'position')
    list_filter = ('reference_type',)
    search_fields = ('story__title', 'title', 'description')
    autocomplete_fields = ['story', 'person', 'media_item']
    
    def get_reference_details(self, obj):
        if obj.reference_type == 'PERSON' and obj.person:
            return str(obj.person)
        elif obj.reference_type == 'MEDIA' and obj.media_item:
            return str(obj.media_item)
        elif obj.reference_type == 'URL':
            if obj.title:
                return f"{obj.title}: {obj.url}"
            return obj.url
        return obj.title or "-"
    
    get_reference_details.short_description = _('Reference')


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('story', 'author', 'parent', 'content_preview', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'author__username', 'story__title')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ['story', 'author', 'parent']
    
    def content_preview(self, obj):
        return obj.content[:100] + "..." if len(obj.content) > 100 else obj.content
    
    content_preview.short_description = _('Content Preview')


@admin.register(StoryCollection)
class StoryCollectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'is_public', 'created_at')
    list_filter = ('is_public', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ['created_by']
    inlines = [StoryInCollectionInline]


@admin.register(StoryInCollection)
class StoryInCollectionAdmin(admin.ModelAdmin):
    list_display = ('story', 'collection', 'order', 'added_at')
    list_filter = ('collection', 'added_at')
    search_fields = ('story__title', 'collection__title')
    autocomplete_fields = ['story', 'collection']
