from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class Person(models.Model):
    """
    Model representing a person in the family tree.
    A person may or may not be a user of the application.
    """
    
    GENDER_CHOICES = (
        ('M', _('Male')),
        ('F', _('Female')),
        ('O', _('Other')),
        ('U', _('Unknown')),
    )
    
    # Basic information
    first_name = models.CharField(_('first name'), max_length=100)
    middle_name = models.CharField(_('middle name'), max_length=100, blank=True)
    last_name = models.CharField(_('last name'), max_length=100)
    maiden_name = models.CharField(_('maiden name'), max_length=100, blank=True)
    gender = models.CharField(_('gender'), max_length=1, choices=GENDER_CHOICES, default='U')
    
    # Birth and death information
    birth_date = models.DateField(_('birth date'), null=True, blank=True)
    birth_place = models.CharField(_('birth place'), max_length=255, blank=True)
    death_date = models.DateField(_('death date'), null=True, blank=True)
    death_place = models.CharField(_('death place'), max_length=255, blank=True)
    
    # Biographical information
    bio = models.TextField(_('biography'), blank=True)
    
    # Link to user account if this person has one
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='person_profile'
    )
    
    # Metadata fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_people'
    )
    
    # Fields for genealogical research
    notes = models.TextField(_('research notes'), blank=True)
    external_id = models.CharField(_('external ID'), max_length=255, blank=True, 
                                  help_text=_('ID from an external genealogy system'))
    
    class Meta:
        verbose_name = _('person')
        verbose_name_plural = _('people')
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def full_name(self):
        """Return the person's full name."""
        if self.middle_name:
            return f"{self.first_name} {self.middle_name} {self.last_name}"
        return f"{self.first_name} {self.last_name}"
    
    @property
    def age(self):
        """Calculate age or age at death."""
        from datetime import date
        
        if self.birth_date is None:
            return None
            
        # If the person has died, calculate age at death
        if self.death_date:
            end_date = self.death_date
        else:
            end_date = date.today()
            
        # Calculate age
        age = end_date.year - self.birth_date.year
        # Adjust for birthdays that haven't occurred yet this year
        if end_date.month < self.birth_date.month or (
            end_date.month == self.birth_date.month and 
            end_date.day < self.birth_date.day
        ):
            age -= 1
            
        return age


class Relationship(models.Model):
    """
    Model representing a relationship between two people in the family tree.
    """
    
    RELATIONSHIP_TYPES = (
        ('PARENT', _('Parent')),
        ('CHILD', _('Child')),
        ('SPOUSE', _('Spouse')),
        ('SIBLING', _('Sibling')),
        ('ADOPTED', _('Adopted')),
        ('OTHER', _('Other')),
    )
    
    person1 = models.ForeignKey(
        Person, 
        on_delete=models.CASCADE,
        related_name='relationships_as_person1'
    )
    person2 = models.ForeignKey(
        Person, 
        on_delete=models.CASCADE,
        related_name='relationships_as_person2'
    )
    relationship_type = models.CharField(
        _('relationship type'),
        max_length=20,
        choices=RELATIONSHIP_TYPES
    )
    
    # For marriages/partnerships
    start_date = models.DateField(_('start date'), null=True, blank=True)
    end_date = models.DateField(_('end date'), null=True, blank=True)
    
    # Additional information
    description = models.TextField(_('description'), blank=True)
    
    class Meta:
        verbose_name = _('relationship')
        verbose_name_plural = _('relationships')
        unique_together = ('person1', 'person2', 'relationship_type')
    
    def __str__(self):
        return f"{self.person1} is {self.get_relationship_type_display()} of {self.person2}"


class FamilyGroup(models.Model):
    """
    Model representing a family unit (e.g., household, nuclear family).
    """
    
    name = models.CharField(_('name'), max_length=255)
    description = models.TextField(_('description'), blank=True)
    members = models.ManyToManyField(
        Person,
        through='FamilyGroupMembership',
        related_name='family_groups'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_family_groups'
    )
    
    class Meta:
        verbose_name = _('family group')
        verbose_name_plural = _('family groups')
    
    def __str__(self):
        return self.name


class FamilyGroupMembership(models.Model):
    """
    Junction table for family group membership with role.
    """
    
    ROLES = (
        ('HEAD', _('Head of Household')),
        ('SPOUSE', _('Spouse')),
        ('CHILD', _('Child')),
        ('OTHER', _('Other')),
    )
    
    person = models.ForeignKey(
        Person,
        on_delete=models.CASCADE,
        related_name='family_memberships'
    )
    family_group = models.ForeignKey(
        FamilyGroup,
        on_delete=models.CASCADE,
        related_name='memberships'
    )
    role = models.CharField(_('role'), max_length=20, choices=ROLES)
    notes = models.TextField(_('notes'), blank=True)
    
    class Meta:
        verbose_name = _('family group membership')
        verbose_name_plural = _('family group memberships')
        unique_together = ('person', 'family_group')
    
    def __str__(self):
        return f"{self.person} is {self.get_role_display()} in {self.family_group}"
