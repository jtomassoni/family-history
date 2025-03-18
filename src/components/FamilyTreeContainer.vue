<template>
  <div class="family-tree-container">
    <!-- Render PersonCards in a flexible grid layout -->
    <div class="person-cards">
      <PersonCard
        v-for="(person, index) in peopleData"
        :key="index"
        :person="person"
      />
    </div>
  </div>
</template>

<script setup>
import PersonCard from './PersonCard.vue'
import { peopleData } from '../data/peopleData.js'
</script>

<style scoped>
.family-tree-container {
  position: relative;
}

/* Layout for the person cards */
.person-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
</style>
