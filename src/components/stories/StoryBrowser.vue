<template>
  <div class="story-browser">
    <!-- View Type Selector -->
    <nav class="view-selector" role="navigation" aria-label="Story view options">
      <div class="view-buttons">
        <CustomButton 
          v-for="view in viewTypes"
          :key="view.id"
          :variant="currentView === view.id ? 'primary' : 'text'"
          @click="currentView = view.id"
          :aria-current="currentView === view.id ? 'true' : undefined"
        >
          <component :is="view.icon" class="view-icon" />
          {{ view.label }}
        </CustomButton>
      </div>

      <div class="view-actions">
        <CustomButton
          v-if="currentView === 'chronological'"
          :variant="autoScale ? 'primary' : 'text'"
          @click="autoScale = !autoScale"
          :aria-pressed="autoScale"
        >
          <ScaleIcon class="view-icon" />
          Auto-scale
        </CustomButton>
        
        <BaseSelect
          v-if="currentView === 'generations'"
          v-model="selectedGeneration"
          :options="generationOptions"
          placeholder="Jump to generation"
          size="sm"
        />

        <BaseSelect
          v-if="currentView === 'themes'"
          v-model="selectedTheme"
          :options="themeOptions"
          placeholder="Select theme"
          size="sm"
        />
      </div>
    </nav>

    <!-- Search and Filters -->
    <div class="story-filters">
      <div class="search-wrapper">
        <BaseInput
          v-model="searchQuery"
          placeholder="Search stories..."
          :prefix-icon="MagnifyingGlassIcon"
        />
        <CustomButton
          variant="text"
          size="sm"
          @click="showAdvancedSearch = !showAdvancedSearch"
        >
          <FunnelIcon class="view-icon" />
          Filters
        </CustomButton>
      </div>

      <div v-if="showAdvancedSearch" class="advanced-search">
        <div class="filter-row">
          <BaseSelect
            v-model="dateRange"
            :options="dateRangeOptions"
            placeholder="Date range"
            size="sm"
          />
          <BaseSelect
            v-model="selectedPerson"
            :options="peopleOptions"
            placeholder="Person"
            size="sm"
          />
          <BaseSelect
            v-model="selectedLocation"
            :options="locationOptions"
            placeholder="Location"
            size="sm"
          />
        </div>
        <div class="active-filters" v-if="hasActiveFilters">
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
          <CustomButton
            variant="text"
            size="sm"
            @click="clearFilters"
          >
            Clear all
          </CustomButton>
        </div>
      </div>
    </div>

    <!-- Dynamic Content Views -->
    <div 
      class="story-content"
      :class="{
        'content--auto-scale': autoScale && currentView === 'chronological'
      }"
    >
      <!-- Chronological View -->
      <TimelineView
        v-if="currentView === 'chronological'"
        :stories="filteredStories"
        :scale="timelineScale"
        :auto-scale="autoScale"
        @scale-change="handleScaleChange"
        @story-select="handleStorySelect"
      />

      <!-- Generational View -->
      <GenerationView
        v-else-if="currentView === 'generations'"
        :stories="filteredStories"
        :family-tree="familyTree"
        :selected-generation="selectedGeneration"
        @story-select="handleStorySelect"
      />

      <!-- Thematic View -->
      <ThematicView
        v-else-if="currentView === 'themes'"
        :stories="filteredStories"
        :themes="themes"
        :selected-theme="selectedTheme"
        @story-select="handleStorySelect"
      />

      <!-- Geographic View -->
      <GeographicView
        v-else-if="currentView === 'places'"
        :stories="filteredStories"
        :locations="locations"
        @story-select="handleStorySelect"
      />
    </div>

    <!-- Story Preview -->
    <Transition name="slide">
      <div v-if="selectedStory" class="story-preview">
        <div class="preview-header">
          <h2 class="preview-title">{{ selectedStory.title }}</h2>
          <CustomButton
            variant="text"
            size="sm"
            @click="selectedStory = null"
            aria-label="Close preview"
          >
            <XMarkIcon class="close-icon" />
          </CustomButton>
        </div>
        <div class="preview-content">
          <img 
            v-if="selectedStory.media?.[0]"
            :src="selectedStory.media[0].url"
            :alt="selectedStory.title"
            class="preview-image"
          />
          <div class="preview-meta">
            <time :datetime="selectedStory.date" class="preview-date">
              {{ formatDate(selectedStory.date) }}
            </time>
            <p class="preview-excerpt">{{ selectedStory.content }}</p>
          </div>
          <div class="preview-footer">
            <RouterLink
              :to="{ name: 'story-viewer', params: { id: selectedStory.id }}"
              custom
              v-slot="{ navigate }"
            >
              <CustomButton
                variant="primary"
                @click="navigate"
              >
                Read full story
              </CustomButton>
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ScaleIcon,
  ClockIcon,
  UsersIcon,
  TagIcon,
  MapPinIcon
} from '@heroicons/vue/24/outline';
import BaseInput from '../forms/BaseInput.vue';
import BaseSelect from '../forms/BaseSelect.vue';
import CustomButton from '../buttons/CustomButton.vue';
import TimelineView from './views/TimelineView.vue';
import GenerationView from './views/GenerationView.vue';
import ThematicView from './views/ThematicView.vue';
import GeographicView from './views/GeographicView.vue';

