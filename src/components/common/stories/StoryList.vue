<template>
  <div class="story-list">
    <!-- Filters -->
    <div class="story-filters">
      <div class="search-bar">
        <BaseInput
          v-model="searchQuery"
          placeholder="Search stories..."
          :prefix-icon="MagnifyingGlassIcon"
        />
      </div>
      <div class="filter-options">
        <BaseSelect
          v-model="selectedPerson"
          :options="peopleOptions"
          placeholder="Filter by person"
          size="sm"
        />
        <BaseSelect
          v-model="selectedEvent"
          :options="eventOptions"
          placeholder="Filter by event"
          size="sm"
        />
        <BaseSelect
          v-model="selectedYear"
          :options="yearOptions"
          placeholder="Filter by year"
          size="sm"
        />
        <BaseSelect
          v-model="sortBy"
          :options="[
            { value: 'date-desc', label: 'Newest first' },
            { value: 'date-asc', label: 'Oldest first' },
            { value: 'alpha', label: 'Alphabetical' }
          ]"
          size="sm"
        />
      </div>
      <div class="active-filters" v-if="hasActiveFilters">
        <span class="filter-label">Active filters:</span>
        <div class="filter-tags">
          <span 
            v-for="filter in activeFilters" 
            :key="filter.id" 
            class="filter-tag"
          >
            {{ filter.label }}
            <button 
              @click="removeFilter(filter.id)"
              class="remove-filter"
              :aria-label="`Remove ${filter.label} filter`"
            >
              <XMarkIcon class="remove-icon" />
            </button>
          </span>
        </div>
        <CustomButton
          variant="text"
          size="sm"
          @click="clearFilters"
        >
          Clear all
        </CustomButton>
      </div>
    </div>

    <!-- Timeline View -->
    <div v-if="viewMode === 'timeline'" class="story-timeline">
      <div 
        v-for="(yearGroup, year) in groupedStories" 
        :key="year" 
        class="timeline-year"
      >
        <div class="year-marker">
          <span class="year-label">{{ year }}</span>
          <div class="year-line"></div>
        </div>
        <div class="year-stories">
          <RouterLink
            v-for="story in yearGroup"
            :key="story.id"
            :to="{ name: 'story-viewer', params: { id: story.id }}"
            class="timeline-story"
          >
            <div class="story-preview">
              <img 
                v-if="story.media?.[0]"
                :src="story.media[0].url"
                :alt="story.title"
                class="preview-image"
              />
              <div class="preview-content">
                <h3 class="preview-title">{{ story.title }}</h3>
                <time :datetime="story.date" class="preview-date">
                  {{ formatDate(story.date) }}
                </time>
                <p class="preview-excerpt">{{ truncateText(story.content, 120) }}</p>
                <div class="preview-meta">
                  <div class="people-tags" v-if="story.peopleMentioned?.length">
                    <RouterLink
                      v-for="person in story.peopleMentioned.slice(0, 3)"
                      :key="person.id"
                      :to="{ name: 'person-detail', params: { id: person.id }}"
                      class="person-tag"
                      @click.stop
                    >
                      {{ person.name }}
                    </RouterLink>
                    <span v-if="story.peopleMentioned.length > 3" class="more-people">
                      +{{ story.peopleMentioned.length - 3 }}
                    </span>
                  </div>
                  <div class="event-tags" v-if="story.events?.length">
                    <RouterLink
                      v-for="event in story.events.slice(0, 2)"
                      :key="event.id"
                      :to="{ name: 'event-detail', params: { id: event.id }}"
                      class="event-tag"
                      @click.stop
                    >
                      {{ event.name }}
                    </RouterLink>
                    <span v-if="story.events.length > 2" class="more-events">
                      +{{ story.events.length - 2 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="story-grid">
      <RouterLink
        v-for="story in filteredStories"
        :key="story.id"
        :to="{ name: 'story-viewer', params: { id: story.id }}"
        class="grid-story"
      >
        <div class="story-preview">
          <img 
            v-if="story.media?.[0]"
            :src="story.media[0].url"
            :alt="story.title"
            class="preview-image"
          />
          <div class="preview-content">
            <h3 class="preview-title">{{ story.title }}</h3>
            <time :datetime="story.date" class="preview-date">
              {{ formatDate(story.date) }}
            </time>
            <p class="preview-excerpt">{{ truncateText(story.content, 120) }}</p>
            <div class="preview-meta">
              <div class="people-tags" v-if="story.peopleMentioned?.length">
                <RouterLink
                  v-for="person in story.peopleMentioned.slice(0, 3)"
                  :key="person.id"
                  :to="{ name: 'person-detail', params: { id: person.id }}"
                  class="person-tag"
                  @click.stop
                >
                  {{ person.name }}
                </RouterLink>
                <span v-if="story.peopleMentioned.length > 3" class="more-people">
                  +{{ story.peopleMentioned.length - 3 }}
                </span>
              </div>
              <div class="event-tags" v-if="story.events?.length">
                <RouterLink
                  v-for="event in story.events.slice(0, 2)"
                  :key="event.id"
                  :to="{ name: 'event-detail', params: { id: event.id }}"
                  class="event-tag"
                  @click.stop
                >
                  {{ event.name }}
                </RouterLink>
                <span v-if="story.events.length > 2" class="more-events">
                  +{{ story.events.length - 2 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>

    <!-- View Toggle -->
    <div class="view-toggle">
      <CustomButton
        :variant="viewMode === 'grid' ? 'primary' : 'text'"
        size="sm"
        @click="viewMode = 'grid'"
        :aria-label="'Grid view'"
      >
        <Squares2X2Icon class="view-icon" />
      </CustomButton>
      <CustomButton
        :variant="viewMode === 'timeline' ? 'primary' : 'text'"
        size="sm"
        @click="viewMode = 'timeline'"
        :aria-label="'Timeline view'"
      >
        <ClockIcon class="view-icon" />
      </CustomButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  Squares2X2Icon,
  ClockIcon
} from '@heroicons/vue/24/outline';
import BaseInput from '../forms/BaseInput.vue';
import BaseSelect from '../forms/BaseSelect.vue';
import CustomButton from '../buttons/CustomButton.vue';

const props = defineProps({
  stories: {
    type: Array,
    required: true
  },
  peopleOptions: {
    type: Array,
    default: () => []
  },
  eventOptions: {
    type: Array,
    default: () => []
  }
});

// State
const searchQuery = ref('');
const selectedPerson = ref(null);
const selectedEvent = ref(null);
const selectedYear = ref(null);
const sortBy = ref('date-desc');
const viewMode = ref('timeline');

// Computed
const yearOptions = computed(() => {
  const years = new Set(props.stories.map(story => new Date(story.date).getFullYear()));
  return Array.from(years)
    .sort((a, b) => b - a)
    .map(year => ({ value: year, label: year.toString() }));
});

const filteredStories = computed(() => {
  let filtered = [...props.stories];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(story => 
      story.title.toLowerCase().includes(query) ||
      story.content.toLowerCase().includes(query)
    );
  }

  // Apply person filter
  if (selectedPerson.value) {
    filtered = filtered.filter(story =>
      story.peopleMentioned?.some(person => person.id === selectedPerson.value)
    );
  }

  // Apply event filter
  if (selectedEvent.value) {
    filtered = filtered.filter(story =>
      story.events?.some(event => event.id === selectedEvent.value)
    );
  }

  // Apply year filter
  if (selectedYear.value) {
    filtered = filtered.filter(story =>
      new Date(story.date).getFullYear() === selectedYear.value
    );
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'date-desc':
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'date-asc':
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'alpha':
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  return filtered;
});

const groupedStories = computed(() => {
  const groups = {};
  filteredStories.value.forEach(story => {
    const year = new Date(story.date).getFullYear();
    if (!groups[year]) groups[year] = [];
    groups[year].push(story);
  });
  return groups;
});

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedPerson.value || selectedEvent.value || selectedYear.value;
});

const activeFilters = computed(() => {
  const filters = [];
  
  if (searchQuery.value) {
    filters.push({ id: 'search', label: `Search: ${searchQuery.value}` });
  }
  
  if (selectedPerson.value) {
    const person = props.peopleOptions.find(p => p.value === selectedPerson.value);
    if (person) filters.push({ id: 'person', label: `Person: ${person.label}` });
  }
  
  if (selectedEvent.value) {
    const event = props.eventOptions.find(e => e.value === selectedEvent.value);
    if (event) filters.push({ id: 'event', label: `Event: ${event.label}` });
  }
  
  if (selectedYear.value) {
    filters.push({ id: 'year', label: `Year: ${selectedYear.value}` });
  }
  
  return filters;
});

// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const truncateText = (text, length) => {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
};

