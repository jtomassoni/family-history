from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from .models import Person, Relationship, FamilyGroup, FamilyGroupMembership


class FamilyGroupMembershipInline(admin.TabularInline):
    model = FamilyGroupMembership
    extra = 1
    autocomplete_fields = ['person']


class RelationshipInline(admin.TabularInline):
    model = Relationship
    fk_name = 'person1'
    extra = 1
    autocomplete_fields = ['person2']
    verbose_name = _("Outgoing Relationship")
    verbose_name_plural = _("Outgoing Relationships")


class IncomingRelationshipInline(admin.TabularInline):
    model = Relationship
    fk_name = 'person2'
    extra = 1
    autocomplete_fields = ['person1']
    verbose_name = _("Incoming Relationship")
    verbose_name_plural = _("Incoming Relationships")


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'gender', 'birth_date', 'age', 'death_date', 'created_by')
    list_filter = ('gender', 'created_at')
    search_fields = ('first_name', 'last_name', 'maiden_name', 'bio', 'notes')
    autocomplete_fields = ['user', 'created_by']
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': (('first_name', 'middle_name', 'last_name', 'maiden_name'), 'gender')
        }),
        (_('Birth & Death'), {
            'fields': (('birth_date', 'birth_place'), ('death_date', 'death_place'))
        }),
        (_('Biography'), {
            'fields': ('bio', 'notes')
        }),
        (_('User Account'), {
            'fields': ('user', 'created_by')
        }),
        (_('Metadata'), {
            'fields': (('created_at', 'updated_at'), 'external_id')
        }),
    )
    inlines = [RelationshipInline, IncomingRelationshipInline]


@admin.register(Relationship)
class RelationshipAdmin(admin.ModelAdmin):
    list_display = ('person1', 'relationship_type', 'person2', 'start_date', 'end_date')
    list_filter = ('relationship_type',)
    search_fields = ('person1__first_name', 'person1__last_name', 'person2__first_name', 'person2__last_name')
    autocomplete_fields = ['person1', 'person2']
    fieldsets = (
        (None, {
            'fields': (('person1', 'relationship_type', 'person2'),)
        }),
        (_('Dates'), {
            'fields': (('start_date', 'end_date'),)
        }),
        (_('Additional Information'), {
            'fields': ('description',)
        }),
    )


@admin.register(FamilyGroup)
class FamilyGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'created_at')
    search_fields = ('name', 'description')
    autocomplete_fields = ['created_by']
    readonly_fields = ('created_at', 'updated_at')
    inlines = [FamilyGroupMembershipInline]


@admin.register(FamilyGroupMembership)
class FamilyGroupMembershipAdmin(admin.ModelAdmin):
    list_display = ('person', 'family_group', 'role')
    list_filter = ('role', 'family_group')
    search_fields = ('person__first_name', 'person__last_name', 'family_group__name')
    autocomplete_fields = ['person', 'family_group']
