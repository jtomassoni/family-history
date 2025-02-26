<template>
  <div>
    <NavBar
      :openYear="formattedYear"
      :openMonth="formattedMonth"
      :selectedDay="formattedDay"
      :validYears="validYears"
      @yearClick="goToToday"
      @monthClick="goToToday"
      @dayClick="goToToday"
    />

    <div class="photo-navigation-container">
      <BigNavArrow 
        direction="left" 
        label="Previous Photo" 
        @click="previousPhoto" 
        :disabled="isPreviousDisabled"
      />

      <div class="photo-display">
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
        :disabled="isNextDisabled"
      />
    </div>

    <div class="boundary-message-container">
      <BoundaryMessage v-if="isPreviousDisabled" class="earliest-message" message="📜 You’ve reached the beginning of recorded history!" />
      <BoundaryMessage v-if="isNextDisabled" class="latest-message" message="🚀 Go make some new memories and add them here! (Login & Upload Coming Soon)" />
    </div>

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
import BigNavArrow from "./components/BigNavArrow.vue";
import NavBar from "./components/NavBar.vue";
import BoundaryMessage from "./components/BoundaryMessage.vue";

// --------------------------
// 1. Sort Photos By Event Date, then Upload Time, then Internal Name
// --------------------------
const sortedPhotos = computed(() => {
  return photoData
    .slice()
    .map(photo => ({
      ...photo,
      eventDate: new Date(photo.eventDate + "T00:00:00Z"),
      uploadedAt: new Date(photo.uploadedAt)
    }))
    .sort((a, b) => {
      if (a.eventDate.getTime() !== b.eventDate.getTime()) {
        return b.eventDate - a.eventDate;
      }
      if (a.uploadedAt.getTime() !== b.uploadedAt.getTime()) {
        return b.uploadedAt - a.uploadedAt;
      }
      return b.internalName.localeCompare(a.internalName);
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

const formattedYear = computed(() => currentPhoto.value?.eventDate.getUTCFullYear().toString() || "");
const formattedMonth = computed(() => currentPhoto.value?.eventDate.toLocaleString("default", { month: "long", timeZone: "UTC" }) || "");
const formattedDay = computed(() => currentPhoto.value?.eventDate.getUTCDate().toString() || "");

const validYears = computed(() => {
  const years = [...new Set(sortedPhotos.value.map(photo => photo.eventDate.getUTCFullYear()))];
  return years.length > 1 ? `${years[0]} - ${years[years.length - 1]}` : years[0].toString();
});

// --------------------------
// 4. Navigation Button Logic (Fixing Left Arrow Clickability)
// --------------------------
const isPreviousDisabled = computed(() => currentIndex.value >= sortedPhotos.value.length - 1);
const isNextDisabled = computed(() => currentIndex.value <= 0);
const isTodayDisabled = computed(() => currentIndex.value === findNewestPhotoIndex());

// --------------------------
// 5. Navigation Button Functions (Fixing Left Arrow Clicks)
// --------------------------
const previousPhoto = async () => {
  if (isPreviousDisabled.value) return;
  
  console.log("⬅️ Attempting to navigate to previous...");
  console.log("Before Click - Current Index:", currentIndex.value);

  currentIndex.value = Math.min(currentIndex.value + 1, sortedPhotos.value.length - 1); // Moves back in time

  await nextTick();
  console.log("⬅️ After Click - Current Index:", currentIndex.value);
};

const nextPhoto = async () => {
  if (isNextDisabled.value) return;
  
  console.log("➡️ Attempting to navigate to next...");
  console.log("Before Click - Current Index:", currentIndex.value);

  currentIndex.value = Math.max(currentIndex.value - 1, 0); // Moves forward in time

  await nextTick();
  console.log("➡️ After Click - Current Index:", currentIndex.value);
};

const goToToday = async () => {
  console.log("🎯 Navigating to today...");
  currentIndex.value = findNewestPhotoIndex();
  await nextTick();
  console.log("Current Index After Today:", currentIndex.value);
};
</script>

