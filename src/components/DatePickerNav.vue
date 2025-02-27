<template>
  <div class="datepicker-nav">
    <!-- Default View: Oldest, Most Recent, Select a Date -->
    <div v-if="currentLevel === 'start'" class="default-buttons">
      <button @click="selectOldest" :disabled="isOldestDisabled">Oldest</button>
      <button @click="startSelection">Select a Date</button>
      <button @click="selectMostRecent" :disabled="isMostRecentDisabled">Newest</button>
    </div>

    <!-- Selected Path (Hide Year and Month if on Confirm Screen) -->
    <div class="selected-path" v-if="selectedYear && !confirmingSelection">
      <span v-if="selectedYear && currentLevel !== 'year'">Year: {{ selectedYear }}</span>
      <span v-if="selectedMonth && currentLevel !== 'month'"> | Month: {{ monthName(selectedMonth) }}</span>
    </div>

    <!-- Year Selection -->
    <div v-if="currentLevel === 'year'" class="year-selection">
      <h3>Select a Year</h3>
      <div class="year-options">
        <button 
          v-for="year in availableYears" 
          :key="year" 
          @click="selectYear(year)"
        >
          {{ year }}
        </button>
      </div>
      <div class="back-button">
        <button @click="resetSelection">Back</button>
      </div>
    </div>

    <!-- Month Selection -->
    <div v-if="currentLevel === 'month'" class="month-selection">
      <h3>Select a Month</h3>
      <div class="month-options">
        <button 
          v-for="month in availableMonths" 
          :key="month" 
          @click="selectMonth(month)"
        >
          {{ monthName(month) }}
        </button>
      </div>
      <div class="back-button">
        <button @click="resetToYear">Back</button>
      </div>
    </div>

    <!-- Day Selection & Confirm Transition -->
    <div v-if="currentLevel === 'day'" class="day-selection">
      <h3>Select a Day</h3>
      <div class="day-options">
        <button 
          v-for="day in availableDays" 
          :key="day"
          @click="selectedDay === day ? confirmSelection() : selectDay(day)"
          :class="{ active: selectedDay === day, confirm: selectedDay === day }"
        >
          {{ selectedDay === day ? `Confirm Selection? ${monthName(selectedMonth)} ${day}, ${selectedYear}` : day }}
        </button>
      </div>
      <div class="back-button">
        <button @click="resetToMonth">Back</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import "../styles/DatePickerNav.css";

const emit = defineEmits(['select']);

const selectedYear = ref(null);
const selectedMonth = ref(null);
const selectedDay = ref(null);
const currentLevel = ref('start');

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

/** Computes available years based on events */
const availableYears = computed(() => [...new Set(props.events.map(e => e.eventDate.getUTCFullYear()))].sort((a, b) => a - b));

/** Computes available months based on the selected year */
const availableMonths = computed(() => {
  if (!selectedYear.value) return [];
  return [...new Set(props.events.filter(e => e.eventDate.getUTCFullYear() === selectedYear.value).map(e => e.eventDate.getUTCMonth() + 1))].sort((a, b) => a - b);
});

/** Computes available days based on the selected year and month */
const availableDays = computed(() => {
  if (!selectedYear.value || !selectedMonth.value) return [];
  return [...new Set(props.events.filter(e => 
    e.eventDate.getUTCFullYear() === selectedYear.value && 
    e.eventDate.getUTCMonth() + 1 === selectedMonth.value
  ).map(e => e.eventDate.getUTCDate()))].sort((a, b) => a - b);
});

/** Computes whether the "Oldest" button should be disabled */
const isOldestDisabled = computed(() => props.currentIndex === props.events.length - 1);

/** Computes whether the "Most Recent" button should be disabled */
const isMostRecentDisabled = computed(() => props.currentIndex === 0);

/** Selects the oldest event */
const selectOldest = () => {
  if (isOldestDisabled.value || !props.events.length) return;
  emit('select', props.events[props.events.length - 1]);
};

/** Selects the most recent event */
const selectMostRecent = () => {
  if (isMostRecentDisabled.value || !props.events.length) return;
  emit('select', props.events[0]);
};

/** Starts the date selection flow */
const startSelection = () => {
  currentLevel.value = 'year';
};

/** Handles selecting a year */
const selectYear = (year) => {
  selectedYear.value = year;
  selectedMonth.value = null; // Reset Month
  selectedDay.value = null; // Reset Day
  currentLevel.value = 'month';
};

/** Handles selecting a month */
const selectMonth = (month) => {
  selectedMonth.value = month;
  selectedDay.value = null; // Reset Day
  currentLevel.value = 'day';
};

/** Handles selecting a day */
const selectDay = (day) => {
  selectedDay.value = day;
};

/** Emits the final confirmed date */
const confirmSelection = () => {
  if (!selectedYear.value || !selectedMonth.value || !selectedDay.value) return;

  const event = props.events.find(e => 
    e.eventDate.getUTCFullYear() === selectedYear.value &&
    e.eventDate.getUTCMonth() + 1 === selectedMonth.value &&
    e.eventDate.getUTCDate() === selectedDay.value
  );

  if (event) {
    emit('select', event);
    resetSelection();
  }
};

/** Resets the selection process */
const resetSelection = () => {
  selectedYear.value = null;
  selectedMonth.value = null;
  selectedDay.value = null;
  currentLevel.value = 'start';
};

/** Resets to Year Selection */
const resetToYear = () => {
  selectedMonth.value = null;
  selectedDay.value = null;
  currentLevel.value = 'year';
};

/** Resets to Month Selection */
const resetToMonth = () => {
  selectedDay.value = null;
  currentLevel.value = 'month';
};

/** Converts month number to full month name */
const monthName = (monthNumber) => new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' });
</script>
