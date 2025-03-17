<template>
  <div id="app">
    <Header title="Tomassoni Family History" @help="toggleHintModal" />

    <div class="app-content">
      <!-- Boundary Hint Modal for Earliest/Latest events (dark theme, 3000ms timeout) -->
      <HintModal 
        v-if="isBoundaryHintVisible"
        :desktopHint="boundaryDesktopHint"
        :mobileHint="boundaryMobileHint"
        :timeoutDuration="4000"
        @dismiss="dismissBoundaryHint"
      />

      <!-- 4) Breadcrumb Buttons -->
      <div class="breadcrumb-today-container">
        <DatePickerNav
          :events="sortedPhotos"
          :currentIndex="currentIndex"
          @select="handleSelectEvent"
        />
      </div>

      <!-- 5) Photo Navigation & Tile with swipe support -->
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

      <!-- Normal Hint Modal (e.g., help) -->
      <HintModal 
        v-if="showHintModal"
        :desktopHint="helpDesktopHint"
        :mobileHint="helpMobileHint"
        @dismiss="dismissHintModal"
      />

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

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import "./styles/main.css";
import { photoData } from "./data/photoData.js";

import Header from "./components/Header.vue";
import DatePickerNav from "./components/DatePickerNav.vue";
import BigNavArrow from "./components/BigNavArrow.vue";
import PhotoTile from "./components/PhotoTile.vue";
import Footer from "./components/Footer.vue";
import HintModal from "./components/HintModal.vue";

/** Prepare and sort photos */
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

/** Track current photo */
const currentIndex = ref(0);
const currentPhoto = computed(() => sortedPhotos.value[currentIndex.value] || null);

/** Navigation States */
const isAtBeginning = computed(() => currentIndex.value === sortedPhotos.value.length - 1);
const isAtEnd = computed(() => currentIndex.value === 0);
const isLeftArrowDisabled = computed(() => isAtBeginning.value);
const isRightArrowDisabled = computed(() => isAtEnd.value);

/** Boundary flags */
const showEarliest = ref(false);
const showLatest = ref(false);

/** Dedicated reactive flag for boundary hint modal */
const isBoundaryHintVisible = ref(false);

/** Watch currentIndex with immediate option */
watch(
  currentIndex,
  () => {
    showEarliest.value = (currentIndex.value === sortedPhotos.value.length - 1);
    showLatest.value = (currentIndex.value === 0);
    // Show boundary hint if either boundary is reached.
    if (showEarliest.value || showLatest.value) {
      isBoundaryHintVisible.value = true;
    } else {
      isBoundaryHintVisible.value = false;
    }
  },
  { immediate: true }
);

/** Custom boundary hint messages */
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

/** Normal help hint messages */
const helpDesktopHint = "Need help?<br>Use your ⬅️/➡️ arrow keys to navigate, or press space for the date selector.";
const helpMobileHint = "Need help?<br>Swipe left/right to navigate, or tap the calendar icon for dates.";

/** Other Modal Flags */
const showHintModal = ref(false);
const showDateSelect = ref(false);

/** Navigation Functions */
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

/** Date Selection Handler */
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

/** Boundary Handler */
const handleBoundary = (direction) => {
  console.log(`Boundary event received for direction: ${direction}`);
  if (direction === 'left') {
    showEarliest.value = true;
  } else if (direction === 'right') {
    showLatest.value = true;
  }
};

/** Help / HintModal handling */
const toggleHintModal = () => {
  showHintModal.value = !showHintModal.value;
};
const dismissHintModal = () => {
  showHintModal.value = false;
};

/** Dismiss Boundary Hint Modal */
const dismissBoundaryHint = () => {
  isBoundaryHintVisible.value = false;
};

/** Dismiss Date Selection Modal */
const dismissDateSelect = () => {
  showDateSelect.value = false;
};

/** Keyboard Navigation and handling */
const handleKeyDown = (event) => {
  // If boundary hint is visible, dismiss it on any key press.
  if (isBoundaryHintVisible.value) {
    console.log("[App] Dismissing boundary hint due to keyboard input.");
    dismissBoundaryHint();
    return; // Prevent further handling so the modal dismisses immediately.
  }
  if (window.innerWidth >= 769) { // Desktop hotkeys.
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
    } else if (event.key === " " && event.shiftKey) {
      const selectDateBtn = document.querySelector(".select-date-btn");
      if (selectDateBtn) {
        selectDateBtn.click();
      }
    } else if (event.key.toLowerCase() === "d" && event.shiftKey) {
      const photoContainer = document.querySelector(".photo-image-container");
      if (photoContainer) {
        photoContainer.click();
      }
    }
  }
};

onMounted(() => {
  currentIndex.value = 0; // Start at the most recent event.
  showLatest.value = true;  // Show boundary message for the newest event on load.
  window.addEventListener("keydown", handleKeyDown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

