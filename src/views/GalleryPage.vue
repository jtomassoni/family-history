<template>
  <div class="gallery-page">
    <!-- Boundary Hint Modal -->
    <HintModal 
      v-if="isBoundaryHintVisible"
      :desktopHint="boundaryDesktopHint"
      :mobileHint="boundaryMobileHint"
      :timeoutDuration="4000"
      @dismiss="dismissBoundaryHint"
    />

    <!-- Breadcrumb Buttons -->
    <div class="breadcrumb-today-container">
      <DatePickerNav
        :events="sortedPhotos"
        :currentIndex="currentIndex"
        @select="handleSelectEvent"
      />
    </div>

    <!-- Photo Navigation & Tile -->
    <div class="photo-navigation-container" 
         v-touch:swipe.left="nextPhoto" 
         v-touch:swipe.right="previousPhoto">
      <BigNavArrow 
        direction="left" 
        @click="previousPhoto" 
        :disabled="isLeftArrowDisabled" 
        label="Previous" 
        @boundary="handleBoundary('left')"
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
        @click="nextPhoto" 
        :disabled="isRightArrowDisabled" 
        label="Next" 
        @boundary="handleBoundary('right')"
      />
    </div>

    <!-- Date Selection Modal -->
    <transition name="fade">
      <div v-if="showDateSelect" class="date-select-modal" @click="dismissDateSelect">
        <button class="close-btn" @click.stop="dismissDateSelect">✖</button>
        <p class="modal-text">
          <strong>Select a date:</strong><br>
          Use the calendar below or type a date.
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { photoData } from '../data/photoData.js';
import DatePickerNav from '../components/DatePickerNav.vue';
import BigNavArrow from '../components/BigNavArrow.vue';
import PhotoTile from '../components/PhotoTile.vue';
import HintModal from '../components/HintModal.vue';
import "./GalleryPage.css";


// Prepare and sort photos.
const sortedPhotos = computed(() => {
  return photoData.slice().map(photo => ({
    ...photo,
    eventDate: new Date(photo.eventDate + "T00:00:00Z"),
    uploadedAt: new Date(photo.uploadedAt)
  })).sort((a, b) => b.eventDate - a.eventDate);
});

// Track current photo.
const currentIndex = ref(0);
const currentPhoto = computed(() => sortedPhotos.value[currentIndex.value] || null);

// Navigation States.
const isAtBeginning = computed(() => currentIndex.value === sortedPhotos.value.length - 1);
const isAtEnd = computed(() => currentIndex.value === 0);
const isLeftArrowDisabled = computed(() => isAtBeginning.value);
const isRightArrowDisabled = computed(() => isAtEnd.value);

// Boundary flags.
const showEarliest = ref(false);
const showLatest = ref(false);
const isBoundaryHintVisible = ref(false);

watch(currentIndex, () => {
  showEarliest.value = (currentIndex.value === sortedPhotos.value.length - 1);
  showLatest.value = (currentIndex.value === 0);
  isBoundaryHintVisible.value = showEarliest.value || showLatest.value;
}, { immediate: true });

const boundaryDesktopHint = computed(() => {
  if (showEarliest.value) return "📜 You've reached the earliest photo!<br>Use your arrow keys to browse or press space to select a date.";
  if (showLatest.value) return "🎉 You're at the most recent photo!<br>Use your arrow keys to browse or press space to select a date.";
  return "";
});
const boundaryMobileHint = computed(() => {
  if (showEarliest.value) return "📜 Earliest photo reached!<br>Swipe to explore or tap the calendar for dates.";
  if (showLatest.value) return "🎉 Most recent photo!<br>Swipe to explore or tap the calendar for dates.";
  return "";
});

// Other modal flags.
const showDateSelect = ref(false);

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

const handleSelectEvent = (selectedEvent) => {
  const index = sortedPhotos.value.findIndex(
    photo => new Date(photo.eventDate).toISOString().split("T")[0] === new Date(selectedEvent.eventDate).toISOString().split("T")[0]
  );
  if (index >= 0) currentIndex.value = index;
};

const handleBoundary = (direction) => {
  console.log(`Boundary event received for direction: ${direction}`);
  if (direction === 'left') {
    showEarliest.value = true;
  } else if (direction === 'right') {
    showLatest.value = true;
  }
};

const dismissBoundaryHint = () => {
  isBoundaryHintVisible.value = false;
};

const dismissDateSelect = () => {
  showDateSelect.value = false;
};

// KEYBOARD GESTURES
const handleKeyDown = (event) => {
  // If boundary hint is visible, dismiss it on any key press.
  if (isBoundaryHintVisible.value) {
    console.log("[GalleryPage] Dismissing boundary hint due to keyboard input.");
    dismissBoundaryHint();
    return;
  }
  if (window.innerWidth >= 769) {
    if (event.key === "ArrowLeft") {
      if (event.shiftKey) {
        currentIndex.value = sortedPhotos.value.length - 1;
      } else if (!isLeftArrowDisabled.value) {
        previousPhoto();
      }
    } else if (event.key === "ArrowRight") {
      if (event.shiftKey) {
        currentIndex.value = 0;
      } else if (!isRightArrowDisabled.value) {
        nextPhoto();
      }
    }
  }
};

onMounted(() => {
  currentIndex.value = 0;
  window.addEventListener("keydown", handleKeyDown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>
