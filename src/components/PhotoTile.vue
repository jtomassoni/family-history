<template>
  <div class="photo-tile-container">
    <div class="photo-content">
      <div class="photo-image-container" @click="openModal">
        <img :src="photo.url" :alt="photo.externalName" class="photo-image" />
      </div>
      <div class="photo-info">
        <h3 class="photo-title">{{ photo.externalName }}</h3>
        <p>{{ photo.description }}</p>
        <p v-if="photo.eventDate"><strong>Date:</strong> {{ formatDate(photo.eventDate) }}</p>
        <p v-if="photo.uploadedAt"><strong>Uploaded:</strong> {{ formatDate(photo.uploadedAt) }}</p>
        <p><strong>Uploaded by:</strong> James Tomassoni</p>

      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="isModalOpen" class="image-modal" @click="closeModal">
      <img :src="photo.url" :alt="photo.externalName" class="modal-image" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import "../styles/PhotoTile.css";

defineProps({
  photo: Object
});

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};
</script>
