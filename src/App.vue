<template>
  <div id="app">
    <!-- Global Fixed Header -->
    <Header title="Tomassoni Family History" />

    <!-- DatePicker Navigation Container (positioned just below the header) -->
    <div class="breadcrumb-today-container" ref="dpContainer">
      <DatePickerNav 
        :events="sortedPhotos" 
        :currentIndex="currentIndex" 
        @select="handleSelectEvent" 
      />
    </div>

    <!-- Optional Boundary Messages -->
    <div class="boundary-message-container">
      <BoundaryMessage 
        v-if="isAtBeginning" 
        class="earliest-message" 
        message="📜 You’ve reached the beginning of recorded history!" 
      />
      <BoundaryMessage 
        v-if="isAtEnd" 
        class="latest-message" 
        message="🚀 You’re viewing the most recent event!" 
      />
    </div>

    <!-- Photo Navigation Area with Swipe Gestures -->
    <div class="photo-navigation-container"
         v-touch:swipe.left="previousPhoto"
         v-touch:swipe.right="nextPhoto">
      <BigNavArrow 
        direction="left" 
        label="Previous Photo" 
        @click="previousPhoto" 
        :disabled="isLeftArrowDisabled" 
      />
      <div class="photo-display-container">
        <transition name="fade">
          <div v-if="currentPhoto" class="photo-wrapper">
            <PhotoTile :photo="currentPhoto" />
          </div>
        </transition>
      </div>
      <BigNavArrow 
        direction="right" 
        label="Next Photo" 
        @click="nextPhoto" 
        :disabled="isRightArrowDisabled" 
      />
    </div>

    <!-- Global Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import "./styles/main.css";
import { photoData } from "./data/photoData.js";

import Header from "./components/Header.vue";
import DatePickerNav from "./components/DatePickerNav.vue";
import BoundaryMessage from "./components/BoundaryMessage.vue";
import BigNavArrow from "./components/BigNavArrow.vue";
import PhotoTile from "./components/PhotoTile.vue";
import Footer from "./components/Footer.vue";

// Sort photos (most recent first)
const sortedPhotos = computed(() => {
  return photoData
    .slice()
    .map(photo => ({
      ...photo,
      eventDate: new Date(photo.eventDate + "T00:00:00Z"),
      uploadedAt: new Date(photo.uploadedAt)
    }))
    .sort((a, b) => b.eventDate - a.eventDate);
});

const currentIndex = ref(0);
const currentPhoto = computed(() => sortedPhotos.value[currentIndex.value] || null);
const isAtBeginning = computed(() => currentIndex.value === sortedPhotos.value.length - 1);
const isAtEnd = computed(() => currentIndex.value === 0);
const isLeftArrowDisabled = computed(() => isAtBeginning.value);
const isRightArrowDisabled = computed(() => isAtEnd.value);

const previousPhoto = async () => {
  if (isLeftArrowDisabled.value) return;
  // Moving toward older photos increases the index.
  currentIndex.value = Math.min(currentIndex.value + 1, sortedPhotos.value.length - 1);
  await nextTick();
};

const nextPhoto = async () => {
  if (isRightArrowDisabled.value) return;
  // Moving toward newer photos decreases the index.
  currentIndex.value = Math.max(currentIndex.value - 1, 0);
  await nextTick();
};

const handleSelectEvent = (selectedEvent) => {
  const index = sortedPhotos.value.findIndex(
    (photo) => 
      new Date(photo.eventDate).toISOString().split("T")[0] === 
      new Date(selectedEvent.eventDate).toISOString().split("T")[0]
  );
  if (index >= 0) {
    currentIndex.value = index;
  }
};

onMounted(() => {
  currentIndex.value = 0;
});
</script>

<style scoped>
/* Add any component-specific styles here */
.timeline-container {
  /* Ensure the container is large enough for swipe detection */
  min-height: 300px;
}
</style>
