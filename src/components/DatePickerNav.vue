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

    <!-- Levels 2-5: Shared Selection Container -->
    <div v-if="['year-range', 'year', 'month', 'day'].includes(currentLevel)" class="selection-container">
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
        <!-- Level 5: Day Selection -->
        <template v-if="currentLevel === 'day'">
          <div class="day-options">
            <button 
              v-for="day in availableDays" 
              :key="day" 
              @click="selectDay(day)"
            >
              {{ day }}
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Level 6: Confirm (Integrated Confirm Step) -->
    <div v-if="currentLevel === 'confirm'" class="confirm-selection">
      <div class="selection-header">
        <h3>Jump to Date:  {{ formatMonth(selectedMonth) }} {{ selectedDay }}, {{ selectedYear }}</h3>
        <button class="back-btn" @click="handleBack">Back</button>
      </div>
      <button class="confirm-btn" @click="confirmSelection">Confirm?</button>
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
const currentLevel = ref('start'); // Levels: 'start', 'year-range', 'year', 'month', 'day', 'confirm'
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

/* Compute available years */
const availableYears = computed(() => {
  if (!props.events || props.events.length === 0) return [];
  const years = props.events.map(e => e.eventDate.getUTCFullYear());
  return [...new Set(years)].sort((a, b) => a - b);
});

/* Compute available months */
const availableMonths = computed(() => {
  if (!selectedYear.value) return [];
  return [...new Set(
    props.events.filter(e => e.eventDate.getUTCFullYear() === selectedYear.value)
      .map(e => e.eventDate.getUTCMonth() + 1)
  )].sort((a, b) => a - b);
});

/* Compute available days */
const availableDays = computed(() => {
  if (!selectedYear.value || !selectedMonth.value) return [];
  return [...new Set(
    props.events.filter(e =>
      e.eventDate.getUTCFullYear() === selectedYear.value &&
      e.eventDate.getUTCMonth() + 1 === selectedMonth.value
    ).map(e => e.eventDate.getUTCDate())
  )].sort((a, b) => a - b);
});

/* Compute Year Ranges */
const yearRanges = computed(() => {
  if (!availableYears.value.length) return [];
  if (availableYears.value.length <= 5) {
    return [{ label: availableYears.value.join(", "), years: availableYears.value }];
  }
  const ranges = [];
  const chunkSize = 5;
  for (let i = 0; i < availableYears.value.length; i += chunkSize) {
    const slice = availableYears.value.slice(i, i + chunkSize);
    ranges.push({
      label: `${slice[0]} - ${slice[slice.length - 1]}`,
      years: slice
    });
  }
  return ranges;
});

/* Compute Level Title */
const levelTitle = computed(() => {
  switch (currentLevel.value) {
    case 'year-range': return "Select a Year Range";
    case 'year': return "Select a Year";
    case 'month': return "Select a Month";
    case 'day': return "Select a Day";
    case 'confirm': return "Jump to Date";
    default: return "";
  }
});

/* Disabled states for Level 1 buttons */
const isOldestDisabled = computed(() =>
  props.events && props.events.length > 0 && props.currentIndex === props.events.length - 1
);
const isMostRecentDisabled = computed(() =>
  props.events && props.events.length > 0 && props.currentIndex === 0
);

/* LEVEL 1 Handlers */
const selectOldest = () => {
  console.log("Oldest clicked. Selecting oldest event.");
  if (!props.events.length) return;
  emit('select', props.events[props.events.length - 1]);
  resetSelection();
};

const selectMostRecent = () => {
  console.log("Newest clicked. Selecting most recent event.");
  if (!props.events.length) return;
  emit('select', props.events[0]);
  resetSelection();
};

const startSelection = () => {
  console.log("Select a Date clicked. Transitioning to 'year-range'.");
  currentLevel.value = 'year-range';
};

/* LEVEL 2: Year Range Selection */
const selectYearRange = (range) => {
  console.log("Year Range Selected:", range.label);
  selectedYearRange.value = range.years;
  currentLevel.value = 'year';
};

/* LEVEL 3: Specific Year Selection */
const selectYear = (year) => {
  console.log("Year Selected:", year);
  selectedYear.value = year;
  currentLevel.value = 'month';
};

/* LEVEL 4: Month Selection */
const selectMonth = (month) => {
  console.log("Month Selected:", month);
  selectedMonth.value = month;
  currentLevel.value = 'day';
};

/* LEVEL 5: Day Selection */
const selectDay = (day) => {
  console.log("Day Selected:", day);
  selectedDay.value = day;
  currentLevel.value = 'confirm';
};

/* LEVEL 6: Confirm Selection */
const confirmSelection = () => {
  console.log("Confirm Selection:", selectedYear.value, selectedMonth.value, selectedDay.value);
  const event = props.events.find(e =>
    e.eventDate.getUTCFullYear() === selectedYear.value &&
    e.eventDate.getUTCMonth() + 1 === selectedMonth.value &&
    e.eventDate.getUTCDate() === selectedDay.value
  );
  if (event) {
    emit('select', event);
  }
  resetSelection();
};

/* Handle Back Navigation */
const handleBack = () => {
  console.log("Back button clicked. Current level:", currentLevel.value);
  switch (currentLevel.value) {
    case 'year-range':
      resetSelection();
      break;
    case 'year':
      selectedYear.value = null;
      currentLevel.value = 'year-range';
      break;
    case 'month':
      selectedMonth.value = null;
      currentLevel.value = 'year';
      break;
    case 'day':
      selectedDay.value = null;
      currentLevel.value = 'month';
      break;
    case 'confirm':
      currentLevel.value = 'day';
      break;
    default:
      resetSelection();
  }
};

/* Reset All Selections */
const resetSelection = () => {
  selectedYear.value = null;
  selectedYearRange.value = [];
  selectedMonth.value = null;
  selectedDay.value = null;
  currentLevel.value = 'start';
};

/* Format Month Number to Name */
const formatMonth = (num) => new Date(0, num - 1).toLocaleString('default', { month: 'long' });
</script>
