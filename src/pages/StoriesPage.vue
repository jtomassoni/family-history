<template>
  <div class="stories-page">
    <Header 
      :isHelpActive="false"
      @auth="onAuth"
      @help="onHelp"
      @toggle-mobile-menu="onToggleMobileMenu"
    />
    
    <main class="stories-content">
      <h1 class="page-title">Family Stories</h1>
      
      <div class="stories-timeline">
        <div 
          v-for="story in storiesData" 
          :key="story.id" 
          class="story-section"
          @click="readStory(story.id)"
        >
          <div class="story-container">
            <div class="story-header">
              <h2 class="story-title">{{ story.title }}</h2>
              <span class="story-date">{{ story.date }}</span>
            </div>
            <div class="story-content-preview">
              {{ story.content.slice(0, 800) }}...
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Story Modal -->
    <div v-if="selectedStory" class="story-modal" @click="closeStory">
      <div class="modal-content" @click.stop>
        <button class="close-modal" @click="closeStory">
          <span class="close-icon">×</span>
        </button>
        
        <article class="story-article">
          <header class="story-header">
            <h1>{{ selectedStory.title }}</h1>
            <span class="story-date">{{ selectedStory.date }}</span>
          </header>
          
          <div class="story-content" v-html="formattedContent"></div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'
import { ref, computed } from 'vue'
import { stories } from '../data/storiesData'

const storiesData = ref(stories)
const selectedStory = ref(null)

const formattedContent = computed(() => {
  if (!selectedStory.value) return ''
  return selectedStory.value.content
    .split('\n\n')
    .map(paragraph => `<p>${paragraph}</p>`)
    .join('')
})

function readStory(id) {
  selectedStory.value = storiesData.value.find(story => story.id === id)
  document.body.style.overflow = 'hidden'
}

function closeStory() {
  selectedStory.value = null
  document.body.style.overflow = 'auto'
}

function onAuth() {
  console.log('Auth button clicked')
}

function onHelp() {
  console.log('Help button clicked')
}

function onToggleMobileMenu() {
  console.log('Mobile menu toggled')
}
</script>

<style scoped>
.stories-page {
  min-height: 100vh;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  position: relative;
}

.stories-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1;
}

.stories-content {
  position: relative;
  z-index: 2;
  padding: calc(var(--header-height) - 0.5rem) var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
}

.page-title {
  font-family: var(--font-family-display);
  font-size: 2.5rem;
  font-weight: 500;
  margin-bottom: 2rem;
  line-height: 1.1;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  display: inline-block;
  position: relative;
  padding: 0 2rem;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 2px;
  background: var(--color-primary, #ff4444);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.page-title::before {
  display: none;
}

.stories-timeline {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 0;
  text-align: left;
}

.story-section {
  display: block;
  cursor: pointer;
}

.story-container {
  position: relative;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.story-section:hover .story-container {
  background: #2C1810;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.3);
}

.story-header {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.story-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: #1a1a1a;
  letter-spacing: -0.01em;
  transition: color 0.3s ease;
  margin-right: 0;
}

.story-date {
  font-size: 0.875rem;
  color: #666666;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: absolute;
  right: 1.5rem;
  top: 0.75rem;
}

.story-content-preview {
  font-size: 1rem;
  line-height: 1.4;
  color: #333333;
  white-space: pre-line;
  transition: all 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.story-section:hover .story-title {
  color: #E8C39E;
}

.story-section:hover .story-date {
  color: #A67C52;
}

.story-section:hover .story-content-preview {
  color: rgba(255, 255, 255, 0.9);
}

.story-link {
  display: none;
}

.story-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: #ffffff;
  border-radius: 4px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.story-article {
  padding: 3rem;
  max-width: 65ch;
  margin: 0 auto;
}

.story-article header {
  margin-bottom: 3rem;
  text-align: center;
}

.story-article h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.2;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
  text-align: center;
}

.story-content {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #333333;
}

.story-content p {
  margin-bottom: 1.5rem;
}

.close-modal {
  position: sticky;
  top: 1rem;
  right: 1rem;
  float: right;
  background: none;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666666;
  background: #f5f5f5;
  transition: background-color 0.2s ease;
}

.close-modal:hover {
  background: #e5e5e5;
}

.close-icon {
  font-size: 1.5rem;
  line-height: 1;
}

@media (max-width: 768px) {
  .stories-content {
    padding: calc(var(--header-height) + 0.5rem) var(--spacing-sm);
  }

  .page-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .story-container {
    padding: 0.5rem 1rem;
  }

  .story-header {
    margin-bottom: 0.25rem;
  }

  .story-title {
    font-size: 1.25rem;
  }

  .story-content-preview {
    font-size: 0.9375rem;
    line-height: 1.4;
    -webkit-line-clamp: 5;
  }

  .story-article {
    padding: 1.5rem;
  }

  .story-date {
    position: static;
    margin-top: 0.5rem;
  }
}
</style> 