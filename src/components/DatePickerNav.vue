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

    <!-- Level 2: Year Range Selection -->
    <div v-if="currentLevel === 'year'" class="year-selection">
      <div class="year-header">
        <h3>Select a Range</h3>
        <button class="back-button" @click="resetSelection">Back</button>
      </div>
      <div class="year-options">
        <template v-if="yearRanges.length > 1">
          <button v-for="range in yearRanges" :key="range.label" @click="selectYearRange(range)">
            {{ range.label }}
          </button>
        </template>
        <template v-else>
          <button v-for="year in availableYears" :key="year" @click="selectYear(year)">
            {{ year }}
          </button>
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
const currentLevel = ref('start');
const selectedYearRange = ref(null);

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
  if (!availableYears.value || availableYears.value.length === 0) return [];

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

/* Compute Disabled States */
const isOldestDisabled = computed(() => props.currentIndex === props.events.length - 1);
const isMostRecentDisabled = computed(() => props.currentIndex === 0);

/* Click Handlers */
function startSelection() {
  console.log("Select a Date clicked. Transitioning to 'year'.");
  setTimeout(() => {
    currentLevel.value = 'year';
    console.log("currentLevel is now:", currentLevel.value);
  }, 300);
}

function selectOldest() {
  console.log("Oldest clicked. Selecting oldest event.");
  if (isOldestDisabled.value || !props.events.length) return;
  emit('select', props.events[props.events.length - 1]);
}

function selectMostRecent() {
  console.log("Newest clicked. Selecting most recent event.");
  if (isMostRecentDisabled.value || !props.events.length) return;
  emit('select', props.events[0]);
}

function selectYear(year) {
  selectedYear.value = year;
  currentLevel.value = 'month';
}

function selectYearRange(range) {
  selectedYearRange.value = range.years;
  currentLevel.value = 'year-drilldown';
}

function resetSelection() {
  selectedYear.value = null;
  selectedYearRange.value = null;
  currentLevel.value = 'start';
}
</script>
