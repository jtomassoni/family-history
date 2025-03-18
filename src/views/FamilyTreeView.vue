<template>
  <div class="family-tree-page">
    <h1>Family Tree</h1>
    <FamilyTreeControls 
      v-model:search="searchQuery" 
      @update:zoom="updateZoom" 
    />
    <FamilyTreeContainer 
      :people="filteredPeople" 
      :zoomLevel="zoomLevel" 
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FamilyTreeControls from '../components/FamilyTreeControls.vue'
import FamilyTreeContainer from '../components/FamilyTreeContainer.vue'
import { peopleData } from '../data/peopleData.js'
import './FamilyTreeView.css'

// Define reactive state for search and zoom
const searchQuery = ref('')
const zoomLevel = ref(1)

// Update zoom level when FamilyTreeControls emits changes
const updateZoom = (newZoom) => {
  zoomLevel.value = newZoom
}

// Compute filtered list of people based on the search query
const filteredPeople = computed(() => {
  if (!searchQuery.value) return peopleData
  return peopleData.filter(person =>
    person.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>
