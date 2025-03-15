<template>
  <div class="datepicker-nav" :class="{ selectingDate: currentLevel !== 'start' }">
    <!-- LEVEL 1: Default Navigation (Oldest, Select a Date, Newest) -->
    <div v-if="currentLevel === 'start'" class="default-navigation">
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

    <!-- LEVEL 2: Select a Year Range -->
    <div v-if="currentLevel === 'year-range'" class="selection-container">
      <div class="selection-header">
        <h3>Select a Year Range</h3>
        <button class="back-btn" @click="handleBack">Back</button>
      </div>
      <div class="year-range-options">
        <button
          v-for="range in yearRanges"
          :key="range.label"
          @click="selectYearRange(range)"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <!-- LEVEL 3: Select a Year (tiny, single-row) -->
    <div v-if="currentLevel === 'year'" class="selection-container">
      <div class="selection-header">
        <h3>Select a Year</h3>
        <button class="back-btn" @click="handleBack">Back</button>
      </div>
      <div class="year-options">
        <button
          v-for="year in selectedYearRange"
          :key="year"
          @click="selectYear(year)"
        >
          {{ year }}
        </button>
      </div>
    </div>

    <!-- LEVEL 4: Select a Month -->
    <div v-if="currentLevel === 'month'" class="selection-container">
      <div class="selection-header">
        <h3>Select a Month</h3>
        <button class="back-btn" @click="handleBack">Back</button>
      </div>
      <div class="month-options">
        <button
          v-for="month in availableMonths"
          :key="month"
          @click="selectMonth(month)"
        >
          {{ formatMonth(month) }}
        </button>
      </div>
    </div>

    <!-- LEVEL 5: Select a Day -->
    <div v-if="currentLevel === 'day'" class="selection-container">
      <div class="selection-header">
        <h3>Select a Day</h3>
        <button class="back-btn" @click="handleBack">Back</button>
      </div>
      <div class="day-options">
        <button
          v-for="day in availableDays"
          :key="day"
          @click="selectDay(day)"
        >
          {{ day }}
        </button>
      </div>
    </div>

    <!-- LEVEL 6: Confirm Selection -->
    <div v-if="currentLevel === 'confirm'" class="confirm-selection">
      <div class="selection-header">
        <h3>Confirm Selection</h3>
        <button class="back-btn" @click="handleBack">Back</button>
      </div>
      <p>{{ selectedYear }} - {{ formatMonth(selectedMonth) }} - {{ selectedDay }}</p>
      <button class="confirm-btn" @click="confirmSelection">Confirm</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import "../styles/DatePickerNav.css";

const emit = defineEmits(['select']);

/* Local State */
const selectedYear = ref(null);
const selectedMonth = ref(null);
const selectedDay = ref(null);
const currentLevel = ref('start');
const selectedYearRange = ref([]);

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

/* Compute Oldest/Newest Disabled States */
const isOldestDisabled = computed(() => props.currentIndex === props.events.length - 1);
const isMostRecentDisabled = computed(() => props.currentIndex === 0);

/* Compute available years */
const availableYears = computed(() => {
  if (!props.events?.length) return [];
  const years = props.events.map(e => e.eventDate.getUTCFullYear());
  return [...new Set(years)].sort((a, b) => a - b);
});

/* Compute available months */
const availableMonths = computed(() => {
  if (!selectedYear.value) return [];
  return [...new Set(
    props.events
      .filter(e => e.eventDate.getUTCFullYear() === selectedYear.value)
      .map(e => e.eventDate.getUTCMonth() + 1)
  )].sort((a, b) => a - b);
});

/* Compute available days */
const availableDays = computed(() => {
  if (!selectedYear.value || !selectedMonth.value) return [];
  return [...new Set(
    props.events
      .filter(e =>
        e.eventDate.getUTCFullYear() === selectedYear.value &&
        e.eventDate.getUTCMonth() + 1 === selectedMonth.value
      )
      .map(e => e.eventDate.getUTCDate())
  )].sort((a, b) => a - b);
});

/* Compute Year Ranges */
const yearRanges = computed(() => {
  if (!availableYears.value.length) return [];
  if (availableYears.value.length <= 5) {
    return [{ label: availableYears.value.join(", "), years: availableYears.value }];
  }
  const groupedRanges = [];
  const chunkSize = 5;
  for (let i = 0; i < availableYears.value.length; i += chunkSize) {
    const rangeYears = availableYears.value.slice(i, i + chunkSize);
    groupedRanges.push({
      label: `${rangeYears[0]} - ${rangeYears[rangeYears.length - 1]}`,
      years: rangeYears
    });
  }
  return groupedRanges;
});

/* Format Month */
const formatMonth = (num) => new Date(0, num - 1).toLocaleString('default', { month: 'long' });

/* Level 1: Oldest/Newest/Select a Date */
const selectOldest = () => {
  if (!props.events.length) return;
  emit('select', props.events[props.events.length - 1]);
  resetAll();
};

const selectMostRecent = () => {
  if (!props.events.length) return;
  emit('select', props.events[0]);
  resetAll();
};

const startSelection = () => {
  currentLevel.value = 'year-range';
};

/* Level 2: Year Range */
const selectYearRange = (range) => {
  selectedYearRange.value = range.years;
  currentLevel.value = 'year';
};

/* Level 3: Year */
const selectYear = (year) => {
  selectedYear.value = year;
  currentLevel.value = 'month';
};

/* Level 4: Month */
const selectMonth = (month) => {
  selectedMonth.value = month;
  currentLevel.value = 'day';
};

/* Level 5: Day */
const selectDay = (day) => {
  selectedDay.value = day;
  currentLevel.value = 'confirm';
};

/* Level 6: Confirm */
const confirmSelection = () => {
  const selectedEvent = props.events.find(e =>
    e.eventDate.getUTCFullYear() === selectedYear.value &&
    e.eventDate.getUTCMonth() + 1 === selectedMonth.value &&
    e.eventDate.getUTCDate() === selectedDay.value
  );
  if (selectedEvent) {
    emit('select', selectedEvent);
    resetAll();
  }
};

/* Back Button (All Levels) */
const handleBack = () => {
  if (currentLevel.value === 'confirm') {
    currentLevel.value = 'day';
  } else if (currentLevel.value === 'day') {
    currentLevel.value = 'month';
  } else if (currentLevel.value === 'month') {
    currentLevel.value = 'year';
  } else if (currentLevel.value === 'year') {
    currentLevel.value = 'year-range';
  } else {
    resetAll();
  }
};

/* Reset Entire Flow */
const resetAll = () => {
  selectedYear.value = null;
  selectedMonth.value = null;
  selectedDay.value = null;
  selectedYearRange.value = [];
  currentLevel.value = 'start';
};
</script>
