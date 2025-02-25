<script setup>
import "./styles/main.css"; // Import the global styles
import { ref, onMounted } from "vue";
import { photoData } from "./data/photoData.js"; // Import photo data

// Reactive state for selection
const openYear = ref(null);
const openMonth = ref(null);
const selectedDay = ref(null);
const currentPanel = ref(null); // 'year', 'month', or 'day'

// Compute valid years (sorted ascending)
const validYears = Object.keys(photoData).sort((a, b) => a - b);

// Helper: find the event closest to today
const findClosestEvent = () => {
  const today = new Date();
  let bestDiff = Infinity;
  let bestEvent = null;
  for (const year in photoData) {
    for (const month in photoData[year]) {
      for (const day in photoData[year][month]) {
        const eventDate = new Date(photoData[year][month][day][0].date);
        const diff = Math.abs(today - eventDate);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestEvent = { year, month, day };
        }
      }
    }
  }
  return bestEvent;
};

onMounted(() => {
  const closest = findClosestEvent();
  if (closest) {
    openYear.value = closest.year;
    openMonth.value = closest.month;
    selectedDay.value = closest.day;
  }
});

// Navigation functions for panel selection
const showPanel = (level) => {
  currentPanel.value = level;
};

const selectYear = (year) => {
  openYear.value = year;
  openMonth.value = null;
  selectedDay.value = null;
  currentPanel.value = null;
};

const selectMonth = (month) => {
  openMonth.value = month;
  selectedDay.value = null;
  currentPanel.value = null;
};

const selectDayOption = (day) => {
  selectedDay.value = day;
  currentPanel.value = null;
};

// Navigation functions for day-to-day movement
const previousDay = () => {
  if (!openYear.value || !openMonth.value || !selectedDay.value) return;

  // Create a Date object for the currently selected event
  const currentEvent = new Date(
    photoData[openYear.value][openMonth.value][selectedDay.value][0].date
  );

  // Search for the event with the maximum date that is less than currentEvent
  let candidate = null;
  // Get all available years, sorted in descending order
  const allYears = Object.keys(photoData).map(Number).sort((a, b) => b - a);

  for (const yr of allYears) {
    if (yr > Number(openYear.value)) continue; // Only consider years <= current year
    const yearKey = yr.toString();
    for (const month in photoData[yearKey]) {
      for (const day in photoData[yearKey][month]) {
        const eventDate = new Date(
          photoData[yearKey][month][day][0].date
        );
        if (eventDate < currentEvent) {
          // Pick the event that is closest (largest) among those less than currentEvent
          if (!candidate || eventDate > candidate.eventDate) {
            candidate = { year: yearKey, month, day, eventDate };
          }
        }
      }
    }
    // If we're in the current selected year and a candidate was found, we can break early.
    if (yr === Number(openYear.value) && candidate) break;
  }

  if (candidate) {
    // Update to the candidate event
    openYear.value = candidate.year;
    openMonth.value = candidate.month;
    selectedDay.value = candidate.day;
  } else {
    // We're at the earliest event; find the newest event in the data.
    let newestCandidate = null;
    const allYearsAsc = Object.keys(photoData).map(Number).sort((a, b) => a - b);
    for (const yr of allYearsAsc) {
      const yearKey = yr.toString();
      for (const month in photoData[yearKey]) {
        for (const day in photoData[yearKey][month]) {
          const eventDate = new Date(
            photoData[yearKey][month][day][0].date
          );
          if (!newestCandidate || eventDate > newestCandidate.eventDate) {
            newestCandidate = { year: yearKey, month, day, eventDate };
          }
        }
      }
    }
    if (newestCandidate) {
      // Format the newest event's date in words (e.g., "Monday, January 1, 2021")
      const formattedNewestDate = newestCandidate.eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (
        window.confirm(
          "You are at the earliest event. Do you want to start over from " +
          formattedNewestDate + "?"
        )
      ) {
        openYear.value = newestCandidate.year;
        openMonth.value = newestCandidate.month;
        selectedDay.value = newestCandidate.day;
      }
    }
  }
};


