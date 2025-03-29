<template>
  <div class="stories-view">
    <Header 
      :isHelpActive="false"
      @auth="onAuth"
      @help="onHelp"
      @toggle-mobile-menu="onToggleMobileMenu"
    />
    
    <main class="stories-content">
      <StoriesDisplay :storiesData="storiesData" />
    </main>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue';
import StoriesDisplay from '../components/stories/StoriesDisplay.vue';
import { storiesData } from '../data/storiesData';

function onAuth() {
  console.log('Auth button clicked');
}

function onHelp() {
  console.log('Help button clicked');
}

function onToggleMobileMenu() {
  console.log('Mobile menu toggled');
}
</script>

<style scoped>
.stories-view {
  position: relative;
  min-height: 100vh;
  color: var(--color-text-primary, #ffffff);
}

.stories-content {
  position: relative;
  padding: calc(var(--header-height) + 2rem) var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
  min-height: calc(100vh - var(--header-height));
  display: flex;
  flex-direction: column;
  z-index: 1;
}

@media (max-width: 768px) {
  .stories-content {
    padding: calc(var(--header-height) + 1rem) var(--spacing-sm);
  }
}
</style>
