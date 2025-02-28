<template>
  <div class="photo-tile-container" ref="photoTile">
    <div class="photo-content">
      <div 
        class="photo-image-container" 
        :class="{ 'mobile-clickable': isMobile }" 
        :style="{ maxHeight: dynamicImageHeight }" 
        @click="openModalIfMobile"
      >
        <img :src="photo.url" :alt="photo.externalName" class="photo-image" />
      </div>
      <div class="photo-info" ref="photoInfo">
        <h3 class="photo-title">{{ photo.externalName }}</h3>
        <p>{{ photo.description }}</p>
        <p v-if="photo.eventDate"><strong>Event Date:</strong> {{ formatDate(photo.eventDate) }}</p>
        <p v-if="photo.uploadedAt"><strong>Uploaded:</strong> {{ formatDate(photo.uploadedAt) }}</p>
      </div>
    </div>

    <!-- Enlarged Full-Screen Modal (Mobile Only) -->
    <div v-if="isModalOpen && isMobile" class="image-modal" @click="closeModal">
      <div class="modal-content">
        <img :src="photo.url" :alt="photo.externalName" class="modal-image" />
      </div>
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
const isMobile = ref(false);
const photoTile = ref(null);
const photoInfo = ref(null);
const dynamicImageHeight = ref("40vh");

const openModalIfMobile = () => {
  if (isMobile.value) {
    isModalOpen.value = true;
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

// Adjust image height dynamically
const adjustImageHeight = () => {
  nextTick(() => {
    if (photoTile.value && photoInfo.value) {
      const viewportHeight = window.innerHeight;
      const footer = document.querySelector("footer");
      const footerHeight = footer ? footer.offsetHeight : 80;
      const navHeight = 100;
      const textHeight = photoInfo.value.offsetHeight + 40;
      const availableHeight = viewportHeight - footerHeight - navHeight - 100;

      let newImageHeight = availableHeight - textHeight;
      if (window.innerWidth > 1024) {
        newImageHeight = Math.min(newImageHeight, 50);
      } else {
        newImageHeight = Math.min(newImageHeight, 35);
      }

      dynamicImageHeight.value = `${Math.max(25, newImageHeight)}vh`;
    }
  });
};

onMounted(() => {
  isMobile.value = window.innerWidth <= 1024; // Check if device is mobile
  adjustImageHeight();
  window.addEventListener("resize", adjustImageHeight);
});

watch(() => photoInfo.value?.offsetHeight, adjustImageHeight);
</script>
