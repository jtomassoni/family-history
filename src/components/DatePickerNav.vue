<template>
  <div class="datepicker-nav" :class="{ selectingDate: currentLevel !== 'start' }">
    <!-- Level 1: Default Navigation (Oldest / Select a Date / Newest) -->
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

    <!-- Levels 2-5: Year Range, Year, Month, Day (In-place "Confirm") -->
    <div v-if="['year-range','year','month','day'].includes(currentLevel)" class="selection-container">
      <div class="selection-header">
        <h3>{{ levelTitle }}</h3>
        <button class="back-btn" @click="handleBack">Back</button>
      </div>

      <div class="selection-options">
        <!-- Level 2: Year Range -->
        <template v-if="currentLevel === 'year-range'">
          <div class="year-range-options">
            <button
              v-for="range in yearRanges"
              :key="range.label"
              @click="selectYearRange(range)"
            >
              {{ range.label }}
            </button>
          </div>
        </template>

        <!-- Level 3: Specific Year -->
        <template v-if="currentLevel === 'year'">
          <div class="year-options">
            <button
              v-for="year in selectedYearRange"
              :key="year"
              @click="selectYear(year)"
            >
              {{ year }}
            </button>
          </div>
        </template>

        <!-- Level 4: Month Selection -->
        <template v-if="currentLevel === 'month'">
          <div class="month-options">
            <button
              v-for="month in availableMonths"
              :key="month"
              @click="selectMonth(month)"
            >
              {{ formatMonth(month) }}
            </button>
          </div>
        </template>

        <!-- Level 5: Day Selection (in-place confirm) -->
        <template v-if="currentLevel === 'day'">
          <div class="day-options">
            <button
              v-for="day in availableDays"
              :key="day"
              :class="{ 'selected-day': day === selectedDay }"
              @click="handleDayClick(day)"
            >
              <!-- If this day is selected, show "Confirm?" label; otherwise show the day number -->
              {{ day === selectedDay ? 'Confirm?' : day }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import "../styles/DatePickerNav.css";

const emit = defineEmits(['select']);

//
// ------------------ State & Props ------------------
//
const selectedYear       = ref(null);
const selectedMonth      = ref(null);
const selectedDay        = ref(null);
const currentLevel       = ref('start');
const selectedYearRange  = ref([]);

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

//
// ------------------ Computed Flags ------------------
//
const isOldestDisabled    = computed(() => props.currentIndex === props.events.length - 1);
const isMostRecentDisabled= computed(() => props.currentIndex === 0);

//
// ------------------ Data Computations ------------------
//
const availableYears = computed(() => {
  if (!props.events?.length) return [];
  const years = props.events.map(e => e.eventDate.getUTCFullYear());
  return [...new Set(years)].sort((a, b) => a - b);
});

const availableMonths = computed(() => {
  if (!selectedYear.value) return [];
  return [...new Set(
    props.events
      .filter(e => e.eventDate.getUTCFullYear() === selectedYear.value)
      .map(e => e.eventDate.getUTCMonth() + 1)
  )].sort((a, b) => a - b);
});

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

const yearRanges = computed(() => {
  if (!availableYears.value.length) return [];
  // If small enough, just a single range
  if (availableYears.value.length <= 5) {
    return [{ label: availableYears.value.join(", "), years: availableYears.value }];
  }
  // Otherwise group in chunks of 5
  const grouped = [];
  const chunkSize = 5;
  for (let i = 0; i < availableYears.value.length; i += chunkSize) {
    const slice = availableYears.value.slice(i, i + chunkSize);
    grouped.push({
      label: `${slice[0]} - ${slice[slice.length - 1]}`,
      years: slice
    });
  }
  return grouped;
});

const levelTitle = computed(() => {
  switch (currentLevel.value) {
    case 'year-range': return "Select a Year Range";
    case 'year':       return "Select a Year";
    case 'month':      return "Select a Month";
    case 'day':        return "Select a Day";
    default:           return "";
  }
});

//
// ------------------ Methods ------------------
//

/** 1) Oldest / Newest / Start Selection **/
const selectOldest = () => {
  if (!props.events.length) return;
  emit('select', props.events[props.events.length - 1]);
  resetSelection();
};

const selectMostRecent = () => {
  if (!props.events.length) return;
  emit('select', props.events[0]);
  resetSelection();
};

const startSelection = () => {
  currentLevel.value = 'year-range';
};

/** 2) Year Range **/
const selectYearRange = (range) => {
  selectedYearRange.value = range.years;
  currentLevel.value = 'year';
};

/** 3) Specific Year **/
const selectYear = (year) => {
  selectedYear.value = year;
  currentLevel.value = 'month';
};

/** 4) Month **/
const selectMonth = (month) => {
  selectedMonth.value = month;
  currentLevel.value = 'day';
};

/** 5) Day (In-place confirm) **/
/**
 * If user clicks a day:
 *  - If no day selected, pick it (turn label into "Confirm?")
 *  - If day is already selected, finalize & emit the event
 *  - If user picks a different day, switch to that new day
 */
const handleDayClick = (day) => {
  if (!selectedDay.value) {
    // First time picking a day
    selectedDay.value = day;
  } else if (day === selectedDay.value) {
    // User clicked the same day again => confirm
    confirmSelection();
  } else {
    // User changed mind to a different day
    selectedDay.value = day;
  }
};

/** Confirm the selected day => find matching event => emit => reset **/
const confirmSelection = () => {
  const chosenEvent = props.events.find(e =>
    e.eventDate.getUTCFullYear() === selectedYear.value &&
    e.eventDate.getUTCMonth() + 1 === selectedMonth.value &&
    e.eventDate.getUTCDate() === selectedDay.value
  );
  if (chosenEvent) {
    emit('select', chosenEvent);
  }
  resetSelection();
};

/** Handle back logic (unwind levels or selection) **/
const handleBack = () => {
  if (currentLevel.value === 'year-range') {
    resetSelection();
  } else if (currentLevel.value === 'year') {
    selectedYear.value = null;
    currentLevel.value = 'year-range';
  } else if (currentLevel.value === 'month') {
    selectedMonth.value = null;
    currentLevel.value = 'year';
  } else if (currentLevel.value === 'day') {
    // If no day is selected, go back to month
    if (!selectedDay.value) {
      currentLevel.value = 'month';
    } else {
      // If day was selected => unselect it
      selectedDay.value = null;
    }
  }
};

/** Reset everything back to start **/
const resetSelection = () => {
  selectedYear.value      = null;
  selectedYearRange.value = [];
  selectedMonth.value     = null;
  selectedDay.value       = null;
  currentLevel.value      = 'start';
};

/** Utility: format month number -> name **/
const formatMonth = (num) => new Date(0, num - 1).toLocaleString('default', { month: 'long' });
</script>
