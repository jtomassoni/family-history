<script setup>
import "./styles/main.css";
import { ref, onMounted, computed } from "vue";
import { photoData } from "./data/photoData.js";
import CustomButton from "./components/CustomButton.vue";
import PhotoTile from "./components/PhotoTile.vue";

// --------------------------
// 1. Sort Photos & Ensure Proper Date Handling
// --------------------------
const sortedPhotos = computed(() => {
  return photoData
    .slice()
    .map(photo => ({
      ...photo,
      eventDate: new Date(photo.eventDate) // Convert eventDate to Date object
    }))
    .sort((a, b) => a.eventDate - b.eventDate);
});

// --------------------------
// 2. Current Photo State & Default Selection
// --------------------------
const currentIndex = ref(0);

const findClosestPhotoIndex = () => {
  const today = new Date();
  let bestDiff = Infinity;
  let bestIndex = 0;
  sortedPhotos.value.forEach((photo, index) => {
    const diff = Math.abs(today - photo.eventDate);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = index;
    }
  });
  return bestIndex;
};

onMounted(() => {
  currentIndex.value = findClosestPhotoIndex();
  console.log("Starting at closest event:", sortedPhotos.value[currentIndex.value]);
});

// --------------------------
// 3. Computed Properties for Navigation & Labels
// --------------------------
const currentPhoto = computed(() => sortedPhotos.value[currentIndex.value] || null);

const formattedYear = computed(() => currentPhoto.value ? currentPhoto.value.eventDate.getUTCFullYear().toString() : "");
const formattedMonth = computed(() => currentPhoto.value ? currentPhoto.value.eventDate.toLocaleString("default", { month: "long", timeZone: "UTC" }) : "");
const formattedDay = computed(() => currentPhoto.value ? currentPhoto.value.eventDate.getUTCDate().toString() : "");

// --------------------------
// 4. Navigation Button Logic
// --------------------------
const isPreviousDisabled = computed(() => currentIndex.value <= 0);
const isNextDisabled = computed(() => currentIndex.value >= sortedPhotos.value.length - 1);
const isTodayDisabled = computed(() => currentIndex.value === findClosestPhotoIndex());

const previousPhoto = () => {
  const idx = sortedPhotos.value.findIndex(photo => photo.eventDate.getTime() === currentPhoto.value.eventDate.getTime());
  if (idx > 0) {
    currentIndex.value = idx - 1;
    console.log("Navigated to previous:", sortedPhotos.value[currentIndex.value]);
  }
};

const nextPhoto = () => {
  const idx = sortedPhotos.value.findIndex(photo => photo.eventDate.getTime() === currentPhoto.value.eventDate.getTime());
  if (idx >= 0 && idx < sortedPhotos.value.length - 1) {
    currentIndex.value = idx + 1;
    console.log("Navigated to next:", sortedPhotos.value[currentIndex.value]);
  }
};

const goToToday = () => {
  currentIndex.value = findClosestPhotoIndex();
  console.log("Navigated to today:", sortedPhotos.value[currentIndex.value]);
};
</script>

<template>
  <div>
    <!-- Persistent Breadcrumb Navigation -->
    <nav class="persistent-nav">
      <CustomButton @click="goToToday">
        {{ formattedYear || "Select Year" }}
      </CustomButton>
      <span class="breadcrumb-separator" v-if="formattedYear"> &gt; </span>
      <CustomButton v-if="formattedYear" @click="goToToday">
        {{ formattedMonth || "Select Month" }}
      </CustomButton>
      <span class="breadcrumb-separator" v-if="formattedMonth"> &gt; </span>
      <CustomButton v-if="formattedMonth" @click="goToToday">
        {{ formattedDay || "Select Day" }}
      </CustomButton>
    </nav>

    <!-- Day Navigation Controls (fixed at bottom) -->
    <div class="day-nav-controls">
      <CustomButton :class="{ disabled: isPreviousDisabled }" @click="previousPhoto">
        Previous Day
      </CustomButton>
      <CustomButton :class="{ disabled: isTodayDisabled }" @click="goToToday">
        Today (or nearest)
      </CustomButton>
      <CustomButton :class="{ disabled: isNextDisabled }" @click="nextPhoto">
        Next Day
      </CustomButton>
    </div>

    <!-- Timeline Display (Photo Tile) -->
    <div class="timeline-container">
      <transition name="fade">
        <div v-if="currentPhoto" class="photo-wrapper">
          <PhotoTile :photo="{
            ...currentPhoto,
            year: formattedYear,
            month: formattedMonth,
            day: formattedDay
          }" />
        </div>
      </transition>
    </div>
  </div>
</template>
