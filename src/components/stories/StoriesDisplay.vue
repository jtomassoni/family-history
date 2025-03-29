<template>
  <div class="stories-display">
    <!-- Header Section -->
    <header class="stories-header">
      <h1 class="stories-title">Family Stories</h1>
      <p class="stories-intro">A collection of family stories and memories, preserved for future generations.</p>
    </header>

    <!-- Stories Grid -->
    <div class="stories-grid">
      <div 
        v-for="story in storiesData.pages" 
        :key="`${story.pageNumber}-${story.storyNumber}`"
        class="story-card"
        @click="openStory(story)"
      >
        <div class="story-content">
          <div class="story-header">
            <span class="story-date">{{ formatDate(story.dates.start) }}</span>
          </div>
          
          <div class="story-header-main">
            <h2 class="story-title">{{ story.shortSummary.split('.')[0] }}</h2>
          </div>
          
          <p class="story-summary">{{ story.shortSummary.split('.').slice(1).join('.').trim() }}</p>
          
          <div class="story-meta">
            <div v-if="story.familyMembers?.length" class="story-people">
              <UsersIcon class="meta-icon" />
              <span class="meta-count">{{ story.familyMembers.length }}</span>
            </div>
            
            <div class="page-number">
              <DocumentIcon class="meta-icon" />
              <span class="meta-count">{{ story.pageNumber }}</span>
            </div>
            
            <div v-if="story.locations?.length" class="story-locations">
              <MapPinIcon class="meta-icon" />
              <span class="meta-count">{{ story.locations.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Story Modal -->
    <Transition name="modal-fade">
      <div v-if="selectedStory" class="story-modal" @click="closeStory">
        <div class="modal-content" @click.stop :class="{ 'modal-open': selectedStory }">
          <button class="close-modal" @click="closeStory">
            <XMarkIcon class="close-icon" />
          </button>
          
          <article class="story-article">
            <header class="story-header">
              <h1>{{ selectedStory.shortSummary.split('.')[0] }}</h1>
              <div class="modal-meta">
                <span class="modal-page">Page {{ selectedStory.pageNumber }}</span>
                <time :datetime="selectedStory.dates.start" class="modal-date">
                  {{ formatDate(selectedStory.dates.start) }}
                </time>
              </div>
            </header>
            
            <div class="modal-content-body">
              <p class="story-long-summary">{{ selectedStory.longSummary }}</p>
              <div class="story-text">{{ selectedStory.rawText }}</div>
              
              <div class="story-image" v-if="selectedStory.photoUrl">
                <img 
                  :src="selectedStory.photoUrl" 
                  :alt="`Original page ${selectedStory.pageNumber}`"
                  class="story-img"
                />
              </div>
            </div>
            
            <footer class="story-footer">
              <div v-if="selectedStory.familyMembers?.length" class="modal-section">
                <h3>Family Members</h3>
                <ul>
                  <li v-for="member in selectedStory.familyMembers" :key="member">
                    {{ member }}
                  </li>
                </ul>
              </div>
              
              <div v-if="selectedStory.locations?.length" class="modal-section">
                <h3>Locations</h3>
                <ul>
                  <li v-for="location in selectedStory.locations" :key="location">
                    {{ location }}
                  </li>
                </ul>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { UsersIcon, MapPinIcon, XMarkIcon, DocumentIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  storiesData: {
    type: Object,
    required: true
  }
});

const selectedStory = ref(null);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const openStory = (story) => {
  selectedStory.value = story;
  document.body.style.overflow = 'hidden';
};

const closeStory = () => {
  selectedStory.value = null;
  document.body.style.overflow = 'auto';
};
</script>

<style scoped>
.stories-display {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--border-radius-xl, 1rem);
  padding: 1rem;
  backdrop-filter: blur(8px);
  height: calc(100vh - var(--header-height, 60px) - var(--footer-height, 80px) - 6rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  margin-top: 0;
}

.stories-header {
  text-align: center;
  margin-bottom: 0.5rem;
  padding: 0.25rem;
  border-radius: var(--border-radius-lg, 0.5rem);
}

.stories-title {
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--color-text-primary, #ffffff);
  margin-bottom: 0.25rem;
  font-family: var(--font-family-display, 'Arial');
  letter-spacing: -0.02em;
}

.stories-intro {
  font-size: 0.875rem;
  color: var(--color-text-secondary, rgba(255, 255, 255, 0.8));
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.2;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg, 2rem);
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  padding-right: 1rem;
  -webkit-overflow-scrolling: touch;
}

.story-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--border-radius-lg, 0.5rem);
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 280px;
  display: flex;
  color: #1a1a1a;
}

.story-card:hover {
  background: rgba(40, 44, 52, 0.95);
  color: #ffffff;
}

.story-card:hover .story-summary {
  color: rgba(255, 255, 255, 0.8);
}

.story-card:hover .story-meta {
  border-top-color: rgba(255, 255, 255, 0.2);
}