const removeFilter = (filterId) => {
  switch (filterId) {
    case 'search':
      searchQuery.value = '';
      break;
    case 'person':
      selectedPerson.value = null;
      break;
    case 'event':
      selectedEvent.value = null;
      break;
    case 'year':
      selectedYear.value = null;
      break;
  }
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedPerson.value = null;
  selectedEvent.value = null;
  selectedYear.value = null;
};
</script>

<style scoped>
.story-list {
  padding: var(--spacing-lg);
}

/* Filters */
.story-filters {
  margin-bottom: var(--spacing-xl);
}

.search-bar {
  margin-bottom: var(--spacing-md);
}

.filter-options {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.active-filters {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.filter-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: var(--spacing-xxs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-gray-100);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
}

.remove-filter {
  display: flex;
  align-items: center;
  padding: 0;
  border: none;
  background: none;
  color: var(--color-gray-500);
  cursor: pointer;
}

.remove-filter:hover {
  color: var(--color-gray-700);
}

.remove-icon {
  width: var(--font-size-base);
  height: var(--font-size-base);
}

/* Timeline View */
.story-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.timeline-year {
  display: flex;
  gap: var(--spacing-lg);
}

.year-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
}

.year-label {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-sm);
}

.year-line {
  width: 2px;
  flex-grow: 1;
  background-color: var(--color-gray-200);
}

