<template>
  <div class="gallery-page">
    <h1>Gallery</h1>
    <p>Explore our collection of family photos below:</p>
    <div class="gallery-grid">
      <!-- Example gallery items (replace with your actual images) -->
      <div class="gallery-item" v-for="n in 6" :key="n">
        <img :src="`https://via.placeholder.com/200?text=Photo+${n}`" alt="Gallery Photo" />
      </div>
    </div>
  </div>
</template>

<script setup>
import './GalleryPage.css'
</script>