const props = defineProps({
  stories: {
    type: Array,
    required: true
  },
  familyTree: {
    type: Object,
    required: true
  },
  themes: {
    type: Array,
    required: true
  },
  locations: {
    type: Array,
    required: true
  }
});

// View Types
const viewTypes = [
  { id: 'chronological', label: 'Timeline', icon: ClockIcon },
  { id: 'generations', label: 'Generations', icon: UsersIcon },
  { id: 'themes', label: 'Themes', icon: TagIcon },
  { id: 'places', label: 'Places', icon: MapPinIcon }
];

// State
const currentView = ref('chronological');
const autoScale = ref(true);
const timelineScale = ref(1);
const selectedGeneration = ref(null);
const selectedTheme = ref(null);
const searchQuery = ref('');
const showAdvancedSearch = ref(false);
const dateRange = ref(null);
const selectedPerson = ref(null);
const selectedLocation = ref(null);
const selectedStory = ref(null);

// Options
const generationOptions = computed(() => {
  // Extract unique generations from family tree
  const generations = new Set();
  const traverse = (node, level = 0) => {
    generations.add(level);
    node.children?.forEach(child => traverse(child, level + 1));
  };
  traverse(props.familyTree);
  
  return Array.from(generations)
    .sort((a, b) => a - b)
    .map(gen => ({
      value: gen,
      label: `Generation ${gen + 1}`
    }));
});

const themeOptions = computed(() => 
  props.themes.map(theme => ({
    value: theme.id,
    label: theme.name
  }))
);

const dateRangeOptions = [
  { value: 'decade-1900', label: '1900s' },
  { value: 'decade-1910', label: '1910s' },
  { value: 'decade-1920', label: '1920s' },
  { value: 'decade-1930', label: '1930s' },
  { value: 'decade-1940', label: '1940s' },
  { value: 'decade-1950', label: '1950s' },
  { value: 'decade-1960', label: '1960s' },
  { value: 'decade-1970', label: '1970s' },
  { value: 'decade-1980', label: '1980s' },
  { value: 'decade-1990', label: '1990s' },
  { value: 'decade-2000', label: '2000s' },
  { value: 'decade-2010', label: '2010s' },
  { value: 'decade-2020', label: '2020s' }
];

const peopleOptions = computed(() => {
  const people = new Set();
  props.stories.forEach(story => {
    story.peopleMentioned?.forEach(person => {
      people.add(person);
    });
  });
  
  return Array.from(people)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(person => ({
      value: person.id,
      label: person.name
    }));
});

const locationOptions = computed(() => 
  props.locations.map(location => ({
    value: location.id,
    label: location.name
  }))
);

// Filtering
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

  // Apply date range
  if (dateRange.value) {
    const [_, decade] = dateRange.value.split('-');
    const startYear = parseInt(decade);
    filtered = filtered.filter(story => {
      const storyYear = new Date(story.date).getFullYear();
      return storyYear >= startYear && storyYear < startYear + 10;
    });
  }

  // Apply person filter
  if (selectedPerson.value) {
    filtered = filtered.filter(story =>
      story.peopleMentioned?.some(person => person.id === selectedPerson.value)
    );
  }

  // Apply location filter
  if (selectedLocation.value) {
    filtered = filtered.filter(story =>
      story.location?.id === selectedLocation.value
    );
  }

  return filtered;
});

