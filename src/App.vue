<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import "./styles/main.css";
import { photoData } from "./data/photoData.js";
import CustomButton from "./components/CustomButton.vue";
import PhotoTile from "./components/PhotoTile.vue";

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

const findNewestPhotoIndex = () => 0; // The first item in sorted array (newest photo)

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

// --------------------------
// 4. Navigation Button Logic
// --------------------------
const isPreviousDisabled = computed(() => currentIndex.value <= 0);
const isNextDisabled = computed(() => currentIndex.value >= sortedPhotos.value.length - 1);
const isTodayDisabled = computed(() => currentIndex.value === findNewestPhotoIndex());

// --------------------------
// 5. Navigation Button Functions (Ensuring UI Updates Correctly)
// --------------------------
let navigationLock = false; // Prevent double execution

const nextPhoto = async () => {
  if (isPreviousDisabled.value || navigationLock) return;
  navigationLock = true;

  console.log("⬅️ Attempting to navigate to previous...");
  console.log("Current Index BEFORE:", currentIndex.value);

  currentIndex.value = Math.max(currentIndex.value - 1, 0);
  
  await nextTick(); // Ensure Vue updates the UI before continuing
  navigationLock = false; // Unlock navigation

  console.log("⬅️ Navigated to previous:", sortedPhotos.value[currentIndex.value]);
  console.log("Current Index AFTER:", currentIndex.value);
};

const previousPhoto = async () => {
  if (isNextDisabled.value || navigationLock) return;
  navigationLock = true;

  console.log("➡️ Attempting to navigate to next...");
  console.log("Current Index BEFORE:", currentIndex.value);

  currentIndex.value = Math.min(currentIndex.value + 1, sortedPhotos.value.length - 1);
  
  await nextTick(); // Ensure Vue updates the UI before continuing
  navigationLock = false; // Unlock navigation

  console.log("➡️ Navigated to next:", sortedPhotos.value[currentIndex.value]);
  console.log("Current Index AFTER:", currentIndex.value);
};

const goToToday = async () => {
  currentIndex.value = findNewestPhotoIndex();
  
  await nextTick(); // Ensure Vue updates the UI before continuing

  console.log("🎯 Navigated to today:", sortedPhotos.value[currentIndex.value]);
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

    <!-- Day Navigation Controls -->
    <div class="day-nav-controls">
      <CustomButton :class="{ disabled: isNextDisabled }" @click="previousPhoto">
        Previous (Backwards in Time)
      </CustomButton>
      <CustomButton :class="{ disabled: isTodayDisabled }" @click="goToToday">
        Today (Most Recent)
      </CustomButton>
      <CustomButton :class="{ disabled: isPreviousDisabled }" @click="nextPhoto">
        Next (Forwards in Time)
      </CustomButton>


    </div>

    <!-- Photo Display -->
    <div class="timeline-container">
      <transition name="fade">
        <div v-if="currentPhoto" class="photo-wrapper">
          <PhotoTile :photo="currentPhoto" />
        </div>
      </transition>
    </div>
  </div>
</template>
