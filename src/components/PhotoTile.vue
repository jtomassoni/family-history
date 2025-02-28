<template>
  <div class="photo-tile-container" ref="photoTile">
    <div class="photo-content">
      <div class="photo-image-container" :style="{ maxHeight: dynamicImageHeight }" @click="openModal">
        <img :src="photo.url" :alt="photo.externalName" class="photo-image" />
      </div>
      <div class="photo-info" ref="photoInfo">
        <h3 class="photo-title">{{ photo.externalName }}</h3>
        <p>{{ photo.description }}</p>
        <p v-if="photo.eventDate"><strong>Event Date:</strong> {{ formatDate(photo.eventDate) }}</p>
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

// Dynamically adjust image height to prevent cropping
const adjustImageHeight = () => {
  nextTick(() => {
    if (photoTile.value && photoInfo.value) {
      const viewportHeight = window.innerHeight;
      const footer = document.querySelector("footer");
      const footerHeight = footer ? footer.offsetHeight : 80;
      const navHeight = 100;
      const textHeight = photoInfo.value.offsetHeight + 40; // Extra padding for spacing
      const availableHeight = viewportHeight - footerHeight - navHeight - 100; // More space

      let newImageHeight = availableHeight - textHeight;

      // Adjust max height for desktop & mobile
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
  adjustImageHeight();
  window.addEventListener("resize", adjustImageHeight);
});

watch(() => photoInfo.value?.offsetHeight, adjustImageHeight);
</script>
