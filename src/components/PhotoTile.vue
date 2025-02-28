<template>
  <div class="photo-tile-container">
    <div class="photo-content">
      <div class="photo-image-container">
        <img :src="photo.url" :alt="photo.externalName" class="photo-image" />
      </div>
      <div class="photo-info">
        <h3 class="photo-title">{{ photo.externalName }}</h3>
        <p>{{ photo.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import "../styles/PhotoTile.css";

defineProps({
  photo: Object
});
</script>