const nextDay = () => {
  if (!openYear.value || !openMonth.value || !selectedDay.value) return;
  const currentEvent = new Date(
    photoData[openYear.value][openMonth.value][selectedDay.value][0].date
  );
  let candidate = null;
  const allYears = Object.keys(photoData).map(Number).sort((a, b) => a - b);
  for (const yr of allYears) {
    if (yr < Number(openYear.value)) continue;
    const yearKey = yr.toString();
    for (const month in photoData[yearKey]) {
      for (const day in photoData[yearKey][month]) {
        const eventDate = new Date(photoData[yearKey][month][day][0].date);
        if (eventDate > currentEvent) {
          if (!candidate || eventDate < candidate.eventDate) {
            candidate = { year: yearKey, month, day, eventDate };
          }
        }
      }
    }
    if (yr === Number(openYear.value) && candidate) break;
  }
  if (candidate) {
    openYear.value = candidate.year;
    openMonth.value = candidate.month;
    selectedDay.value = candidate.day;
  } else {
    // At the newest event; find the oldest event.
    let oldestCandidate = null;
    for (const yr of allYears) {
      const yearKey = yr.toString();
      for (const month in photoData[yearKey]) {
        for (const day in photoData[yearKey][month]) {
          const eventDate = new Date(photoData[yearKey][month][day][0].date);
          if (!oldestCandidate || eventDate < oldestCandidate.eventDate) {
            oldestCandidate = { year: yearKey, month, day, eventDate };
          }
        }
      }
    }
    if (oldestCandidate) {
      const formattedOldestDate = oldestCandidate.eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (
        window.confirm(
          "Do you want to start over from " + formattedOldestDate + "?"
        )
      ) {
        openYear.value = oldestCandidate.year;
        openMonth.value = oldestCandidate.month;
        selectedDay.value = oldestCandidate.day;
      }
    }
  }
};

const goToToday = () => {
  const today = new Date();
  let bestDiff = Infinity;
  let bestEvent = null;
  for (const year in photoData) {
    for (const month in photoData[year]) {
      for (const day in photoData[year][month]) {
        const eventDate = new Date(photoData[year][month][day][0].date);
        const diff = Math.abs(today - eventDate);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestEvent = { year, month, day };
        }
      }
    }
  }
  if (bestEvent) {
    openYear.value = bestEvent.year;
    openMonth.value = bestEvent.month;
    selectedDay.value = bestEvent.day;
  }
};
</script>

<template>
  <div>
    <!-- Persistent Breadcrumb Navigation (fills full width) -->
    <nav class="persistent-nav">
      <span class="breadcrumb-item" @click="showPanel('year')">
        {{ openYear ? openYear : validYears.join(' - ') }}
      </span>
      <template v-if="openYear">
        <span class="breadcrumb-separator">&gt;</span>
        <span class="breadcrumb-item" @click="showPanel('month')">
          {{ openMonth ? openMonth : 'All Months' }}
        </span>
      </template>
      <template v-if="openMonth">
        <span class="breadcrumb-separator">&gt;</span>
        <span class="breadcrumb-item" @click="showPanel('day')">
          {{ selectedDay ? selectedDay : 'All Days' }}
        </span>
      </template>
    </nav>

    <!-- Day Navigation Controls (always visible at bottom) -->
    <div class="day-nav-controls">
      <button class="nav-button" @click="previousDay">Previous Event</button>
      <button class="nav-button" @click="goToToday">Today (or nearest event)</button>
      <button class="nav-button" @click="nextDay">Next Event</button>
    </div>

    <!-- Selection Panel for Year -->
    <transition name="fade-slide">
      <div v-if="currentPanel === 'year'" class="selection-panel">
        <ul class="nav-year-list">
          <li v-for="year in validYears" :key="year" class="nav-item">
            <button class="nav-button" @click="selectYear(year)">
              {{ year }}
            </button>
          </li>
        </ul>
      </div>
    </transition>

    <!-- Selection Panel for Month -->
    <transition name="fade-slide">
      <div v-if="currentPanel === 'month' && openYear" class="selection-panel">
        <ul class="nav-month-list">
          <li v-for="(days, month) in photoData[openYear]" :key="month" class="nav-item">
            <button class="nav-button" @click="selectMonth(month)">
              {{ month }}
            </button>
          </li>
        </ul>
      </div>
    </transition>

    <!-- Selection Panel for Day -->
    <transition name="fade-slide">
      <div v-if="currentPanel === 'day' && openYear && openMonth" class="selection-panel">
        <ul class="nav-day-list">
          <li v-for="day in Object.keys(photoData[openYear][openMonth])" :key="day" class="nav-item">
            <button class="nav-button" @click="selectDayOption(day)">
              {{ day }}
            </button>
          </li>
        </ul>
      </div>
    </transition>

    <!-- Timeline Display (Photos) -->
    <div class="timeline-container">
      <transition name="fade">
        <div v-if="openYear && openMonth && selectedDay" class="photo-wrapper">
          <div
            v-for="photo in photoData[openYear][openMonth][selectedDay]"
            :key="photo.id"
            class="photo-section"
          >
            <h2>{{ photo.externalName }} ({{ openMonth }} {{ selectedDay }}, {{ openYear }})</h2>
            <img
              :src="photo.url"
              alt="Photo"
              onerror="this.onerror=null;this.src='https://placehold.co/400x250?text=Image+Not+Available';"
            />
            <p><strong>Description:</strong> {{ photo.description }}</p>
            <p><strong>Event Date:</strong> {{ photo.date }}</p>
            <p><strong>Uploaded At:</strong> {{ new Date(photo.uploadedAt).toLocaleString() }}</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
