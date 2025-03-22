<template>
  <BaseCard
    variant="elevated"
    :hoverable="true"
    :loading="loading"
    :clickable="true"
    @click="$emit('click')"
  >
    <!-- Story Media -->
    <template v-if="story.media?.length" #media>
      <div class="story-media">
        <img 
          v-if="story.media[0].type === 'image'"
          :src="story.media[0].url" 
          :alt="story.media[0].caption || story.title"
          class="story-media__image"
          loading="lazy"
        />
        <video 
          v-else-if="story.media[0].type === 'video'"
          class="story-media__video"
          :poster="story.media[0].thumbnail"
          controls
          @click.stop
        >
          <source :src="story.media[0].url" :type="story.media[0].mimeType">
          Your browser does not support the video tag.
        </video>
        <div v-if="story.media.length > 1" class="story-media__count">
          +{{ story.media.length - 1 }}
        </div>
      </div>
    </template>

    <!-- Story Header -->
    <template #header>
      <div class="story-header">
        <div class="story-meta">
          <h3 class="story-title">{{ story.title }}</h3>
          <div class="story-info">
            <span class="story-date">{{ formatDate(story.date) }}</span>
            <span v-if="story.location" class="story-location">
              <MapPinIcon class="info-icon" />
              {{ story.location }}
            </span>
          </div>
        </div>
        <div class="story-author">
          <img 
            v-if="story.author.avatar"
            :src="story.author.avatar"
            :alt="story.author.name"
            class="author-avatar"
          />
          <div class="author-info">
            <span class="author-name">{{ story.author.name }}</span>
            <span class="author-relation">{{ story.author.relation }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Story Content -->
    <div class="story-content">
      <p class="story-excerpt">{{ truncateText(story.content, 150) }}</p>
      
      <!-- Tags -->
      <div v-if="story.tags?.length" class="story-tags">
        <span 
          v-for="tag in story.tags" 
          :key="tag"
          class="story-tag"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- People Mentioned -->
      <div v-if="story.peopleMentioned?.length" class="people-mentioned">
        <UsersIcon class="info-icon" />
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
            class="person-avatar person-avatar--more"
            :title="getMorePeopleNames"
          >
            +{{ story.peopleMentioned.length - 3 }}
          </div>
        </div>
      </div>
    </div>

    <!-- Story Footer -->
    <template #footer>
      <div class="story-footer">
        <div class="story-stats">
          <span class="stat-item">
            <HeartIcon class="stat-icon" :class="{ 'stat-icon--active': story.liked }" />
            {{ story.likes }}
          </span>
          <span class="stat-item">
            <ChatBubbleLeftIcon class="stat-icon" />
            {{ story.comments }}
          </span>
        </div>
        <CustomButton
          variant="text"
          size="sm"
          @click.stop="$emit('edit')"
          :aria-label="'Edit story'"
        >
          <PencilIcon class="action-icon" />
          Edit
        </CustomButton>
      </div>
    </template>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue';
import {
  MapPinIcon,
  UsersIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  PencilIcon
} from '@heroicons/vue/24/outline';
import BaseCard from './BaseCard.vue';
import CustomButton from '../buttons/CustomButton.vue';

const props = defineProps({
  story: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.title && value.content && value.author;
    }
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click', 'edit']);

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

const getMorePeopleNames = computed(() => {
  const remaining = props.story.peopleMentioned.slice(3);
  return remaining.map(person => person.name).join(', ');
});
</script>

<style scoped>
.story-media {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: var(--color-gray-100);
}

.story-media__image,
.story-media__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-media__count {
  position: absolute;
  bottom: var(--spacing-sm);
  right: var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--color-white);
  padding: var(--spacing-xxs) var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
}

.story-header {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.story-meta {
  flex-grow: 1;
  min-width: 0;
}

.story-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  line-height: var(--line-height-tight);
}

.story-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xs);
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.story-location {
  display: flex;
  align-items: center;
  gap: var(--spacing-xxs);
}

.story-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-full);
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
  font-size: var(--font-size-sm);
}

.author-relation {
  color: var(--color-gray-600);
  font-size: var(--font-size-xs);
}

.story-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.story-excerpt {
  margin: 0;
  color: var(--color-gray-700);
  line-height: var(--line-height-relaxed);
}

.story-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.story-tag {
  color: var(--color-primary);
  font-size: var(--font-size-sm);
}

.people-mentioned {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.people-avatars {
  display: flex;
  align-items: center;
}

.person-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-full);
  border: 2px solid var(--color-white);
  margin-left: -8px;
  object-fit: cover;
}

.person-avatar:first-child {
  margin-left: 0;
}

.person-avatar--more {
  background-color: var(--color-gray-200);
  color: var(--color-gray-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.info-icon {
  width: var(--font-size-base);
  height: var(--font-size-base);
  color: var(--color-gray-500);
}

.story-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.story-stats {
  display: flex;
  gap: var(--spacing-md);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.stat-icon {
  width: var(--font-size-base);
  height: var(--font-size-base);
}

.stat-icon--active {
  color: var(--color-danger);
  fill: currentColor;
}

.action-icon {
  width: var(--font-size-base);
  height: var(--font-size-base);
}

/* Responsive Design */
@media (max-width: var(--breakpoint-md)) {
  .story-header {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .story-media {
    height: 150px;
  }

  .story-author {
    justify-content: flex-start;
  }

  .story-stats {
    gap: var(--spacing-sm);
  }
}
</style> 