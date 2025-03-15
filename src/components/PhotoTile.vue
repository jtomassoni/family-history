<template>
  <div class="photo-tile-container">
    <div class="photo-content">
      <div 
        class="photo-image-container" 
        @click="toggleInfoOverlay"
        :class="{ 'faded': showInfoOverlay }"
      >
        <img :src="photo.url" :alt="photo.externalName" class="photo-image" />

        <!-- Debugging: Log Overlay State -->
        <transition name="fade">
          <div v-if="showInfoOverlay" class="photo-info-overlay">
            <h3 class="photo-title">{{ photo.externalName }}</h3>
            <p v-if="photo.description && photo.description.trim() !== ''">
              {{ photo.description }}
            </p>
            <p v-if="photo.eventDate">
              <strong>Event Date:</strong> {{ formatDate(photo.eventDate) }}
            </p>
            <p v-if="photo.uploadedAt">
              <strong>Uploaded:</strong> {{ formatDate(photo.uploadedAt) }}
            </p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, defineProps, watch, onMounted } from "vue";
import "../styles/PhotoTile.css";

const props = defineProps({
  photo: Object
});

const showInfoOverlay = ref(false);

const toggleInfoOverlay = () => {
  showInfoOverlay.value = !showInfoOverlay.value;
};

// Debugging: Ensure Vue is Rendering the Data Properly
watch(() => props.photo, (newVal) => {
  console.log("New Photo Data Loaded:", newVal);
});

onMounted(() => {
  console.log("PhotoTile Mounted. Photo Data:", props.photo);
});

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "Unknown Date";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};
</script>
