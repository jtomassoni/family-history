<template>
  <div class="datepicker-nav" :class="{ selectingDate: currentLevel !== 'start' }">
    <!-- Level 1: Oldest, Select a Date, Newest -->
    <div v-if="currentLevel === 'start'" class="default-buttons">
      <button class="oldest-btn" @click="selectOldest" :disabled="isOldestDisabled">
        <span class="desktop-label">Oldest</span>
        <span class="mobile-label">Oldest</span>
      </button>

      <button class="select-date-btn" @click="startSelection">
        <span class="desktop-label">Select a Date</span>
        <span class="mobile-label">🗓️</span>
      </button>

      <button class="newest-btn" @click="selectMostRecent" :disabled="isMostRecentDisabled">
        <span class="desktop-label">Newest</span>
        <span class="mobile-label">Newest</span>
      </button>
    </div>

    <!-- Level 2: Year Selection -->
    <div v-if="currentLevel === 'year'" class="year-selection">
      <h3>Select a Year</h3>
      <div class="year-options">
        <button v-for="year in availableYears" :key="year" @click="selectYear(year)">
          {{ year }}
        </button>
      </div>
      <div class="back-button">
        <button @click="resetSelection">Back</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import "../styles/DatePickerNav.css";

const emit = defineEmits(['select']);

/* Local State */
const selectedYear = ref(null);
const currentLevel = ref('start');

/* Props */
const props = defineProps({
  events: {
    type: Array,
    default: () => []
  },
  currentIndex: {
    type: Number,
    default: 0
  }
});

/* Compute available years */
const availableYears = computed(() => {
  const years = props.events.map(e => e.eventDate.getUTCFullYear());
  return [...new Set(years)].sort((a, b) => a - b);
});

/* Disable Oldest/Newest */
const isOldestDisabled = computed(() => props.currentIndex === props.events.length - 1);
const isMostRecentDisabled = computed(() => props.currentIndex === 0);

/* Select Oldest/Newest */
function selectOldest() {
  if (isOldestDisabled.value || !props.events.length) return;
  emit('select', props.events[props.events.length - 1]);
}
function selectMostRecent() {
  if (isMostRecentDisabled.value || !props.events.length) return;
  emit('select', props.events[0]);
}

/* Date Selection */
function startSelection() {
  setTimeout(() => {
    currentLevel.value = 'year';
  }, 300); // Delayed switch to allow fade-out animation
}

function selectYear(year) {
  selectedYear.value = year;
  currentLevel.value = 'month';
}

/* Reset */
function resetSelection() {
  selectedYear.value = null;
  currentLevel.value = 'start';
}
</script>
