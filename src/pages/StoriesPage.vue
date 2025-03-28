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
      
      <!-- Summary Section -->
      <section class="summary-section">
        <h2 class="section-title">Family History Summary</h2>
        <div class="summary-content">
          <p>The Tomassoni family's journey began in the picturesque village of Costaciaro, Italy, where Guido Tomassoni was born in 1890. The family's story is one of resilience, adaptation, and the pursuit of the American dream. From their humble beginnings in Italy, where they lived in a traditional two-story home with their livestock, to their eventual establishment in Hibbing, Minnesota, the Tomassoni family has left an indelible mark on their community.</p>
          
          <p>Guido's early life was marked by his musical talent, learning the clarinet at age 7, and his limited formal education through the 3rd grade. In 1906, at the age of 16, he and his brothers embarked on a journey to America, following their older brother Egisto to Hibbing, Minnesota. There, they found work in the underground mines, using calcium carbide lamps for light and manual tools for digging.</p>
          
          <p>The family's transition from mining to business ownership began in 1930 when Guido and his brother-in-law Charlie Gambucci purchased a grocery store. This marked a significant shift in the family's fortunes, as they became pillars of their community, providing essential services and extending credit to those in need during difficult times.</p>
          
          <p>The family's legacy continues through their descendants, with many pursuing careers in engineering, education, and various other fields. Their story is one of perseverance, community spirit, and the enduring bonds of family.</p>
        </div>
      </section>

      <!-- Original Stories Section -->
      <section class="original-stories-section">
        <h2 class="section-title">In Their Own Words</h2>
        <p class="section-subtitle">The following stories are the direct accounts of Marian Tomassoni, preserving the authentic voice and memories of our family history.</p>
        
        <div class="stories-grid">
          <div 
            v-for="story in stories" 
            :key="story.id" 
            class="story-section"
            @click="readStory(story.id)"
          >
            <div class="story-container">
              <div class="story-header">
                <h2 class="story-title">{{ story.title }}</h2>
                <span class="story-date">{{ story.date }}</span>
              </div>
              <div class="story-summary">
                {{ story.summary || story.content.slice(0, 200) }}...
              </div>
              <div class="story-tags">
                <span v-for="tag in story.tags" :key="tag" class="story-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
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
import { storiesData } from '../data/storiesData.js'

const stories = ref(storiesData)
const selectedStory = ref(null)

const formattedContent = computed(() => {
  if (!selectedStory.value) return ''
  return selectedStory.value.content.replace(/\n/g, '<br>')
})

function readStory(id) {
  selectedStory.value = stories.value.find(story => story.id === id)
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

.summary-section {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.section-title {
  font-family: var(--font-family-display);
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  text-align: center;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666666;
  text-align: center;
  margin-bottom: 2rem;
  font-style: italic;
}

.summary-content {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333333;
}

.summary-content p {
  margin-bottom: 1.5rem;
}

.summary-content p:last-child {
  margin-bottom: 0;
}

.original-stories-section {
  margin-top: 3rem;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

.story-section {
  display: block;
  cursor: pointer;
  height: 100%;
}

.story-container {
  height: 100%;
  position: relative;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
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

.story-summary {
  font-size: 1rem;
  line-height: 1.4;
  color: #333333;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.story-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
}

.story-tag {
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  background: rgba(44, 24, 16, 0.1);
  color: #2C1810;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.story-section:hover .story-title {
  color: #E8C39E;
}

.story-section:hover .story-date {
  color: #A67C52;
}

.story-section:hover .story-summary {
  color: rgba(255, 255, 255, 0.9);
}

.story-section:hover .story-tag {
  background: rgba(232, 195, 158, 0.2);
  color: #A67C52;
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
  white-space: pre-line;
  text-align: left;
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

  .story-summary {
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

  .stories-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-section {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .summary-content {
    font-size: 1rem;
  }
}
</style> 