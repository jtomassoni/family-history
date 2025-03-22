<template>
  <div 
    class="timeline-view"
    :style="{
      '--scale-factor': scale
    }"
  >
    <div class="timeline-ruler">
      <div 
        v-for="year in visibleYears"
        :key="year"
        class="year-marker"
        :style="{
          left: `${getYearPosition(year)}px`
        }"
      >
        <span class="year-label">{{ year }}</span>
        <div class="year-line"></div>
      </div>
    </div>

    <div class="timeline-content">
      <div 
        v-for="cluster in storyClusters"
        :key="`cluster-${cluster.date}`"
        class="story-cluster"
        :style="{
          left: `${getDatePosition(cluster.date)}px`
        }"
      >
        <div 
          class="cluster-line"
          :style="{
            height: `${cluster.stories.length * 100}px`
          }"
        ></div>
        
        <div class="cluster-stories">
          <div 
            v-for="(story, index) in cluster.stories"
            :key="story.id"
            class="cluster-story"
            :style="{
              '--story-index': index
            }"
            @click="$emit('story-select', story)"
          >
            <div class="story-card">
              <img 
                v-if="story.media?.[0]"
                :src="story.media[0].url"
                :alt="story.title"
                class="story-image"
              />
              <div class="story-content">
                <h3 class="story-title">{{ story.title }}</h3>
                <time :datetime="story.date" class="story-date">
                  {{ formatDate(story.date) }}
                </time>
                <p class="story-excerpt">{{ truncateText(story.content, 100) }}</p>
                
                <div class="story-meta">
                  <div class="story-people" v-if="story.peopleMentioned?.length">
                    <div class="people-avatars">
                      <img 
                        v-for="person in story.peopleMentioned.slice(0, 3)"
                        :key="person.id"
                        :src="person.avatar"
                        :alt="person.name"
                        class="person-avatar"
                        :title="person.name"
                      />
                      <div 
                        v-if="story.peopleMentioned.length > 3"
                        class="avatar-more"
                        :title="getMorePeopleNames(story)"
                      >
                        +{{ story.peopleMentioned.length - 3 }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="story-location" v-if="story.location">
                    <MapPinIcon class="location-icon" />
                    {{ story.location.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Zoom Controls -->
    <div class="zoom-controls">
      <CustomButton
        variant="text"
        size="sm"
        @click="adjustScale(-0.5)"
        :disabled="scale <= 0.5"
        aria-label="Zoom out"
      >
        <MinusIcon class="zoom-icon" />
      </CustomButton>
      <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
      <CustomButton
        variant="text"
        size="sm"
        @click="adjustScale(0.5)"
        :disabled="scale >= 5"
        aria-label="Zoom in"
      >
        <PlusIcon class="zoom-icon" />
      </CustomButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { MapPinIcon, MinusIcon, PlusIcon } from '@heroicons/vue/24/outline';
import CustomButton from '../../buttons/CustomButton.vue';

const props = defineProps({
  stories: {
    type: Array,
    required: true
  },
  scale: {
    type: Number,
    default: 1
  },
  autoScale: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['scale-change', 'story-select']);

// Timeline calculations
const timelineStart = computed(() => {
  const dates = props.stories.map(s => new Date(s.date));
  return new Date(Math.min(...dates));
});

const timelineEnd = computed(() => {
  const dates = props.stories.map(s => new Date(s.date));
  return new Date(Math.max(...dates));
});

const visibleYears = computed(() => {
  const startYear = timelineStart.value.getFullYear();
  const endYear = timelineEnd.value.getFullYear();
  return Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );
});

// Story clustering
const storyClusters = computed(() => {
  const clusters = new Map();
  
  props.stories.forEach(story => {
    const date = new Date(story.date);
    const key = date.toISOString().split('T')[0];
    
    if (!clusters.has(key)) {
      clusters.set(key, {
        date,
        stories: []
      });
    }
    
    clusters.get(key).stories.push(story);
  });
  
  // Sort stories within each cluster
  clusters.forEach(cluster => {
    cluster.stories.sort((a, b) => {
      // Sort by time if available, otherwise by title
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      if (timeA !== timeB) return timeA - timeB;
      return a.title.localeCompare(b.title);
    });
  });
  
  return Array.from(clusters.values())
    .sort((a, b) => a.date - b.date);
});

// Position calculations
const getDatePosition = (date) => {
  const start = timelineStart.value.getTime();
  const end = timelineEnd.value.getTime();
  const current = date.getTime();
  
  const position = ((current - start) / (end - start)) * 100;
  return position * props.scale;
};

const getYearPosition = (year) => {
  const date = new Date(year, 0, 1);
  return getDatePosition(date);
};

// Zoom controls
const adjustScale = (delta) => {
  const newScale = Math.max(0.5, Math.min(5, props.scale + delta));
  emit('scale-change', newScale);
};

// Helpers
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

const getMorePeopleNames = (story) => {
  return story.peopleMentioned
    .slice(3)
    .map(person => person.name)
    .join(', ');
};
</script>

<style scoped>
.timeline-view {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
}

/* Timeline Ruler */
.timeline-ruler {
  position: sticky;
  top: 0;
  height: 60px;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-gray-200);
  z-index: 10;
}

.year-marker {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
}

.year-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  margin-bottom: var(--spacing-xs);
}

.year-line {
  width: 1px;
  height: 20px;
  background-color: var(--color-gray-300);
}

/* Timeline Content */
.timeline-content {
  position: relative;
  padding-top: var(--spacing-xl);
  min-width: calc(100% * var(--scale-factor));
}

/* Story Clusters */
.story-cluster {
  position: absolute;
  transform: translateX(-50%);
}

.cluster-line {
  position: absolute;
  left: 50%;
  width: 2px;
  background-color: var(--color-gray-200);
  transform: translateX(-50%);
}

.cluster-stories {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
}

.cluster-story {
  transform: translateY(calc(var(--story-index) * (100% + var(--spacing-md))));
}

/* Story Cards */
.story-card {
  width: 300px;
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.story-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.story-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.story-content {
  padding: var(--spacing-md);
}

.story-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-xs);
}

.story-date {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin-bottom: var(--spacing-sm);
}

.story-excerpt {
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  margin: 0 0 var(--spacing-md);
}

/* Story Meta */
.story-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.story-people {
  flex-shrink: 0;
}

.people-avatars {
  display: flex;
  align-items: center;
}

.person-avatar {
  width: 24px;
  height: 24px;
  border-radius: var(--border-radius-full);
  border: 2px solid var(--color-white);
  margin-left: -8px;
}

.person-avatar:first-child {
  margin-left: 0;
}

.avatar-more {
  width: 24px;
  height: 24px;
  border-radius: var(--border-radius-full);
  background-color: var(--color-gray-200);
  color: var(--color-gray-700);
  font-size: var(--font-size-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -8px;
}

.story-location {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.location-icon {
  width: var(--font-size-base);
  height: var(--font-size-base);
}

/* Zoom Controls */
.zoom-controls {
  position: fixed;
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
}

.zoom-level {
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
  min-width: 4ch;
  text-align: center;
}

.zoom-icon {
  width: var(--font-size-lg);
  height: var(--font-size-lg);
}

/* Responsive Design */
@media (max-width: var(--breakpoint-md)) {
  .story-card {
    width: 250px;
  }

  .story-image {
    height: 120px;
  }

  .zoom-controls {
    bottom: var(--spacing-md);
  }
}
</style> 