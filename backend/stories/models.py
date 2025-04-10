from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class Story(models.Model):
    """Model for storing stories and narratives."""
    
    STORY_STATUS = (
        ('DRAFT', _('Draft')),
        ('PUBLISHED', _('Published')),
        ('ARCHIVED', _('Archived')),
    )
    
    title = models.CharField(_('title'), max_length=255)
    content = models.TextField(_('content'))
    
    # Metadata
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='authored_stories'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Publishing info
    status = models.CharField(_('status'), max_length=10, choices=STORY_STATUS, default='DRAFT')
    publish_date = models.DateTimeField(_('publish date'), null=True, blank=True)
    is_public = models.BooleanField(_('public'), default=False)
    
    # Optional fields
    summary = models.TextField(_('summary'), blank=True)
    featured_image = models.ForeignKey(
        'media.MediaItem',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='featured_in_stories'
    )
    
    # Story event date (when the story took place)
    event_date = models.DateField(_('event date'), null=True, blank=True)
    event_location = models.CharField(_('event location'), max_length=255, blank=True)
    
    # Tags handled through StoryTag model
    
    class Meta:
        verbose_name = _('story')
        verbose_name_plural = _('stories')
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class StoryTag(models.Model):
    """Tags for stories."""
    
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='tags')
    tag = models.ForeignKey('media.Tag', on_delete=models.CASCADE, related_name='tagged_stories')
    
    class Meta:
        verbose_name = _('story tag')
        verbose_name_plural = _('story tags')
        unique_together = ('story', 'tag')
    
    def __str__(self):
        return f"{self.story} - {self.tag}"


class StoryReference(models.Model):
    """Model for linking stories to other entities (people, media, etc.)."""
    
    REFERENCE_TYPES = (
        ('PERSON', _('Person')),
        ('MEDIA', _('Media Item')),
        ('LOCATION', _('Location')),
        ('EVENT', _('Event')),
        ('URL', _('External URL')),
        ('OTHER', _('Other')),
    )
    
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='references')
    reference_type = models.CharField(_('reference type'), max_length=10, choices=REFERENCE_TYPES)
    
    # For PERSON references
    person = models.ForeignKey(
        'family_tree.Person',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='mentioned_in_stories'
    )
    
    # For MEDIA references
    media_item = models.ForeignKey(
        'media.MediaItem',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='referenced_in_stories'
    )
    
    # For URL and OTHER references
    title = models.CharField(_('title'), max_length=255, blank=True)
    url = models.URLField(_('URL'), blank=True)
    
    # Common fields
    description = models.TextField(_('description'), blank=True)
    position = models.PositiveIntegerField(_('position'), default=0)
    
    class Meta:
        verbose_name = _('story reference')
        verbose_name_plural = _('story references')
        ordering = ['story', 'position']
    
    def __str__(self):
        if self.reference_type == 'PERSON' and self.person:
            return f"{self.story} - Person: {self.person}"
        elif self.reference_type == 'MEDIA' and self.media_item:
            return f"{self.story} - Media: {self.media_item}"
        elif self.reference_type == 'URL':
            return f"{self.story} - URL: {self.title or self.url}"
        return f"{self.story} - {self.get_reference_type_display()}: {self.title}"


class Comment(models.Model):
    """Model for comments on stories."""
    
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='story_comments'
    )
    
    content = models.TextField(_('content'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # For threaded comments
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )
    
    class Meta:
        verbose_name = _('comment')
        verbose_name_plural = _('comments')
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.author} on {self.story}"


class StoryCollection(models.Model):
    """Model for organizing stories into collections."""
    
    title = models.CharField(_('title'), max_length=255)
    description = models.TextField(_('description'), blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_story_collections'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(_('public'), default=False)
    
    # Stories in collection handled through StoryInCollection model
    
    class Meta:
        verbose_name = _('story collection')
        verbose_name_plural = _('story collections')
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class StoryInCollection(models.Model):
    """Junction model for organizing stories in collections."""
    
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='collection_entries')
    collection = models.ForeignKey(StoryCollection, on_delete=models.CASCADE, related_name='stories')
    order = models.PositiveIntegerField(_('order'), default=0)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('story in collection')
        verbose_name_plural = _('stories in collections')
        ordering = ['order', 'added_at']
        unique_together = ('story', 'collection')
    
    def __str__(self):
        return f"{self.story} in {self.collection}"
