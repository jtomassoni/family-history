from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class MediaCategory(models.Model):
    """Model for categorizing media items."""
    
    name = models.CharField(_('name'), max_length=100)
    description = models.TextField(_('description'), blank=True)
    
    class Meta:
        verbose_name = _('media category')
        verbose_name_plural = _('media categories')
        ordering = ['name']
    
    def __str__(self):
        return self.name


class MediaItem(models.Model):
    """Model for all types of media (photos, documents, audio, etc.)."""
    
    MEDIA_TYPES = (
        ('PHOTO', _('Photo')),
        ('DOCUMENT', _('Document')),
        ('AUDIO', _('Audio')),
        ('VIDEO', _('Video')),
        ('OTHER', _('Other')),
    )
    
    title = models.CharField(_('title'), max_length=255)
    description = models.TextField(_('description'), blank=True)
    
    # File or URL
    file = models.FileField(_('file'), upload_to='media_items/%Y/%m/', blank=True, null=True)
    url = models.URLField(_('external URL'), blank=True, null=True)
    
    # Media type and metadata
    media_type = models.CharField(_('media type'), max_length=10, choices=MEDIA_TYPES, default='PHOTO')
    categories = models.ManyToManyField(MediaCategory, blank=True, related_name='media_items')
    
    # Date information
    date_taken = models.DateField(_('date taken/created'), null=True, blank=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    
    # Location information
    location = models.CharField(_('location'), max_length=255, blank=True)
    latitude = models.DecimalField(_('latitude'), max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(_('longitude'), max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Ownership and permissions
    uploader = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_media'
    )
    is_public = models.BooleanField(_('public'), default=False)
    
    # Additional metadata (for EXIF data, document info, etc.)
    metadata = models.JSONField(_('metadata'), default=dict, blank=True)
    
    class Meta:
        verbose_name = _('media item')
        verbose_name_plural = _('media items')
        ordering = ['-date_uploaded']
    
    def __str__(self):
        return self.title
    
    @property
    def file_extension(self):
        """Get the file extension."""
        if self.file:
            return self.file.name.split('.')[-1].lower()
        return None
    
    @property
    def is_image(self):
        """Check if the media item is an image."""
        if self.media_type == 'PHOTO':
            return True
        if self.file_extension in ['jpg', 'jpeg', 'png', 'gif', 'webp']:
            return True
        return False


class Tag(models.Model):
    """Model for tagging media items."""
    
    name = models.CharField(_('name'), max_length=100, unique=True)
    description = models.TextField(_('description'), blank=True)
    
    class Meta:
        verbose_name = _('tag')
        verbose_name_plural = _('tags')
        ordering = ['name']
    
    def __str__(self):
        return self.name


class MediaTag(models.Model):
    """Junction model for linking tags to media items."""
    
    media_item = models.ForeignKey(MediaItem, on_delete=models.CASCADE, related_name='tagged_items')
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name='media_tags')
    added_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_media_tags'
    )
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('media tag')
        verbose_name_plural = _('media tags')
        unique_together = ('media_item', 'tag')
    
    def __str__(self):
        return f"{self.media_item} - {self.tag}"


class PersonInMedia(models.Model):
    """Model for tagging people in media items."""
    
    media_item = models.ForeignKey(MediaItem, on_delete=models.CASCADE, related_name='tagged_people')
    person = models.ForeignKey(
        'family_tree.Person',  # Using string to avoid circular import
        on_delete=models.CASCADE,
        related_name='media_appearances'
    )
    
    # For photos, allow tagging specific regions
    position_x = models.FloatField(_('position X'), null=True, blank=True)
    position_y = models.FloatField(_('position Y'), null=True, blank=True)
    width = models.FloatField(_('width'), null=True, blank=True)
    height = models.FloatField(_('height'), null=True, blank=True)
    
    # Metadata
    added_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_person_tags'
    )
    added_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(_('notes'), blank=True)
    
    class Meta:
        verbose_name = _('person in media')
        verbose_name_plural = _('people in media')
        unique_together = ('media_item', 'person')
    
    def __str__(self):
        return f"{self.person} in {self.media_item}"


class Album(models.Model):
    """Model for organizing media items into albums."""
    
    title = models.CharField(_('title'), max_length=255)
    description = models.TextField(_('description'), blank=True)
    cover_image = models.ForeignKey(
        MediaItem,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='cover_for_albums'
    )
    
    # Album items handled through reverse relationship from MediaInAlbum
    
    # Ownership and permissions
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_albums'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(_('public'), default=False)
    
    class Meta:
        verbose_name = _('album')
        verbose_name_plural = _('albums')
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class MediaInAlbum(models.Model):
    """Junction model for organizing media items in albums."""
    
    media_item = models.ForeignKey(MediaItem, on_delete=models.CASCADE, related_name='album_entries')
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='media_items')
    order = models.PositiveIntegerField(_('order'), default=0)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('media in album')
        verbose_name_plural = _('media in albums')
        ordering = ['order', 'added_at']
        unique_together = ('media_item', 'album')
    
    def __str__(self):
        return f"{self.media_item} in {self.album}"