.story-card:hover .story-people,
.story-card:hover .story-locations,
.story-card:hover .page-number,
.story-card:hover .story-date {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.story-content {
  padding: var(--spacing-md, 1rem);
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
}

.story-header {
  display: flex;
  justify-content: center;
}

.story-header-main {
  text-align: center;
  width: 100%;
}

.story-title {
  font-size: var(--font-size-xl, 1.5rem);
  font-weight: 500;
  margin: 0;
  margin-bottom: var(--spacing-xs, 0.25rem);
  line-height: 1.2;
}

.story-date {
  font-size: var(--font-size-lg, 1.25rem);
  font-weight: 500;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
  background: rgba(0, 0, 0, 0.05);
  border-radius: var(--border-radius-full, 9999px);
}

.story-summary {
  font-size: var(--font-size-base, 1rem);
  color: #4a4a4a;
  line-height: 1.5;
  margin: var(--spacing-sm, 0.5rem) 0;
  text-align: center;
  padding: 0 var(--spacing-sm, 0.5rem);
}

.story-meta {
  display: flex;
  font-size: var(--font-size-sm, 0.875rem);
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: var(--spacing-sm, 0.5rem);
  padding-bottom: var(--spacing-xs, 0.25rem);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.story-people, .story-locations, .page-number {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
  background: rgba(0, 0, 0, 0.05);
  border-radius: var(--border-radius-full, 9999px);
  justify-content: center;
  color: #1a1a1a;
}

.meta-icon {
  width: 20px;
  height: 20px;
  opacity: 0.8;
}

.meta-count {
  font-size: var(--font-size-lg, 1.25rem);
  font-weight: 500;
  min-width: 1.5ch;
  text-align: center;
}

/* Modal Styles */
.story-modal {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: var(--spacing-md, 1rem);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border-radius: var(--border-radius-xl, 1rem);
}

.modal-content {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.98));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-lg, 0.5rem);
  width: calc(100% - 2rem);
  max-width: 900px;
  max-height: calc(100% - 2rem);
  overflow-y: auto;
  position: relative;
  color: var(--color-text-primary, #ffffff);
  transform: scale(1);
  opacity: 1;
  transition: all 0.3s ease;
}

.close-modal {
  position: absolute;
  top: var(--spacing-md, 1rem);
  right: var(--spacing-md, 1rem);
  background: none;
  border: none;
  color: var(--color-text-secondary, rgba(255, 255, 255, 0.6));
  cursor: pointer;
  padding: var(--spacing-sm, 0.5rem);
  transition: color 0.2s ease;
}

.close-modal:hover {
  color: var(--color-text-primary, #ffffff);
}

.close-icon {
  width: 24px;
  height: 24px;
}

.story-article {
  padding: var(--spacing-xl, 2rem);
  max-height: calc(90vh - 4rem);
  overflow-y: auto;
}

.story-article .story-header {
  margin-bottom: var(--spacing-lg, 1.5rem);
  text-align: center;
  flex-direction: column;
  align-items: center;
}

.story-article h1 {
  font-size: var(--font-size-2xl, 2rem);
  margin-bottom: var(--spacing-sm, 0.5rem);
  color: var(--color-text-primary, #ffffff);
}

.story-long-summary {
  font-size: var(--font-size-lg, 1.125rem);
  color: var(--color-text-secondary, rgba(255, 255, 255, 0.8));
  margin-bottom: var(--spacing-xl, 2rem);
  line-height: 1.6;
}

.story-text {
  font-size: var(--font-size-base, 1rem);
  line-height: 1.8;
  color: var(--color-text-primary, #ffffff);
  white-space: pre-wrap;
  margin-bottom: var(--spacing-xl, 2rem);
}

.story-image {
  margin-top: var(--spacing-xl, 2rem);
  border-radius: var(--border-radius-lg, 0.5rem);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.story-img {
  width: 100%;
  height: auto;
  display: block;
}

.story-footer {
  margin-top: var(--spacing-xl, 2rem);
  padding-top: var(--spacing-lg, 1.5rem);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.story-footer h3 {
  font-size: var(--font-size-lg, 1.125rem);
  color: var(--color-text-primary, #ffffff);
  margin-bottom: var(--spacing-sm, 0.5rem);
}

.story-footer ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm, 0.5rem);
}

.story-footer li {
  background: rgba(255, 255, 255, 0.05);
  padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
  border-radius: var(--border-radius-full, 9999px);
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, rgba(255, 255, 255, 0.8));
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Modal specific styles */
.modal-meta {
  display: flex;
  gap: var(--spacing-md, 1rem);
  align-items: center;
  justify-content: center;
  margin-top: var(--spacing-sm, 0.5rem);
}

.modal-page, .modal-date {
  background: rgba(255, 255, 255, 0.1);
  padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
  border-radius: var(--border-radius-full, 9999px);
  font-size: var(--font-size-sm, 0.875rem);
}

.modal-content-body {
  margin-top: var(--spacing-xl, 2rem);
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent);
  padding: var(--spacing-lg, 1.5rem);
  border-radius: var(--border-radius-lg, 0.5rem);
}

.modal-section {
  margin-bottom: var(--spacing-lg, 1.5rem);
}

.modal-section:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .stories-display {
    padding: 0.5rem;
    height: calc(100vh - var(--header-height, 60px) - var(--footer-height, 80px) - 3rem);
    margin-top: 0;
  }

  .stories-grid {
    grid-template-columns: 1fr;
    padding: 0.25rem;
    padding-right: 0.5rem;
  }

  .modal-content {
    width: calc(100% - 1rem);
    max-height: calc(100% - 1rem);
  }
}

/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0);
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.95);
  opacity: 0;
}
</style> 