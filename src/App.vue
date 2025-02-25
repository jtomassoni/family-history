<script setup>
import "./styles/main.css";
import { ref, onMounted, computed } from "vue";
import { photoData } from "./data/photoData.js";
import CustomButton from "./components/CustomButton.vue";
import PhotoTile from "./components/PhotoTile.vue";

// Sort the photos by date and assign an index-based id.
const sortedPhotos = computed(() => {
  return photoData
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((photo, index) => ({
      ...photo,
      sortIndex: index,
      id: index + 1
    }));
});

// Reactive state: current photo index (starting at 0)
const currentIndex = ref(0);

// Helper function to find the index of the photo closest to today.
const findClosestIndex = () => {
  const today = new Date();
  let bestDiff = Infinity;
  let bestIndex = 0;
  sortedPhotos.value.forEach((photo, index) => {
    const diff = Math.abs(new Date(photo.date) - today);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = index;
    }
  });
  return bestIndex;
};

onMounted(() => {
  currentIndex.value = findClosestIndex();
});

// Navigation functions
const previousPhoto = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const nextPhoto = () => {
  if (currentIndex.value < sortedPhotos.value.length - 1) {
    currentIndex.value++;
  }
};

const goToToday = () => {
  currentIndex.value = findClosestIndex();
};

// Computed properties for the current photo and button disabled states
const currentPhoto = computed(() => sortedPhotos.value[currentIndex.value]);

const isPreviousDisabled = computed(() => currentIndex.value === 0);
const isNextDisabled = computed(() => currentIndex.value === sortedPhotos.value.length - 1);
const isTodayDisabled = computed(() => {
  const todayIndex = findClosestIndex();
  return currentIndex.value === todayIndex;
});
</script>

<template>
  <div>
    <!-- Navigation Controls -->
    <div class="nav-controls">
      <CustomButton :class="{ disabled: isPreviousDisabled }" @click="previousPhoto">
        Previous
      </CustomButton>
      <CustomButton :class="{ disabled: isTodayDisabled }" @click="goToToday">
        Today (or nearest)
      </CustomButton>
      <CustomButton :class="{ disabled: isNextDisabled }" @click="nextPhoto">
        Next
      </CustomButton>
    </div>

    <!-- Photo Display -->
    <div class="photo-display">
      <PhotoTile :photo="currentPhoto" />
    </div>
  </div>
</template>
