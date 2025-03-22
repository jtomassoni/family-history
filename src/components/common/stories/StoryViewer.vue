<template>
  <article class="story-viewer">
    <!-- Story Header -->
    <header class="story-header">
      <div class="story-meta">
        <h1 class="story-title">{{ story.title }}</h1>
        <div class="story-info">
          <time :datetime="story.date" class="story-date">
            {{ formatDate(story.date) }}
          </time>
          <span v-if="story.location" class="story-location">
            <MapPinIcon class="info-icon" />
            {{ story.location }}
          </span>
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
    </header>

    <!-- Story Navigation -->
    <nav v-if="story.chapters?.length > 1" class="story-nav">
      <ol class="chapter-list">
        <li 
          v-for="(chapter, index) in story.chapters" 
          :key="index"
          class="chapter-item"
          :class="{ 'chapter-item--active': currentChapter === index }"
        >
          <button 
            @click="currentChapter = index"
            class="chapter-button"
            :aria-current="currentChapter === index ? 'true' : undefined"
          >
            {{ chapter.title }}
          </button>
        </li>
      </ol>
    </nav>

    <!-- Story Content -->
    <div 
      class="story-content"
      :class="{ 'story-content--with-nav': story.chapters?.length > 1 }"
    >
      <!-- Media Gallery -->
      <div v-if="currentMedia?.length" class="media-gallery">
        <div class="media-main">
          <img 
            v-if="currentMedia[selectedMedia].type === 'image'"
            :src="currentMedia[selectedMedia].url"
            :alt="currentMedia[selectedMedia].caption"
            class="media-main__image"
            loading="lazy"
          />
          <video
            v-else-if="currentMedia[selectedMedia].type === 'video'"
            class="media-main__video"
            controls
            :poster="currentMedia[selectedMedia].thumbnail"
          >
            <source :src="currentMedia[selectedMedia].url" :type="currentMedia[selectedMedia].mimeType">
          </video>
          <p v-if="currentMedia[selectedMedia].caption" class="media-caption">
            {{ currentMedia[selectedMedia].caption }}
          </p>
        </div>
        <div v-if="currentMedia.length > 1" class="media-thumbnails">
          <button
            v-for="(media, index) in currentMedia"
            :key="index"
            class="thumbnail-button"
            :class="{ 'thumbnail-button--active': selectedMedia === index }"
            @click="selectedMedia = index"
            :aria-label="`View ${media.caption || `media item ${index + 1}`}`"
          >
            <img 
              :src="media.type === 'video' ? media.thumbnail : media.url"
              :alt="media.caption || `Thumbnail ${index + 1}`"
              class="thumbnail-image"
            />
            <VideoIcon v-if="media.type === 'video'" class="thumbnail-icon" />
          </button>
        </div>
      </div>

      <!-- Text Content -->
      <div 
        class="story-text"
        :class="{ 'story-text--with-media': currentMedia?.length }"
      >
        <div v-if="story.chapters?.length > 1">
          <h2 class="chapter-title">{{ story.chapters[currentChapter].title }}</h2>
          <div class="chapter-content" v-html="formatContent(story.chapters[currentChapter].content)"></div>
        </div>
        <div v-else class="story-content" v-html="formatContent(story.content)"></div>
      </div>

      <!-- People Mentioned -->
      <aside v-if="story.peopleMentioned?.length" class="people-mentioned">
        <h3 class="people-mentioned__title">
          <UsersIcon class="info-icon" />
          People in this story
        </h3>
        <ul class="people-list">
          <li 
            v-for="person in story.peopleMentioned"
            :key="person.id"
            class="person-item"
          >
            <img 
              v-if="person.avatar"
              :src="person.avatar"
              :alt="person.name"
              class="person-avatar"
            />
            <div class="person-details">
              <span class="person-name">{{ person.name }}</span>
              <span v-if="person.relation" class="person-relation">{{ person.relation }}</span>
            </div>
          </li>
        </ul>
      </aside>
    </div>

    <!-- Story Footer -->
    <footer class="story-footer">
      <div class="story-tags" v-if="story.tags?.length">
        <span v-for="tag in story.tags" :key="tag" class="story-tag">
          #{{ tag }}
        </span>
      </div>
      <div class="story-actions">
        <CustomButton
          variant="text"
          size="sm"
          @click="$emit('edit')"
          :aria-label="'Edit story'"
        >
          <PencilIcon class="action-icon" />
          Edit
        </CustomButton>
        <CustomButton
          variant="text"
          size="sm"
          @click="$emit('share')"
          :aria-label="'Share story'"
        >
          <ShareIcon class="action-icon" />
          Share
        </CustomButton>
      </div>
    </footer>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  MapPinIcon,
  UsersIcon,
  PencilIcon,
  ShareIcon,
  VideoIcon
} from '@heroicons/vue/24/outline';
import CustomButton from '../buttons/CustomButton.vue';

