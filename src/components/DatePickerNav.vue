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

    <!-- Levels 2-5: Year Range, Year, Month, Day Selection -->
    <div v-if="['year-range', 'year', 'month', 'day'].includes(currentLevel)" class="selection-container">
      <div class="selection-header">
        <!-- If we are on the Day level but haven't chosen a day yet, show "Select a Day".
             Otherwise, use the computed levelTitle. -->
        <h3 v-if="!(currentLevel === 'day' && selectedDay)" >
          {{ levelTitle }}
        </h3>

        <!-- On the Day level, if we have a selectedDay, show "Selected Date: …" in the header -->
        <h3 v-else>
          Selected Date: {{ selectedYear }} - {{ formatMonth(selectedMonth) }} - {{ selectedDay }}
        </h3>

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
          <!-- If no day selected, show the day options -->
          <div
            v-if="!selectedDay"
            class="day-options"
          >
            <button
              v-for="day in availableDays"
              :key="day"
              @click="selectDay(day)"
            >
              {{ day }}
            </button>
          </div>

          <!-- If a day is selected, show a row for the confirm button under the header -->
          <div
            v-else
            class="confirm-row"
          >
            <button
              class="confirm-btn"
              @click="confirmSelection"
            >
              Confirm
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

/* Compute whether Oldest/Newest are disabled */
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

/* Compute year ranges */
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

/* Compute the level title */
const levelTitle = computed(() => {
  switch (currentLevel.value) {
    case 'year-range': return "Select a Year Range";
    case 'year': return "Select a Year";
    case 'month': return "Select a Month";
    case 'day': return "Select a Day";
    default: return "";
  }
});

/* 1) Oldest / Newest / Select a Date */
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

/* 2) Year Range */
const selectYearRange = (range) => {
  selectedYearRange.value = range.years;
  currentLevel.value = 'year';
};

/* 3) Specific Year */
const selectYear = (year) => {
  selectedYear.value = year;
  currentLevel.value = 'month';
};

/* 4) Month */
const selectMonth = (month) => {
  selectedMonth.value = month;
  currentLevel.value = 'day';
};

/* 5) Day (Inline Confirm) */
const selectDay = (day) => {
  selectedDay.value = day;
};

/* Confirm selection & emit event */
const confirmSelection = () => {
  const selectedEvent = props.events.find(e =>
    e.eventDate.getUTCFullYear() === selectedYear.value &&
    e.eventDate.getUTCMonth() + 1 === selectedMonth.value &&
    e.eventDate.getUTCDate() === selectedDay.value
  );
  if (selectedEvent) {
    emit('select', selectedEvent);
  }
  resetSelection();
};

/* Back logic */
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
    if (!selectedDay.value) {
      // If day not selected, go back to month
      currentLevel.value = 'month';
    } else {
      // If day is selected (confirm state), reset the day
      selectedDay.value = null;
    }
  }
};

/* Reset everything */
const resetSelection = () => {
  selectedYear.value = null;
  selectedYearRange.value = [];
  selectedMonth.value = null;
  selectedDay.value = null;
  currentLevel.value = 'start';
};

/* Utility: format month number -> name */
const formatMonth = (num) => {
  return new Date(0, num - 1).toLocaleString('default', { month: 'long' });
};
</script>
