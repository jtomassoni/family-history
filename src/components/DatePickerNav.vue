<template>
  <div class="datepicker-nav">
    <!-- Top Controls: Oldest, Most Recent, and Select a Year -->
    <div v-if="currentLevel === 'start'" class="top-controls">
      <div class="label">Date Navigation:</div>
      <CustomButton @click="selectOldest" :disabled="!hasEvents || isOldest">
        Oldest
      </CustomButton>
      <CustomButton @click="selectMostRecent" :disabled="!hasEvents || isMostRecent">
        Most Recent
      </CustomButton>
      <CustomButton @click="startSelection">
        Select a Year
      </CustomButton>
    </div>

    <!-- Persistent Breadcrumb Display -->
    <div v-if="currentLevel !== 'start'" class="breadcrumb-display">
      <span v-if="selectedYear">Year: {{ selectedYear }}</span>
      <span v-if="selectedMonth"> | Month: {{ monthName(selectedMonth) }}</span>
      <span v-if="selectedDay"> | Day: {{ selectedDay }}</span>
    </div>

    <!-- Year Selection -->
    <div v-if="currentLevel === 'year'" class="level-container">
      <h3>Select a Year</h3>
      <div class="options">
        <CustomButton
          v-for="year in availableYears"
          :key="year"
          @click="selectYear(year)"
        >
          {{ year }}
        </CustomButton>
      </div>
      <CustomButton class="back" @click="resetSelection">
        Cancel
      </CustomButton>
    </div>
    
    <!-- Month Selection -->
    <div v-else-if="currentLevel === 'month'" class="level-container">
      <h3>Select a Month</h3>
      <div class="options">
        <CustomButton
          v-for="month in availableMonths"
          :key="month"
          @click="selectMonth(month)"
        >
          {{ monthName(month) }}
        </CustomButton>
      </div>
      <CustomButton class="back" @click="resetToStart">
        Back
      </CustomButton>
    </div>
    
    <!-- Day Selection -->
    <div v-else-if="currentLevel === 'day'" class="level-container">
      <h3>Select a Day</h3>
      <div class="options">
        <CustomButton
          v-for="day in availableDays"
          :key="day"
          @click="selectDay(day)"
          :class="{ active: day === selectedDay }"
        >
          {{ day }}
        </CustomButton>
      </div>
      <CustomButton class="back" @click="resetToYear">
        Back
      </CustomButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CustomButton from './CustomButton.vue';
import "../styles/DatePickerNav.css";

// Props: parent's events array and currentIndex.
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
const emit = defineEmits(['select']);

// Drill-down state: "start" (default), "year", "month", "day".
const currentLevel = ref('start');
const selectedYear = ref(null);
const selectedMonth = ref(null);
const selectedDay = ref(null);

// Check if events exist.
const hasEvents = computed(() => props.events.length > 0);

// Use UTC methods for correct date display.
const availableYears = computed(() => {
  const years = props.events.map(e => e.eventDate.getUTCFullYear());
  return [...new Set(years)].sort((a, b) => a - b);
});

const availableMonths = computed(() => {
  if (!selectedYear.value) return [];
  const filtered = props.events.filter(e => e.eventDate.getUTCFullYear() === selectedYear.value);
  const months = filtered.map(e => e.eventDate.getUTCMonth() + 1);
  return [...new Set(months)].sort((a, b) => a - b);
});

const availableDays = computed(() => {
  if (!selectedYear.value || !selectedMonth.value) return [];
  const filtered = props.events.filter(e =>
    e.eventDate.getUTCFullYear() === selectedYear.value &&
    (e.eventDate.getUTCMonth() + 1) === selectedMonth.value
  );
  const days = filtered.map(e => e.eventDate.getUTCDate());
  return [...new Set(days)].sort((a, b) => a - b);
});

// Computed properties for disabling top control buttons.
const isMostRecent = computed(() => props.currentIndex === 0);
const isOldest = computed(() => props.currentIndex === props.events.length - 1);

// Top Controls methods.
const selectMostRecent = () => {
  if (!hasEvents.value) return;
  console.log("selectMostRecent clicked");
  console.log("Selecting event at index 0:", props.events[0]);
  emit('select', props.events[0]);
  resetSelection();
};

const selectOldest = () => {
  if (!hasEvents.value) return;
  console.log("selectOldest clicked");
  console.log("Selecting event at last index:", props.events[props.events.length - 1]);
  emit('select', props.events[props.events.length - 1]);
  resetSelection();
};

const startSelection = () => {
  currentLevel.value = 'year';
};

// Drill-down selection methods.
const selectYear = (year) => {
  selectedYear.value = year;
  currentLevel.value = 'month';
};

const selectMonth = (month) => {
  selectedMonth.value = month;
  currentLevel.value = 'day';
};

const selectDay = (day) => {
  selectedDay.value = day;
  const event = props.events.find(e =>
    e.eventDate.getUTCFullYear() === selectedYear.value &&
    (e.eventDate.getUTCMonth() + 1) === selectedMonth.value &&
    e.eventDate.getUTCDate() === day
  );
  if (event) {
    emit('select', event);
  } else {
    console.log("No matching event found for:", selectedYear.value, selectedMonth.value, day);
  }
  resetSelection();
};

// Reset functions.
const resetToStart = () => {
  currentLevel.value = 'start';
  selectedYear.value = null;
  selectedMonth.value = null;
  selectedDay.value = null;
};

const resetToYear = () => {
  currentLevel.value = 'year';
  selectedMonth.value = null;
  selectedDay.value = null;
};

const resetSelection = () => {
  currentLevel.value = 'start';
  selectedYear.value = null;
  selectedMonth.value = null;
  selectedDay.value = null;
};

// Helper: Return full month name using UTC.
const monthName = (monthNumber) => {
  const date = new Date();
  date.setUTCMonth(monthNumber - 1);
  return date.toLocaleString('default', { month: 'long' });
};
</script>

<style scoped src="../styles/DatePickerNav.css"></style>