.year-stories {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* Grid View */
.story-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

/* Story Preview (shared between views) */
.story-preview {
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease;
}

.story-preview:hover {
  box-shadow: var(--shadow-md);
}

.preview-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.preview-content {
  padding: var(--spacing-md);
}

.preview-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-xs);
}

.preview-date {
  display: block;
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-sm);
}

.preview-excerpt {
  color: var(--color-gray-700);
  margin: 0 0 var(--spacing-md);
  line-height: var(--line-height-relaxed);
}

.preview-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.people-tags,
.event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.person-tag,
.event-tag {
  padding: var(--spacing-xxs) var(--spacing-xs);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  text-decoration: none;
}

.person-tag {
  background-color: var(--color-primary-50);
  color: var(--color-primary-700);
}

.event-tag {
  background-color: var(--color-secondary-50);
  color: var(--color-secondary-700);
}

.more-people,
.more-events {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

/* View Toggle */
.view-toggle {
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  display: flex;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
}

.view-icon {
  width: var(--font-size-lg);
  height: var(--font-size-lg);
}

/* Responsive Design */
@media (max-width: var(--breakpoint-lg)) {
  .filter-options {
    flex-wrap: wrap;
  }

  .filter-options > * {
    flex: 1 1 calc(50% - var(--spacing-sm));
    min-width: 150px;
  }
}

@media (max-width: var(--breakpoint-md)) {
  .story-list {
    padding: var(--spacing-md);
  }

  .timeline-year {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .year-marker {
    flex-direction: row;
    width: auto;
    gap: var(--spacing-sm);
  }

  .year-line {
    width: auto;
    height: 2px;
    flex-grow: 1;
  }

  .preview-image {
    height: 150px;
  }
}
</style> 