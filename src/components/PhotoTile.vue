<template>
  <div class="photo-tile-container" ref="photoTile">
    <div class="photo-content">
      <div class="photo-image-container" :style="{ maxHeight: dynamicImageHeight }" @click="openModal">
        <img :src="photo.url" :alt="photo.externalName" class="photo-image" />
      </div>
      <div class="photo-info" ref="photoInfo">
        <h3 class="photo-title">{{ photo.externalName }}</h3>
        <p>{{ photo.description }}</p>
        <p v-if="photo.date"><strong>Date:</strong> {{ formatDate(photo.date) }}</p>
        <p v-if="photo.uploadedAt"><strong>Uploaded:</strong> {{ formatDate(photo.uploadedAt) }}</p>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="isModalOpen" class="image-modal" @click="closeModal">
      <img :src="photo.url" :alt="photo.externalName" class="modal-image" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import "../styles/PhotoTile.css";

defineProps({
  photo: Object
});

const isModalOpen = ref(false);
const photoTile = ref(null);
const photoInfo = ref(null);
const dynamicImageHeight = ref("40vh"); // Default height

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

// Dynamically adjust image height to fit between navbar & footer
const adjustImageHeight = () => {
  nextTick(() => {
    if (photoTile.value && photoInfo.value) {
      const viewportHeight = window.innerHeight;
      const footerHeight = 70; // Adjust based on your footer height
      const navHeight = 100; // Adjust based on navbar height
      const textHeight = photoInfo.value.offsetHeight + 20; // Account for text blurb
      const availableHeight = viewportHeight - footerHeight - navHeight;

      let newImageHeight = availableHeight - textHeight;
      dynamicImageHeight.value = `${Math.max(25, newImageHeight)}vh`; // Ensures image doesn't get too small
    }
  });
};

onMounted(() => {
  adjustImageHeight();
  window.addEventListener("resize", adjustImageHeight);
});

watch(() => photoInfo.value?.offsetHeight, adjustImageHeight);
</script>