const props = defineProps({
  story: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.title && (value.content || value.chapters) && value.author;
    }
  }
});

const emit = defineEmits(['edit', 'share']);

const currentChapter = ref(0);
const selectedMedia = ref(0);

const currentMedia = computed(() => {
  if (props.story.chapters?.length > 1) {
    return props.story.chapters[currentChapter.value].media;
  }
  return props.story.media;
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatContent = (content) => {
  // Replace newlines with paragraphs
  return content
    .split('\n\n')
    .map(paragraph => `<p>${paragraph}</p>`)
    .join('');
};
</script>

<style scoped>
.story-viewer {
  max-width: var(--content-width-prose);
  margin: 0 auto;
  padding: var(--spacing-lg);
  background-color: var(--color-white);
}

.story-header {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.story-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  line-height: var(--line-height-tight);
  margin: 0 0 var(--spacing-md);
}

.story-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-md);
}

.story-author {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-full);
  object-fit: cover;
}

.author-info {
  text-align: left;
}

.author-name {
  display: block;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
}

.author-relation {
  display: block;
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

/* Navigation */
.story-nav {
  position: sticky;
  top: var(--spacing-md);
  width: 200px;
  float: left;
  margin-right: var(--spacing-xl);
  padding-right: var(--spacing-md);
  border-right: 1px solid var(--color-gray-200);
}

.chapter-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chapter-item {
  margin-bottom: var(--spacing-xs);
}

.chapter-button {
  width: 100%;
  text-align: left;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: none;
  background: none;
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
  cursor: pointer;
  border-radius: var(--border-radius-sm);
}

.chapter-item--active .chapter-button {
  background-color: var(--color-gray-100);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

/* Content */
.story-content {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-gray-800);
}

.story-content--with-nav {
  margin-left: 220px;
}

/* Media Gallery */
.media-gallery {
  margin-bottom: var(--spacing-xl);
}

.media-main {
  margin-bottom: var(--spacing-md);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  background-color: var(--color-gray-100);
}

.media-main__image,
.media-main__video {
  width: 100%;
  max-height: 600px;
  object-fit: contain;
}

.media-caption {
  padding: var(--spacing-sm);
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  text-align: center;
}

.media-thumbnails {
  display: flex;
  gap: var(--spacing-xs);
  overflow-x: auto;
  padding-bottom: var(--spacing-xs);
}

.thumbnail-button {
  position: relative;
  width: 80px;
  height: 80px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  cursor: pointer;
  background: none;
}

.thumbnail-button--active {
  border-color: var(--color-primary);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-icon {
  position: absolute;
  bottom: var(--spacing-xxs);
  right: var(--spacing-xxs);
  width: var(--font-size-lg);
  height: var(--font-size-lg);
  color: var(--color-white);
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.5));
}

/* Text Content */
.story-text {
  max-width: 65ch;
  margin: 0 auto;
}

.story-text--with-media {
  margin-top: var(--spacing-xl);
}

.chapter-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-lg);
}

:deep(.chapter-content p),
:deep(.story-content p) {
  margin: 0 0 var(--spacing-md);
  text-align: justify;
  hyphens: auto;
}

/* People Mentioned */
.people-mentioned {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-gray-200);
}

.people-mentioned__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-md);
}

.people-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
  list-style: none;
  padding: 0;
  margin: 0;
}

.person-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.person-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-full);
  object-fit: cover;
}

.person-details {
  display: flex;
  flex-direction: column;
}

.person-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
}

.person-relation {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

/* Footer */
.story-footer {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.story-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-icon {
  width: var(--font-size-base);
  height: var(--font-size-base);
}

/* Responsive Design */
@media (max-width: var(--breakpoint-lg)) {
  .story-nav {
    float: none;
    width: 100%;
    margin: 0 0 var(--spacing-xl);
    padding: 0 0 var(--spacing-md);
    border-right: none;
    border-bottom: 1px solid var(--color-gray-200);
  }

  .chapter-list {
    display: flex;
    overflow-x: auto;
    gap: var(--spacing-xs);
    padding-bottom: var(--spacing-xs);
  }

  .chapter-item {
    margin: 0;
  }

  .chapter-button {
    white-space: nowrap;
  }

  .story-content--with-nav {
    margin-left: 0;
  }
}

@media (max-width: var(--breakpoint-md)) {
  .story-viewer {
    padding: var(--spacing-md);
  }

  .story-title {
    font-size: var(--font-size-2xl);
  }

  .story-info {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .media-main__image,
  .media-main__video {
    max-height: 400px;
  }

  .people-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

/* Print Styles */
@media print {
  .story-viewer {
    padding: 0;
  }

  .story-nav,
  .story-actions {
    display: none;
  }

  .story-content--with-nav {
    margin-left: 0;
  }

  .media-gallery {
    page-break-inside: avoid;
  }

  .people-mentioned {
    page-break-inside: avoid;
  }
}
</style> 