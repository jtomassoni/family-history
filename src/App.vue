<template>
  <div id="app">
    <!-- Global Fixed Header -->
    <Header title="My Awesome Site" />

    <!-- Group DatePicker Navigation (Now with Most Recent Button) -->
    <div class="breadcrumb-today-container" ref="dpContainer">
      <DatePickerNav :events="sortedPhotos" @select="handleSelectEvent" />
    </div>

    <!-- Boundary Messages (if any) -->
    <div class="boundary-message-container">
      <BoundaryMessage 
        v-if="isAtBeginning" 
        class="earliest-message" 
        message="📜 You’ve reached the beginning of recorded history!" 
      />
      <BoundaryMessage 
        v-if="isAtEnd" 
        class="latest-message" 
        message="🚀 Go make some new memories and add them here! (Login & Upload Coming Soon)" 
      />
    </div>

    <!-- Photo Navigation Area -->
    <div class="photo-navigation-container">
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
import { ref, onMounted, computed, nextTick } from "vue";
import "./styles/main.css";
import { photoData } from "./data/photoData.js";

import Header from "./components/Header.vue";
import DatePickerNav from "./components/DatePickerNav.vue";
import PhotoTile from "./components/PhotoTile.vue";
import BigNavArrow from "./components/BigNavArrow.vue";
import BoundaryMessage from "./components/BoundaryMessage.vue";
import Footer from "./components/Footer.vue";

const handleSelectEvent = (selectedEvent) => {
  console.log("Selected event:", selectedEvent);
  // Find the index of the selected event in sortedPhotos
  const index = sortedPhotos.value.findIndex(
    (photo) => photo.eventDate.getTime() === selectedEvent.eventDate.getTime()
  );
  if (index >= 0) {
    currentIndex.value = index;
  }
};

// 1. Sort photos by event date (newest first)
const sortedPhotos = computed(() => {
  return photoData.slice().map(photo => ({
    ...photo,
    eventDate: new Date(photo.eventDate + "T00:00:00Z"),
    uploadedAt: new Date(photo.uploadedAt)
  })).sort((a, b) => {
    if (a.eventDate.getTime() !== b.eventDate.getTime()) {
      return b.eventDate - a.eventDate;
    }
    if (a.uploadedAt.getTime() !== b.uploadedAt.getTime()) {
      return b.uploadedAt - a.uploadedAt;
    }
    return b.internalName.localeCompare(a.internalName);
  });
});

// 2. Current photo state & default selection.
const currentIndex = ref(0);
const findNewestPhotoIndex = () => 0;
onMounted(() => {
  currentIndex.value = findNewestPhotoIndex();
  console.log("Loaded most recent event:", sortedPhotos.value[currentIndex.value]);
});

// 3. Computed properties for navigation & labels.
const currentPhoto = computed(() => sortedPhotos.value[currentIndex.value] || null);
const isAtBeginning = computed(() => currentIndex.value === sortedPhotos.value.length - 1);
const isAtEnd = computed(() => currentIndex.value === 0);
const isLeftArrowDisabled = computed(() => isAtBeginning.value);
const isRightArrowDisabled = computed(() => isAtEnd.value);

// 4. Navigation button functions.
const previousPhoto = async () => {
  if (isLeftArrowDisabled.value) return;
  currentIndex.value = Math.min(currentIndex.value + 1, sortedPhotos.value.length - 1);
  await nextTick();
};

const nextPhoto = async () => {
  if (isRightArrowDisabled.value) return;
  currentIndex.value = Math.max(currentIndex.value - 1, 0);
  await nextTick();
};
</script>
