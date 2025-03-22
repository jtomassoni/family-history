<template>
  <div class="stories-page">
    <header class="stories-header">
      <h1>Family Stories</h1>
      <p class="stories-intro">
        Explore our family's history through stories, memories, and shared experiences. Browse by timeline, generations, themes, or locations.
      </p>
    </header>

    <StoryBrowser
      :stories="stories"
      :family-tree="familyTree"
      :themes="themes"
      :locations="locations"
    />
  </div>
</template>

<script setup>
import StoryBrowser from '../components/stories/StoryBrowser.vue';
import { stories, familyTree, themes, locations } from '../data/sampleStories';
</script>

<style scoped>
.stories-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-gray-50);
}

.stories-header {
  padding: var(--spacing-lg) var(--spacing-lg) 0;
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

/* Make StoryBrowser take remaining height */
.stories-page :deep(.story-browser) {
  flex: 1;
  min-height: 0; /* Required for Firefox */
}
</style>
