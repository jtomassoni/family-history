<template>
  <div class="photo-tile-container">
    <div class="photo-content">
      <!-- Photo Image (Click Toggles Data Overlay) -->
      <div 
        class="photo-image-container" 
        @click="toggleInfoOverlay"
        :class="{ 'faded': showInfoOverlay }"
      >
        <img :src="photo.url" :alt="photo.externalName" class="photo-image" />

        <!-- Ensure Vue Always Renders the Data Inside `.photo-info-overlay` -->
        <transition name="fade">
          <div v-if="showInfoOverlay" class="photo-info-overlay">
            <h3 class="photo-title">{{ photo?.externalName || 'No Title Found' }}</h3>
            <p v-if="photo?.description && photo.description.trim() !== ''">
              {{ photo?.description || 'No Description Available' }}
            </p>
            <p v-if="photo?.eventDate"><strong>Event Date:</strong> {{ formatDate(photo?.eventDate) }}</p>
            <p v-if="photo?.uploadedAt"><strong>Uploaded:</strong> {{ formatDate(photo?.uploadedAt) }}</p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, onMounted } from "vue";
import "../styles/PhotoTile.css";

const props = defineProps({
  photo: Object
});

const showInfoOverlay = ref(false);

const toggleInfoOverlay = () => {
  console.log("Toggling overlay. Current state:", showInfoOverlay.value);
  showInfoOverlay.value = !showInfoOverlay.value;
};

// Debugging: Ensure Vue is Rendering the Data
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
