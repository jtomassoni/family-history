<template>
  <div class="stories-page">
    <header class="stories-header">
      <h1>Family Stories</h1>
      <p class="stories-intro">
        Explore our family's history through stories, memories, and shared experiences. Browse by timeline, generations, themes, or locations.
      </p>
    </header>

    <div class="stories-controls">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search stories..."
          class="search-input"
        >
      </div>
      <div class="filter-controls">
        <select v-model="selectedTheme" class="filter-select">
          <option value="">All Themes</option>
          <option v-for="theme in themes" :key="theme.id" :value="theme.id">
            {{ theme.name }} ({{ theme.count }})
          </option>
        </select>
        <select v-model="selectedLocation" class="filter-select">
          <option value="">All Locations</option>
          <option v-for="location in locations" :key="location.id" :value="location.id">
            {{ location.name }} ({{ location.count }})
          </option>
        </select>
      </div>
    </div>

    <div class="stories-grid">
      <div v-for="story in filteredStories" :key="story.id" class="story-card">
        <div class="story-image">
          <img :src="story.coverImage" :alt="story.title">
          <div class="story-meta">
            <span class="story-date">{{ formatDate(story.date) }}</span>
            <span class="story-theme">{{ story.theme }}</span>
          </div>
        </div>
        <div class="story-content">
          <h2>{{ story.title }}</h2>
          <p class="story-description">{{ story.description }}</p>
          <div class="story-details">
            <span class="story-location">📍 {{ story.location }}</span>
            <span class="story-people">👥 {{ story.people.length }} people</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { stories, themes, locations } from '../data/sampleStories';

// Filter state
const searchQuery = ref('');
const selectedTheme = ref('');
const selectedLocation = ref('');

// Filter stories based on search and filters
const filteredStories = computed(() => {
  return stories.filter(story => {
    const matchesSearch = !searchQuery.value || 
      story.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      story.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const matchesTheme = !selectedTheme.value || 
      story.theme.toLowerCase() === selectedTheme.value.toLowerCase();
    
    const matchesLocation = !selectedLocation.value || 
      story.location.toLowerCase().includes(selectedLocation.value.toLowerCase());
    
    return matchesSearch && matchesTheme && matchesLocation;
  });
});

// Format date for display
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.stories-page {
  min-height: 100vh;
  background-color: var(--color-gray-50);
  padding: var(--spacing-lg);
}

.stories-header {
  max-width: 800px;
  margin: 0 auto var(--spacing-xl);
}

.stories-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-sm);
}

.stories-intro {
  color: var(--color-gray-600);
  max-width: 600px;
  margin: 0;
}

.stories-controls {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
}

.filter-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.filter-select {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  background: white;
  color: var(--color-gray-700);
  font-size: var(--font-size-base);
  min-width: 150px;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.story-card {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.story-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.story-image {
  position: relative;
  height: 200px;
}

.story-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-meta {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-sm);
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
}

.story-content {
  padding: var(--spacing-md);
}

.story-content h2 {
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-size-lg);
  color: var(--color-gray-900);
}

.story-description {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  margin: 0 0 var(--spacing-md);
  line-height: 1.5;
}

.story-details {
  display: flex;
  gap: var(--spacing-md);
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
}

@media (max-width: 768px) {
  .stories-page {
    padding: var(--spacing-md);
  }

  .stories-controls {
    flex-direction: column;
  }

  .filter-controls {
    width: 100%;
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .stories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
