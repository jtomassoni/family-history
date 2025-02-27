<template>
  <div id="app">
    <!-- Global Fixed Header -->
    <Header title="Tomassoni Family History" />

    <!-- DatePicker Navigation Container (positioned just below the header) -->
    <div class="breadcrumb-today-container" ref="dpContainer">
      <!-- The DatePickerNav component provides the interactive date selection.
           It receives the sorted events array and the currentIndex so that it can disable
           "Most Recent" or "Oldest" buttons as appropriate. -->
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
import { ref, computed, onMounted, nextTick } from 'vue';
import "./styles/main.css";
import { photoData } from "./data/photoData.js";

import Header from "./components/Header.vue";
import DatePickerNav from "./components/DatePickerNav.vue";
import BoundaryMessage from "./components/BoundaryMessage.vue";
import BigNavArrow from "./components/BigNavArrow.vue";
import PhotoTile from "./components/PhotoTile.vue";
import Footer from "./components/Footer.vue";

// Assume that photoData is sorted in descending order (most recent at index 0).
// If not, sort it here.
const sortedPhotos = computed(() => {
  return photoData
    .slice()
    .map(photo => ({
      ...photo,
      // Convert the eventDate string to a Date object.
      eventDate: new Date(photo.eventDate + "T00:00:00Z"),
      uploadedAt: new Date(photo.uploadedAt)
    }))
    .sort((a, b) => b.eventDate - a.eventDate);
});

// Parent-managed current index; ensure this is updated when DatePickerNav emits 'select'
const currentIndex = ref(0);

// Computed property to get the current event (if any)
const currentPhoto = computed(() => sortedPhotos.value[currentIndex.value] || null);

// Boundary messages computed based on currentIndex.
const isAtBeginning = computed(() => currentIndex.value === sortedPhotos.value.length - 1);
const isAtEnd = computed(() => currentIndex.value === 0);

// Arrow disable conditions.
const isLeftArrowDisabled = computed(() => isAtBeginning.value);
const isRightArrowDisabled = computed(() => isAtEnd.value);

// Navigation methods.
const previousPhoto = async () => {
  if (isLeftArrowDisabled.value) return;
  // Moving from most recent (index 0) toward older events increases the index.
  currentIndex.value = Math.min(currentIndex.value + 1, sortedPhotos.value.length - 1);
  await nextTick();
};

const nextPhoto = async () => {
  if (isRightArrowDisabled.value) return;
  // Moving toward newer events decreases the index.
  currentIndex.value = Math.max(currentIndex.value - 1, 0);
  await nextTick();
};

// When DatePickerNav emits a select event, update currentIndex accordingly.
const handleSelectEvent = (selectedEvent) => {
  console.log("Selected event from datepicker:", selectedEvent);

  const index = sortedPhotos.value.findIndex(
    (photo) => 
      new Date(photo.eventDate).toISOString().split("T")[0] === 
      new Date(selectedEvent.eventDate).toISOString().split("T")[0]
  );

  if (index >= 0) {
    console.log("Updating currentIndex to:", index);
    currentIndex.value = index;
  } else {
    console.warn("Selected event not found in sortedPhotos.");
  }
};

// On mount, set currentIndex to 0 (most recent event).
onMounted(() => {
  currentIndex.value = 0;
});
</script>