const hasActiveFilters = computed(() => {
  return searchQuery.value || dateRange.value || selectedPerson.value || selectedLocation.value;
});

const activeFilters = computed(() => {
  const filters = [];
  
  if (searchQuery.value) {
    filters.push({ id: 'search', label: `Search: ${searchQuery.value}` });
  }
  
  if (dateRange.value) {
    const option = dateRangeOptions.find(opt => opt.value === dateRange.value);
    if (option) filters.push({ id: 'date', label: `Date: ${option.label}` });
  }
  
  if (selectedPerson.value) {
    const person = peopleOptions.value.find(p => p.value === selectedPerson.value);
    if (person) filters.push({ id: 'person', label: `Person: ${person.label}` });
  }
  
  if (selectedLocation.value) {
    const location = locationOptions.value.find(l => l.value === selectedLocation.value);
    if (location) filters.push({ id: 'location', label: `Location: ${location.label}` });
  }
  
  return filters;
});

// Methods
const handleScaleChange = (scale) => {
  if (autoScale.value) {
    // Calculate optimal scale based on:
    // 1. Number of stories in view
    const storyCount = filteredStories.value.length;
    // 2. Date range of visible stories
    const dates = filteredStories.value.map(s => new Date(s.date));
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const dateRange = maxDate - minDate;
    // 3. Screen size
    const screenWidth = window.innerWidth;
    
    // Adjust scale accordingly
    timelineScale.value = calculateOptimalScale(storyCount, dateRange, screenWidth);
  } else {
    timelineScale.value = scale;
  }
};

const calculateOptimalScale = (storyCount, dateRange, screenWidth) => {
  // Base scale on story density
  const density = storyCount / (dateRange / (1000 * 60 * 60 * 24 * 365)); // stories per year
  const baseScale = Math.log2(density + 1);
  
  // Adjust for screen size
  const screenFactor = screenWidth / 1920;
  
  return Math.max(0.5, Math.min(5, baseScale * screenFactor));
};

const handleStorySelect = (story) => {
  selectedStory.value = story;
};

const removeFilter = (filterId) => {
  switch (filterId) {
    case 'search':
      searchQuery.value = '';
      break;
    case 'date':
      dateRange.value = null;
      break;
    case 'person':
      selectedPerson.value = null;
      break;
    case 'location':
      selectedLocation.value = null;
      break;
  }
};

const clearFilters = () => {
  searchQuery.value = '';
  dateRange.value = null;
  selectedPerson.value = null;
  selectedLocation.value = null;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.story-browser {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-gray-50);
}

/* View Selector */
.view-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-gray-200);
}

.view-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.view-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.view-icon {
  width: var(--font-size-lg);
  height: var(--font-size-lg);
}

/* Filters */
.story-filters {
  padding: var(--spacing-md);
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-gray-200);
}

.search-wrapper {
  display: flex;
  gap: var(--spacing-sm);
}

.advanced-search {
  margin-top: var(--spacing-md);
}

.filter-row {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  align-items: center;
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

.remove-icon {
  width: var(--font-size-base);
  height: var(--font-size-base);
}

/* Content */
.story-content {
  flex-grow: 1;
  overflow: auto;
  padding: var(--spacing-md);
}

.content--auto-scale {
  transition: transform 0.3s ease;
}

/* Preview */
.story-preview {
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  width: 400px;
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-gray-200);
}

.preview-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0;
}

.close-icon {
  width: var(--font-size-xl);
  height: var(--font-size-xl);
}

.preview-content {
  padding: var(--spacing-md);
}

.preview-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
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
  max-height: 200px;
  overflow-y: auto;
}

.preview-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-gray-200);
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Responsive Design */
@media (max-width: var(--breakpoint-lg)) {
  .filter-row {
    flex-wrap: wrap;
  }

  .filter-row > * {
    flex: 1 1 calc(50% - var(--spacing-sm));
    min-width: 150px;
  }

  .story-preview {
    width: 100%;
    height: 50vh;
    bottom: 0;
    right: 0;
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  }
}

@media (max-width: var(--breakpoint-md)) {
  .view-selector {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .view-buttons {
    width: 100%;
    justify-content: space-between;
  }

  .view-actions {
    width: 100%;
  }

  .filter-row > * {
    flex: 1 1 100%;
  }
}
</style> 