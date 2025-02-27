<template>
  <div>
    <!-- Permanent Fixed Header -->
    <Header title="My Awesome Site" />

    <!-- NavBar (datepicker breadcrumb) immediately below the header -->
    <NavBar
      :openYear="formattedYear"
      :openMonth="formattedMonth"
      :selectedDay="formattedDay"
      :validYears="validYears"
      @yearClick="goToToday"
      @monthClick="goToToday"
      @dayClick="goToToday"
    />

    <!-- Today (most recent) picker below the NavBar -->
    <div class="day-nav-controls">
      <CustomButton :class="{ disabled: isTodayDisabled }" @click="goToToday">
        Today (most recent)
      </CustomButton>
    </div>

    <!-- Boundary Messages immediately beneath the Today button -->
    <div class="boundary-message-container">
      <BoundaryMessage 
        v-if="isPreviousDisabled" 
        class="earliest-message" 
        message="📜 You’ve reached the beginning of recorded history!" 
      />
      <BoundaryMessage 
        v-if="isNextDisabled" 
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
        :disabled="isPreviousDisabled"
      />

      <!-- Centering container for the photo tile -->
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
        :disabled="isNextDisabled"
      />
    </div>

    <!-- Fixed Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import "./styles/main.css";
import { photoData } from "./data/photoData.js";

import Header from "./components/Header.vue";
import NavBar from "./components/NavBar.vue";
import CustomButton from "./components/CustomButton.vue";
import PhotoTile from "./components/PhotoTile.vue";
import BigNavArrow from "./components/BigNavArrow.vue";
import BoundaryMessage from "./components/BoundaryMessage.vue";
import Footer from "./components/Footer.vue";

// 1. Sort photos by event date, then upload time, then internal name.
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

// 2. Current photo state & default selection.
const currentIndex = ref(0);
const findNewestPhotoIndex = () => 0;
onMounted(() => {
  currentIndex.value = findNewestPhotoIndex();
  console.log("Loaded most recent event:", sortedPhotos.value[currentIndex.value]);
});

// 3. Computed properties for navigation & labels.
const currentPhoto = computed(() => sortedPhotos.value[currentIndex.value] || null);
const formattedYear = computed(() => currentPhoto.value?.eventDate.getUTCFullYear().toString() || "");
const formattedMonth = computed(() =>
  currentPhoto.value?.eventDate.toLocaleString("default", { month: "long", timeZone: "UTC" }) || ""
);
const formattedDay = computed(() => currentPhoto.value?.eventDate.getUTCDate().toString() || "");
const validYears = computed(() => {
  const years = [...new Set(sortedPhotos.value.map(photo => photo.eventDate.getUTCFullYear()))];
  return years.length > 1 ? `${years[0]} - ${years[years.length - 1]}` : years[0].toString();
});

// 4. Navigation button logic.
const isPreviousDisabled = computed(() => currentIndex.value >= sortedPhotos.value.length - 1);
const isNextDisabled = computed(() => currentIndex.value <= 0);
const isTodayDisabled = computed(() => currentIndex.value === findNewestPhotoIndex());

// 5. Navigation button functions.
const previousPhoto = async () => {
  if (isPreviousDisabled.value) return;
  currentIndex.value = Math.min(currentIndex.value + 1, sortedPhotos.value.length - 1);
  await nextTick();
};

const nextPhoto = async () => {
  if (isNextDisabled.value) return;
  currentIndex.value = Math.max(currentIndex.value - 1, 0);
  await nextTick();
};

const goToToday = async () => {
  currentIndex.value = findNewestPhotoIndex();
  await nextTick();
};
</script>
