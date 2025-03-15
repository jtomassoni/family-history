<template>
  <div class="datepicker-nav" :class="{ selectingDate: currentLevel !== 'start' }">
    <!-- Level 1: Default Navigation (Oldest, Select a Date, Newest) -->
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

    <!-- Level 2-5: Year Range, Year, Month, Day Selection -->
    <div v-if="['year-range', 'year', 'month', 'day'].includes(currentLevel)" class="selection-container">
      <div class="selection-header">
        <h3>{{ levelTitle }}</h3>
        <button class="back-btn" @click="handleBack">Back</button>
      </div>
      <div class="selection-options">
        <template v-if="currentLevel === 'year-range'">
          <button v-for="range in yearRanges" :key="range.label" @click="selectYearRange(range)">
            {{ range.label }}
          </button>
        </template>
        <template v-if="currentLevel === 'year'">
          <button v-for="year in selectedYearRange" :key="year" @click="selectYear(year)">
            {{ year }}
          </button>
        </template>
        <template v-if="currentLevel === 'month'">
          <button v-for="month in availableMonths" :key="month" @click="selectMonth(month)">
            {{ formatMonth(month) }}
          </button>
        </template>
        <template v-if="currentLevel === 'day'">
          <button v-for="day in availableDays" :key="day" @click="selectDay(day)">
            {{ day }}
          </button>
        </template>
      </div>
    </div>

    <!-- Level 6: Confirm Selection -->
    <div v-if="currentLevel === 'confirm'" class="confirm-selection">
      <div class="selection-header">
        <h3>Confirm Selection</h3>
        <button class="back-btn" @click="handleBack">Back</button> <!-- ✅ FIXED! -->
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

/* Compute available years */
const availableYears = computed(() => 
  props.events?.length 
    ? [...new Set(props.events.map(e => e.eventDate.getUTCFullYear()))].sort((a, b) => a - b)
    : []
);

/* Compute available months */
const availableMonths = computed(() => 
  selectedYear.value
    ? [...new Set(props.events.filter(e => e.eventDate.getUTCFullYear() === selectedYear.value)
      .map(e => e.eventDate.getUTCMonth() + 1))].sort((a, b) => a - b)
    : []
);

/* Compute available days */
const availableDays = computed(() => 
  selectedYear.value && selectedMonth.value
    ? [...new Set(props.events.filter(e => 
        e.eventDate.getUTCFullYear() === selectedYear.value &&
        e.eventDate.getUTCMonth() + 1 === selectedMonth.value)
      .map(e => e.eventDate.getUTCDate()))].sort((a, b) => a - b)
    : []
);

/* Compute Year Ranges */
const yearRanges = computed(() => {
  if (!availableYears.value.length) return [];

  if (availableYears.value.length <= 5) {
    return [{ label: availableYears.value.join(", "), years: availableYears.value }];
  }

  return Array.from({ length: Math.ceil(availableYears.value.length / 5) }, (_, i) => {
    const rangeYears = availableYears.value.slice(i * 5, (i + 1) * 5);
    return { label: `${rangeYears[0]} - ${rangeYears[rangeYears.length - 1]}`, years: rangeYears };
  });
});

/* Compute Level Title */
const levelTitle = computed(() => ({
  'year-range': "Select a Year Range",
  'year': "Select a Year",
  'month': "Select a Month",
  'day': "Select a Day",
  'confirm': "Confirm Selection"
}[currentLevel.value] || ""));

/* Select Oldest */
const selectOldest = () => {
  console.log("Oldest clicked. Selecting oldest event.");
  if (!props.events.length) return;
  emit('select', props.events[props.events.length - 1]);
  resetSelection();
};

/* Select Newest */
const selectMostRecent = () => {
  console.log("Newest clicked. Selecting most recent event.");
  if (!props.events.length) return;
  emit('select', props.events[0]);
  resetSelection();
};

/* Select a Date */
const startSelection = () => {
  console.log("Select a Date clicked. Transitioning to 'year-range'.");
  currentLevel.value = 'year-range';
};

/* Select Year Range */
const selectYearRange = (range) => {
  console.log("Year Range Selected:", range.label);
  selectedYearRange.value = range.years;
  currentLevel.value = 'year';
};

/* Select Year */
const selectYear = (year) => {
  console.log("Year Selected:", year);
  selectedYear.value = year;
  currentLevel.value = 'month';
};

/* Select Month */
const selectMonth = (month) => {
  console.log("Month Selected:", month);
  selectedMonth.value = month;
  currentLevel.value = 'day';
};

/* Select Day */
const selectDay = (day) => {
  console.log("Day Selected:", day);
  selectedDay.value = day;
  currentLevel.value = 'confirm'; // ✅ Now correctly transitions to Confirm screen
};

/* Confirm Selection */
const confirmSelection = () => {
  console.log("Confirm Selection:", selectedYear.value, selectedMonth.value, selectedDay.value);

  const selectedEvent = props.events.find(e =>
    e.eventDate.getUTCFullYear() === selectedYear.value &&
    e.eventDate.getUTCMonth() + 1 === selectedMonth.value &&
    e.eventDate.getUTCDate() === selectedDay.value
  );

  if (selectedEvent) {
    emit('select', selectedEvent);
    resetSelection();
  }
};

/* Handle Back Navigation */
const handleBack = () => {
  console.log("Back button clicked. Current level:", currentLevel.value);
  const levelMap = { 
    'year': () => currentLevel.value = 'year-range', 
    'month': () => currentLevel.value = 'year', 
    'day': () => currentLevel.value = 'month',
    'confirm': () => currentLevel.value = 'day', // ✅ Fixes Back button on Confirm screen
    'year-range': resetSelection 
  };
  levelMap[currentLevel.value]?.();
};

/* Reset Selection */
const resetSelection = () => {
  selectedYear.value = null;
  selectedYearRange.value = [];
  selectedMonth.value = null;
  selectedDay.value = null;
  currentLevel.value = 'start';
};

/* Convert Month Number to Name */
const formatMonth = (num) => new Date(0, num - 1).toLocaleString('default', { month: 'long' });
</script>
