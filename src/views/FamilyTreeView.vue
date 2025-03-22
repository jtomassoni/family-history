<template>
  <div class="family-tree-page">
    <header class="family-header">
      <h1>Family Tree</h1>
      <p class="family-intro">
        Explore our family history through generations. Search for specific family members or browse the entire tree.
      </p>
    </header>

    <div class="family-controls">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search family members..."
          class="search-input"
        >
      </div>
      <div class="view-controls">
        <button 
          v-for="view in viewOptions" 
          :key="view.id"
          :class="['view-button', { active: currentView === view.id }]"
          @click="currentView = view.id"
        >
          {{ view.label }}
        </button>
      </div>
    </div>

    <div class="family-content">
      <!-- Tree View -->
      <div v-if="currentView === 'tree'" class="tree-view">
        <FamilyTreeContainer 
          :people="filteredPeople" 
          :zoomLevel="zoomLevel" 
        />
      </div>

      <!-- List View -->
      <div v-else-if="currentView === 'list'" class="list-view">
        <div v-for="person in filteredPeople" :key="person.id" class="person-card">
          <img :src="person.photo" :alt="person.name" class="person-photo">
          <div class="person-info">
            <h3>{{ person.name }}</h3>
            <p class="person-dates">{{ formatDates(person) }}</p>
            <p class="person-bio">{{ person.bio }}</p>
            <div class="person-details">
              <span v-if="person.birthPlace">📍 {{ person.birthPlace }}</span>
              <span v-if="person.occupation">💼 {{ person.occupation }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FamilyTreeContainer from '../components/FamilyTreeContainer.vue'
import { familyTree } from '../data/familyData.js'
import './FamilyTreeView.css'

// View state
const currentView = ref('tree')
const viewOptions = [
  { id: 'tree', label: 'Tree View' },
  { id: 'list', label: 'List View' }
]

// Search and zoom state
const searchQuery = ref('')
const zoomLevel = ref(1)

// Filter people based on search
const filteredPeople = computed(() => {
  if (!searchQuery.value) return familyTree
  const query = searchQuery.value.toLowerCase()
  return familyTree.filter(person => 
    person.name.toLowerCase().includes(query) ||
    person.birthPlace?.toLowerCase().includes(query) ||
    person.occupation?.toLowerCase().includes(query) ||
    person.bio.toLowerCase().includes(query)
  )
})

// Format dates for display
const formatDates = (person) => {
  const birth = person.birth ? new Date(person.birth).getFullYear() : '?'
  const death = person.death ? new Date(person.death).getFullYear() : ''
  return death ? `${birth} - ${death}` : `b. ${birth}`
}
</script>

<style scoped>
.family-tree-page {
  min-height: 100vh;
  background-color: var(--color-gray-50);
  padding: var(--spacing-lg);
}

.family-header {
  max-width: 800px;
  margin: 0 auto var(--spacing-xl);
}

.family-header h1 {
  font-size: var(--font-size-2xl);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-sm);
}

.family-intro {
  color: var(--color-gray-600);
  margin: 0;
}

.family-controls {
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

.view-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.view-button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  background: white;
  color: var(--color-gray-600);
  cursor: pointer;
  transition: all 0.2s;
}

.view-button.active {
  background: var(--color-blue-500);
  color: white;
  border-color: var(--color-blue-600);
}

.family-content {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  min-height: 500px;
}

.list-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.person-card {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.2s;
}

.person-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.person-photo {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.person-info {
  padding: var(--spacing-md);
}

.person-info h3 {
  margin: 0 0 var(--spacing-xs);
  color: var(--color-gray-900);
}

.person-dates {
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
  margin: 0 0 var(--spacing-sm);
}

.person-bio {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  margin: 0 0 var(--spacing-sm);
  line-height: 1.5;
}

.person-details {
  display: flex;
  gap: var(--spacing-sm);
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
}

@media (max-width: 768px) {
  .family-tree-page {
    padding: var(--spacing-md);
  }

  .family-controls {
    flex-direction: column;
  }

  .search-box {
    width: 100%;
  }

  .view-controls {
    width: 100%;
    justify-content: stretch;
  }

  .view-button {
    flex: 1;
  }

  .list-view {
    grid-template-columns: 1fr;
  }
}
</style>
