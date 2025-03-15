<template>
  <div class="photo-tile-container">
    <div class="photo-content">
      <div 
        class="photo-image-container" 
        @click="toggleInfoOverlay"
      >
        <!-- Wrap the image in a transition so it fades in/out with :key changes -->
        <transition name="fade">
          <img 
            v-if="photo.url"
            :src="photo.url"
            :alt="photo.externalName"
            class="photo-image"
            :key="photo.id || photo.url"
          />
        </transition>

        <!-- Overlay for photo info -->
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
import { ref, defineProps, onMounted } from "vue";
import "../styles/PhotoTile.css";

const props = defineProps({
  photo: {
    type: Object,
    default: () => ({})
  }
});

const showInfoOverlay = ref(false);

const toggleInfoOverlay = () => {
  // If the user taps the image, toggle the overlay
  showInfoOverlay.value = !showInfoOverlay.value;
};

const formatDate = (dateString) => {
  if (!dateString) return "Unknown Date";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

onMounted(() => {
  console.log("PhotoTile Mounted. Photo Data:", props.photo);
});
</script>
