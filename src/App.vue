<template>
  <div id="app">
    <!-- 1) Thick Fixed Header -->
    <Header title="Tomassoni Family History" @help="toggleHintModal" />

    <!-- 2) Main content properly spaced -->
    <div class="app-content">
      <!-- 3) Centered Boundary Messages -->
      <BoundaryMessage 
        v-if="showEarliest" 
        message="📜 You’ve reached the earliest photo! (Tap X to close)" 
        @close="showEarliest = false" 
      />
      <BoundaryMessage 
        v-if="showLatest" 
        message="You’re viewing the most recent event! (Tap X to close)" 
        @close="showLatest = false" 
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

      <!-- 6) Hint Modal -->
      <HintModal v-if="showHintModal" @dismiss="dismissHintModal" />

      <!-- 7) Date Selection Modal (opens on Spacebar) -->
      <transition name="fade">
        <div v-if="showDateSelect" class="date-select-modal" @click="dismissDateSelect">
          <button class="close-btn" @click.stop="dismissDateSelect">✖</button>
          <p class="modal-text">
            <strong>Select a date:</strong><br>
            Use the calendar below or type a date.
            <!-- Replace with your date picker UI -->
          </p>
        </div>
      </transition>
    </div>

    <!-- 8) Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import "./styles/main.css";
import { photoData } from "./data/photoData.js";

import Header from "./components/Header.vue";
import DatePickerNav from "./components/DatePickerNav.vue";
import BoundaryMessage from "./components/BoundaryMessage.vue";
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

/** Boundary Message Flags */
const showEarliest = ref(false);
const showLatest = ref(false);

/** Overlay Flag */
const showDataOverlay = ref(false);

/** HintModal and DateSelect Modal Flags */
const showHintModal = ref(false);
const showDateSelect = ref(false);

/** Watch current index for boundary changes */
watch(currentIndex, () => {
  showEarliest.value = (currentIndex.value === sortedPhotos.value.length - 1);
  showLatest.value = (currentIndex.value === 0);
});

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

/** Boundary Handler: simply reopen the boundary message */
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

/** Dismiss Date Selection Modal */
const dismissDateSelect = () => {
  showDateSelect.value = false;
};

/** Keyboard Navigation and ESC/Space key handling */
const handleKeyDown = (event) => {
 if (window.innerWidth >= 769) { // Desktop hotkeys.
    if (event.key === "ArrowLeft") {
      if (event.shiftKey) {
        // Shift + ArrowLeft: Jump to the oldest event.
        currentIndex.value = sortedPhotos.value.length - 1;
      } else if (!isLeftArrowDisabled.value) {
        previousPhoto();
      }
    } else if (event.key === "ArrowRight") {
      if (event.shiftKey) {
        // Shift + ArrowRight: Jump to the newest event.
        currentIndex.value = 0;
      } else if (!isRightArrowDisabled.value) {
        nextPhoto();
      }
    } else if (event.key === " " && event.shiftKey) {
      // Shift + Space: simulate a click on the "Select a Date" button.
      const selectDateBtn = document.querySelector(".select-date-btn");
      if (selectDateBtn) {
        selectDateBtn.click();
      }
    } else if (event.key.toLowerCase() === "d" && event.shiftKey) {
      // Shift + D: simulate a click on the photo-image-container div.
      const photoContainer = document.querySelector(".photo-image-container");
      if (photoContainer) {
        photoContainer.click();
      }
    }
  }
};

onMounted(() => {
  currentIndex.value = 0; // Start at most recent event
  showLatest.value = true;  // Show boundary message for newest event on load
  window.addEventListener("keydown", handleKeyDown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>
