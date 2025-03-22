<template>
  <BaseCard
    variant="default"
    :hoverable="true"
    :selected="selected"
    :loading="loading"
    :clickable="true"
    @click="$emit('click')"
  >
    <!-- Card Header with Avatar -->
    <template #header>
      <div class="person-header">
        <div class="person-avatar" :class="{ 'person-avatar--deceased': person.deceased }">
          <img 
            v-if="person.avatar" 
            :src="person.avatar" 
            :alt="`Photo of ${person.fullName}`"
            class="person-avatar__image"
          />
          <div v-else class="person-avatar__placeholder">
            {{ getInitials(person.fullName) }}
          </div>
        </div>
        <div class="person-info">
          <h3 class="person-name">
            {{ person.fullName }}
            <span v-if="person.maidenName" class="person-maiden-name">
              (née {{ person.maidenName }})
            </span>
          </h3>
          <p class="person-dates">
            {{ formatLifeDates(person.birthDate, person.deathDate) }}
          </p>
        </div>
      </div>
    </template>

    <!-- Card Content -->
    <div class="person-details">
      <!-- Basic Information -->
      <div class="detail-group">
        <div v-if="person.birthPlace" class="detail-item">
          <MapPinIcon class="detail-icon" />
          <span>Born in {{ person.birthPlace }}</span>
        </div>
        <div v-if="person.currentLocation" class="detail-item">
          <HomeIcon class="detail-icon" />
          <span>Lives in {{ person.currentLocation }}</span>
        </div>
        <div v-if="person.occupation" class="detail-item">
          <BriefcaseIcon class="detail-icon" />
          <span>{{ person.occupation }}</span>
        </div>
      </div>

      <!-- Family Relationships -->
      <div v-if="hasRelationships" class="relationship-group">
        <div v-if="person.spouse" class="relationship-item">
          <HeartIcon class="relationship-icon" />
          <span>Married to {{ person.spouse }}</span>
        </div>
        <div v-if="person.children?.length" class="relationship-item">
          <UsersIcon class="relationship-icon" />
          <span>{{ formatChildrenCount(person.children.length) }}</span>
        </div>
      </div>
    </div>

    <!-- Card Footer -->
    <template #footer>
      <div class="person-actions">
        <CustomButton
          variant="text"
          size="sm"
          @click.stop="$emit('edit')"
          :aria-label="`Edit ${person.fullName}'s information`"
        >
          <PencilIcon class="action-icon" />
          Edit
        </CustomButton>
        <CustomButton
          variant="text"
          size="sm"
          @click.stop="$emit('view-tree')"
          :aria-label="`View ${person.fullName}'s family tree`"
        >
          <ShareIcon class="action-icon" />
          View Tree
        </CustomButton>
      </div>
    </template>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue';
import {
  MapPinIcon,
  HomeIcon,
  BriefcaseIcon,
  HeartIcon,
  UsersIcon,
  PencilIcon,
  ShareIcon
} from '@heroicons/vue/24/outline';
import BaseCard from './BaseCard.vue';
import CustomButton from '../buttons/CustomButton.vue';

const props = defineProps({
  person: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.fullName && (value.birthDate || value.deathDate);
    }
  },
  selected: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click', 'edit', 'view-tree']);

const hasRelationships = computed(() => {
  return props.person.spouse || (props.person.children?.length > 0);
});

const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

const formatLifeDates = (birthDate, deathDate) => {
  const birth = birthDate ? new Date(birthDate).getFullYear() : '?';
  const death = deathDate ? new Date(deathDate).getFullYear() : props.person.deceased ? '?' : 'Present';
  return `${birth} - ${death}`;
};

const formatChildrenCount = (count) => {
  return `${count} ${count === 1 ? 'Child' : 'Children'}`;
};
</script>

<style scoped>
.person-header {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.person-avatar {
  width: 64px;
  height: 64px;
  border-radius: var(--border-radius-full);
  overflow: hidden;
  flex-shrink: 0;
  border: var(--border-width-base) solid var(--color-gray-200);
}

.person-avatar--deceased {
  filter: grayscale(100%);
  opacity: 0.8;
}

.person-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.person-avatar__placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--color-gray-200);
  color: var(--color-gray-600);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
}

.person-info {
  flex-grow: 1;
  min-width: 0;
}

.person-name {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  line-height: var(--line-height-tight);
}

.person-maiden-name {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  font-weight: var(--font-weight-normal);
}

.person-dates {
  margin: var(--spacing-xxs) 0 0;
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.person-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.detail-group,
.relationship-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.detail-item,
.relationship-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
}

.detail-icon,
.relationship-icon {
  width: var(--font-size-base);
  height: var(--font-size-base);
  color: var(--color-gray-500);
  flex-shrink: 0;
}

.person-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
}

.action-icon {
  width: var(--font-size-base);
  height: var(--font-size-base);
}

/* Responsive Design */
@media (max-width: var(--breakpoint-md)) {
  .person-header {
    gap: var(--spacing-sm);
  }

  .person-avatar {
    width: 48px;
    height: 48px;
  }

  .person-name {
    font-size: var(--font-size-base);
  }

  .person-maiden-name {
    display: block;
    margin-top: var(--spacing-xxs);
  }
}
</style> 