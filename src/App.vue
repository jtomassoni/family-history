<template>
  <div>
    <!-- Persistent Breadcrumb Navigation -->
    <NavBar
      :openYear="formattedYear"
      :openMonth="formattedMonth"
      :selectedDay="formattedDay"
      :validYears="validYears"
      @yearClick="goToToday"
      @monthClick="goToToday"
      @dayClick="goToToday"
    />

    <!-- Photo Display with Large Left/Right Navigation -->
    <div class="photo-navigation-container">
      <LeftArrow @click="previousPhoto" :disabled="isPreviousDisabled" />

      <div class="photo-display">
        <transition name="fade">
          <div v-if="currentPhoto" class="photo-wrapper">
            <PhotoTile :photo="currentPhoto" />
          </div>
        </transition>
      </div>

      <RightArrow @click="nextPhoto" :disabled="isNextDisabled" />
    </div>

    <!-- Boundary Messages Section (Separate from Arrows) -->
    <div class="boundary-message-container">
      <div v-if="isPreviousDisabled" class="boundary-message earliest-message">
        📜 You’ve reached the beginning of recorded history! <br />
        Maybe there’s more to discover?
      </div>
      <div v-if="isNextDisabled" class="boundary-message latest-message">
        🚀 Go make some new memories and add them here! <br />
        (Login & Upload Coming Soon)
      </div>
    </div>

    <!-- Restore Today Button -->
    <div class="day-nav-controls">
      <CustomButton :class="{ disabled: isTodayDisabled }" @click="goToToday">
        Today (most recent)
      </CustomButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import "./styles/main.css";
import { photoData } from "./data/photoData.js";
import CustomButton from "./components/CustomButton.vue";
import PhotoTile from "./components/PhotoTile.vue";
import LeftArrow from "./components/LeftArrow.vue";
import RightArrow from "./components/RightArrow.vue";
import NavBar from "./components/NavBar.vue";
import BoundaryMessage from "./components/BoundaryMessage.vue"; // ✅ Use new BoundaryMessage component

// --------------------------
// 1. Sort Photos By Event Date, then Upload Time, then Internal Name
// --------------------------
const sortedPhotos = computed(() => {
  return photoData
    .slice()
    .map(photo => ({
      ...photo,
      eventDate: new Date(photo.eventDate + "T00:00:00Z"), // Force UTC parsing
      uploadedAt: new Date(photo.uploadedAt) // Ensure uploadedAt is parsed
    }))
    .sort((a, b) => {
      if (a.eventDate.getTime() !== b.eventDate.getTime()) {
        return b.eventDate - a.eventDate; // Sort by eventDate (newest first)
      }
      if (a.uploadedAt.getTime() !== b.uploadedAt.getTime()) {
        return b.uploadedAt - a.uploadedAt; // Sort by uploadedAt (newest first)
      }
      return b.internalName.localeCompare(a.internalName); // Sort by internalName (desc order)
    });
});

// --------------------------
// 2. Current Photo State & Default Selection
// --------------------------
const currentIndex = ref(0);

const findNewestPhotoIndex = () => 0; // First item in sorted array (newest photo)

onMounted(() => {
  currentIndex.value = findNewestPhotoIndex();
  console.log("✅ Loaded most recent event:", sortedPhotos.value[currentIndex.value]);
});

// --------------------------
// 3. Computed Properties for Navigation & Labels
// --------------------------
const currentPhoto = computed(() => sortedPhotos.value[currentIndex.value] || null);

const formattedYear = computed(() => currentPhoto.value ? currentPhoto.value.eventDate.getUTCFullYear().toString() : "");
const formattedMonth = computed(() => currentPhoto.value ? currentPhoto.value.eventDate.toLocaleString("default", { month: "long", timeZone: "UTC" }) : "");
const formattedDay = computed(() => currentPhoto.value ? currentPhoto.value.eventDate.getUTCDate().toString() : "");

const validYears = computed(() => {
  const years = [...new Set(sortedPhotos.value.map(photo => photo.eventDate.getUTCFullYear()))];
  return years.length > 1 ? `${years[0]} - ${years[years.length - 1]}` : years[0].toString();
});

// --------------------------
// 4. Navigation Button Logic
// --------------------------
const isPreviousDisabled = computed(() => currentIndex.value >= sortedPhotos.value.length - 1);
const isNextDisabled = computed(() => currentIndex.value <= 0);
const isTodayDisabled = computed(() => currentIndex.value === findNewestPhotoIndex());

// --------------------------
// 5. Navigation Button Functions
// --------------------------
let navigationLock = false;

const previousPhoto = async () => { // Moves BACKWARD in time
  if (isPreviousDisabled.value || navigationLock) return;
  navigationLock = true;

  console.log("⬅️ Navigating to previous...");
  currentIndex.value = Math.min(currentIndex.value + 1, sortedPhotos.value.length - 1);
  
  await nextTick();
  navigationLock = false;
};

const nextPhoto = async () => { // Moves FORWARD in time
  if (isNextDisabled.value || navigationLock) return;
  navigationLock = true;

  console.log("➡️ Navigating to next...");
  currentIndex.value = Math.max(currentIndex.value - 1, 0);
  
  await nextTick();
  navigationLock = false;
};

const goToToday = async () => {
  currentIndex.value = findNewestPhotoIndex();
  
  await nextTick();
};
</script>
