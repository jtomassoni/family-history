<template>
  <div class="stories-view">
    <UnderConstruction 
      title="Stories Coming Soon"
      message="We're currently curating and writing our family stories. Check back soon to explore our rich history and heritage. In the meantime, explore our gallery and stories!"
    />
  </div>
</template>

<script setup>
import UnderConstruction from '../components/common/UnderConstruction.vue';
</script>

<style scoped>
.stories-view {
  position: relative;
  min-height: calc(100vh - var(--header-height));
}

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
  transition: box-shadow 0.2s ease;
}

.story-card:hover {
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
