<template>
  <div id="app">
    <!-- 1) Thick Fixed Header -->
    <Header title="Tomassoni Family History" />

    <!-- 2) Main content properly spaced -->
    <div class="app-content">
      <!-- 3) Centered Boundary Messages -->
      <BoundaryMessage v-if="showEarliest" message="📜 You’ve reached the earliest photo! (Tap X to close)" @close="showEarliest = false" />
      <BoundaryMessage v-if="showLatest" message="You’re viewing the most recent event! (Tap X to close)" @close="showLatest = false" />

      <!-- 4) Breadcrumb Buttons -->
      <div class="breadcrumb-today-container">
        <DatePickerNav
          :events="sortedPhotos"
          :currentIndex="currentIndex"
          @select="handleSelectEvent"
        />
      </div>

      <!-- 5) Photo Navigation & Tile -->
      <div class="photo-navigation-container" v-touch:swipe.left="nextPhoto" v-touch:swipe.right="previousPhoto">
        <BigNavArrow direction="left" @click="previousPhoto" :disabled="isLeftArrowDisabled" />
        <div class="photo-display-container">
          <transition name="fade">
            <div v-if="currentPhoto" class="photo-wrapper">
              <PhotoTile :photo="currentPhoto" />
            </div>
          </transition>
        </div>
        <BigNavArrow direction="right" @click="nextPhoto" :disabled="isRightArrowDisabled" />
      </div>

      <!-- 6) Swipe Hint -->
      <SwipeHint />
    </div>

    <!-- 7) Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import "./styles/main.css";
import { photoData } from "./data/photoData.js";

import Header from "./components/Header.vue";
import DatePickerNav from "./components/DatePickerNav.vue";
import BoundaryMessage from "./components/BoundaryMessage.vue";
import BigNavArrow from "./components/BigNavArrow.vue";
import PhotoTile from "./components/PhotoTile.vue";
import Footer from "./components/Footer.vue";
import SwipeHint from "./components/SwipeHint.vue";

/** 🖼️ Prepare and sort photos */
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

/** 🏷️ Track Current Photo */
const currentIndex = ref(0);
const currentPhoto = computed(() => sortedPhotos.value[currentIndex.value] || null);

/** ⏩ Track Navigation States */
const isAtBeginning = computed(() => currentIndex.value === sortedPhotos.value.length - 1);
const isAtEnd = computed(() => currentIndex.value === 0);
const isLeftArrowDisabled = computed(() => isAtBeginning.value);
const isRightArrowDisabled = computed(() => isAtEnd.value);

/** 🚨 Track Boundary Messages */
const showEarliest = ref(false);
const showLatest = ref(false);

/** 🔍 Watch Current Index for Boundary Changes */
watch(currentIndex, () => {
  showEarliest.value = currentIndex.value === sortedPhotos.value.length - 1;
  showLatest.value = currentIndex.value === 0;
});

/** 🖱️ Next/Previous Photo Logic */
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

/** 📅 Handle Date Selection */
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

/** 🚀 Ensure Boundary Message Appears on Load */
onMounted(() => {
  currentIndex.value = 0; // Ensure we start at the most recent event
  showLatest.value = true; // Show boundary message at load if on newest event
});
</script>
