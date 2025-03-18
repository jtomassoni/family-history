<template>
  <div class="family-tree-controls">
    <!-- Filter search component -->
    <FilterSearch v-model="searchQuery" />

    <!-- Zoom controls -->
    <div class="zoom-controls">
      <button @click="zoomIn">+</button>
      <button @click="zoomOut">-</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue'
import FilterSearch from './FilterSearch.vue'

const emit = defineEmits(['update:search', 'update:zoom'])
const searchQuery = ref('')

// Whenever searchQuery changes, emit the updated value
watch(searchQuery, (newQuery) => {
  emit('update:search', newQuery)
})

// Manage a simple zoom level state
const zoomLevel = ref(1)

const zoomIn = () => {
  zoomLevel.value += 0.1
  emit('update:zoom', zoomLevel.value)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(0.5, zoomLevel.value - 0.1)
  emit('update:zoom', zoomLevel.value)
}
</script>

<style scoped>
.family-tree-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.zoom-controls button {
  margin: 0 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #5d3a1a;
  color: #fff;
  transition: background-color 0.2s;
}

.zoom-controls button:hover {
  background-color: #7a5730;
}
</style>
