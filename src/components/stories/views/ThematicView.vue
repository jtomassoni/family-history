<template>
  <div class="thematic-view">
    <div 
      v-for="theme in themes"
      :key="theme.id"
      class="theme-section"
      :class="{
        'theme-section--active': selectedTheme === theme.id
      }"
    >
      <div class="theme-header">
        <h2 class="theme-title">{{ theme.name }}</h2>
        <div class="theme-stats">
          {{ getThemeStoryCount(theme) }} stories
        </div>
      </div>

      <div class="theme-stories">
        <div 
          v-for="story in getStoriesByTheme(theme)"
          :key="story.id"
          class="story-card"
          @click="$emit('story-select', story)"
        >
          <div class="story-media">
            <img 
              v-if="story.media?.[0]"
              :src="story.media[0].url"
              :alt="story.title"
              class="story-image"
            />
            <div 
              v-else
              class="story-placeholder"
            >
              <BookOpenIcon class="placeholder-icon" />
            </div>
          </div>
          
          <div class="story-content">
            <h3 class="story-title">{{ story.title }}</h3>
            <time :datetime="story.date" class="story-date">
              {{ formatDate(story.date) }}
            </time>
            <p class="story-excerpt">
              {{ truncateText(story.content, 100) }}
            </p>
            
            <div class="story-meta">
              <div class="story-people">
                <div class="people-avatars">
                  <img 
                    v-for="person in story.peopleMentioned.slice(0, 3)"
                    :key="person.id"
                    :src="person.avatar"
                    :alt="person.name"
                    class="meta-avatar"
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
</template>

<script setup>
import { computed } from 'vue';
import { BookOpenIcon, MapPinIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  stories: {
    type: Array,
    required: true
  },
  themes: {
    type: Array,
    required: true
  },
  selectedTheme: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['story-select']);

// Methods
const getStoriesByTheme = (theme) => {
  return props.stories.filter(story =>
    story.tags.some(tag => 
      tag.toLowerCase().includes(theme.name.toLowerCase()) ||
      theme.name.toLowerCase().includes(tag.toLowerCase())
    )
  ).sort((a, b) => new Date(b.date) - new Date(a.date));
};

const getThemeStoryCount = (theme) => {
  return getStoriesByTheme(theme).length;
};

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
.thematic-view {
  padding: var(--spacing-md);
}

.theme-section {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.theme-section--active {
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-primary-200);
}

.theme-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.theme-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0;
}

.theme-stats {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.theme-stories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

/* Story Cards */
.story-card {
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.story-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.story-media {
  position: relative;
  height: 150px;
  background-color: var(--color-gray-100);
}

.story-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.placeholder-icon {
  width: 48px;
  height: 48px;
  color: var(--color-gray-400);
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
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-sm);
}

.story-excerpt {
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  margin: 0 0 var(--spacing-md);
}

.story-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.people-avatars {
  display: flex;
  align-items: center;
}

.meta-avatar {
  width: 24px;
  height: 24px;
  border-radius: var(--border-radius-full);
  border: 2px solid var(--color-white);
  margin-left: -8px;
}

.meta-avatar:first-child {
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

/* Responsive Design */
@media (max-width: var(--breakpoint-md)) {
  .theme-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .theme-stories {
    grid-template-columns: 1fr;
  }
}
</style> 