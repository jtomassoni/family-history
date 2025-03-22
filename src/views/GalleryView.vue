<template>
  <div class="gallery-page">
    <!-- Boundary Hint Modal -->
    <HintModal 
      v-if="isBoundaryHintVisible"
      :desktopHint="boundaryDesktopHint"
      :mobileHint="boundaryMobileHint"
      :timeoutDuration="4000"
      @dismiss="dismissBoundaryHint"
    />

    <!-- Photo Navigation & Tile -->
    <div class="photo-navigation-container" 
         v-touch:swipe.left="nextPhoto" 
         v-touch:swipe.right="previousPhoto">
      <BigNavArrow 
        direction="left" 
        @click="previousPhoto" 
        :disabled="isLeftArrowDisabled" 
        label="Previous" 
        @boundary="handleBoundary('left')"
      />
      <div class="photo-display-container">
        <transition name="fade">
          <div v-if="currentPhoto" class="photo-wrapper">
            <PhotoTile :photo="currentPhoto" />
          </div>
        </transition>
      </div>
      <BigNavArrow 
        direction="right" 
        @click="nextPhoto" 
        :disabled="isRightArrowDisabled" 
        label="Next" 
        @boundary="handleBoundary('right')"
      />
    </div>

    <!-- Timeline Navigation -->
    <div class="timeline-nav">
      <div class="timeline-header">
        <div class="timeline-title">
          {{ timelineTitle }}
        </div>
        
        <div v-if="timelineLayer !== 'all'" class="timeline-breadcrumb">
          <button @click="resetTimeline" class="timeline-reset">
            <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            All Photos
          </button>
          <span v-if="selectedRange" class="timeline-path">
            {{ formatTimelinePath }}
          </span>
        </div>

        <button 
          v-if="timelineLayer !== 'all'"
          class="timeline-back"
          @click="goBack"
        >
          <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>
      </div>
      
      <!-- Adaptive time ranges -->
      <div 
        v-for="range in adaptiveRanges" 
        :key="range.id"
        class="timeline-range"
        :class="{ 
          'has-photos': range.count > 0,
          'selected': selectedRange && selectedRange.id === range.id
        }"
        :style="{ 
          left: range.left,
          width: range.width + '%'
        }"
        @click="selectRange(range)"
      >
        <span class="range-label">{{ formatRangeLabel(range) }}</span>
        <span class="range-count">{{ range.count }} {{ range.count === 1 ? 'photo' : 'photos' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import moment from 'moment';
import { photoData } from '../data/photoData.js';
import DatePickerNav from '../components/DatePickerNav.vue';
import BigNavArrow from '../components/BigNavArrow.vue';
import PhotoTile from '../components/PhotoTile.vue';
import HintModal from '../components/HintModal.vue';
import "./GalleryView.css";

// Prepare and sort photos using Moment.js without UTC conversion.
// This ensures that the eventDate (e.g., "1900-01-01") is treated as a local date.
const sortedPhotos = computed(() => {
  return photoData.slice().map(photo => ({
    ...photo,
    eventDate: moment(photo.eventDate, "YYYY-MM-DD").toDate(),
    uploadedAt: moment(photo.uploadedAt).toDate()
  })).sort((a, b) => b.eventDate - a.eventDate);
});

// Track current photo.
const currentIndex = ref(0);
const currentPhoto = computed(() => sortedPhotos.value[currentIndex.value] || null);

// Navigation States.
const isAtBeginning = computed(() => currentIndex.value === sortedPhotos.value.length - 1);
const isAtEnd = computed(() => currentIndex.value === 0);
const isLeftArrowDisabled = computed(() => isAtBeginning.value);
const isRightArrowDisabled = computed(() => isAtEnd.value);

// Boundary flags.
const showEarliest = ref(false);
const showLatest = ref(false);
const isBoundaryHintVisible = ref(false);

watch(currentIndex, () => {
  showEarliest.value = (currentIndex.value === sortedPhotos.value.length - 1);
  showLatest.value = (currentIndex.value === 0);
  isBoundaryHintVisible.value = showEarliest.value || showLatest.value;
}, { immediate: true });

const boundaryDesktopHint = computed(() => {
  if (showEarliest.value)
    return "You've reached the earliest photo!<br>Use your arrow keys to browse or press space to select a date.<br>";
  if (showLatest.value)
    return "You're at the most recent photo!<br>Use your arrow keys to browse or press space to select a date.<br>Click a pic to see details.";
  return "";
});

const boundaryMobileHint = computed(() => {
  if (showEarliest.value)
    return "Earliest photo reached!<br>Swipe to explore or tap the calendar for dates.<br>Tap on a photo to see details.";
  if (showLatest.value)
    return "Most recent photo!<br>Swipe to explore or tap the calendar for dates.<br>Tap on a photo to see details.";
  return "";
});


// Other modal flags.
const showDateSelect = ref(false);

const previousPhoto = async () => {
  if (isLeftArrowDisabled.value) return;
  currentIndex.value = Math.min(currentIndex.value + 1, sortedPhotos.value.length - 1);
  await nextTick();
};

const nextPhoto = async () => {
  if (isRightArrowDisabled.value) return;
  currentIndex.value = Math.max(currentIndex.value - 1, 0);
  await nextTick();
};

const handleSelectEvent = (selectedEvent) => {
  const index = sortedPhotos.value.findIndex(
    photo => moment(photo.eventDate).format("YYYY-MM-DD") === moment(selectedEvent.eventDate, "YYYY-MM-DD").format("YYYY-MM-DD")
  );
  if (index >= 0) currentIndex.value = index;
};

const handleBoundary = (direction) => {
  console.log(`Boundary event received for direction: ${direction}`);
  if (direction === 'left') {
    showEarliest.value = true;
  } else if (direction === 'right') {
    showLatest.value = true;
  }
};

const dismissBoundaryHint = () => {
  isBoundaryHintVisible.value = false;
};

const dismissDateSelect = () => {
  showDateSelect.value = false;
};

// KEYBOARD GESTURES
const handleKeyDown = (event) => {
  // If boundary hint is visible, dismiss it on any key press.
  if (isBoundaryHintVisible.value) {
    console.log("[GalleryPage] Dismissing boundary hint due to keyboard input.");
    dismissBoundaryHint();
    return;
  }
  if (window.innerWidth >= 769) {
    if (event.key === "ArrowLeft") {
      if (event.shiftKey) {
        currentIndex.value = sortedPhotos.value.length - 1;
      } else if (!isLeftArrowDisabled.value) {
        previousPhoto();
      }
    } else if (event.key === "ArrowRight") {
      if (event.shiftKey) {
        currentIndex.value = 0;
      } else if (!isRightArrowDisabled.value) {
        nextPhoto();
      }
    }
  }
};

// Timeline functionality
const timelineTrack = ref(null);
const getCurrentPosition = computed(() => {
  if (!currentPhoto.value) return 0;
  const startDate = moment(sortedPhotos.value[sortedPhotos.value.length - 1].eventDate);
  const endDate = moment(sortedPhotos.value[0].eventDate);
  const currentDate = moment(currentPhoto.value.eventDate);
  return ((currentDate - startDate) / (endDate - startDate)) * 100;
});

const previewData = ref(null);
const previewPosition = ref(0);

// Remove zoom-related code and replace with smart clustering
const CLUSTER_THRESHOLD = 30; // days between photos to consider them part of same cluster

const smartClusters = computed(() => {
  if (!sortedPhotos.value.length) return [];
  
  let clusters = [];
  let currentCluster = null;
  
  sortedPhotos.value.forEach((photo, index) => {
    const photoDate = moment(photo.eventDate);
    
    if (!currentCluster) {
      // Start new cluster
      currentCluster = {
        id: index,
        startDate: photoDate.toDate(),
        endDate: photoDate.toDate(),
        count: 1,
        photos: [photo]
      };
    } else {
      const daysBetween = photoDate.diff(moment(currentCluster.endDate), 'days');
      
      if (daysBetween <= CLUSTER_THRESHOLD) {
        // Add to current cluster
        currentCluster.endDate = photoDate.toDate();
        currentCluster.count++;
        currentCluster.photos.push(photo);
      } else {
        // Start new cluster
        clusters.push(currentCluster);
        currentCluster = {
          id: index,
          startDate: photoDate.toDate(),
          endDate: photoDate.toDate(),
          count: 1,
          photos: [photo]
        };
      }
    }
  });
  
  if (currentCluster) {
    clusters.push(currentCluster);
  }
  
  return clusters;
});

// Update position calculation for clusters
const getClusterPosition = (cluster) => {
  const startDate = moment(sortedPhotos.value[sortedPhotos.value.length - 1].eventDate);
  const endDate = moment(sortedPhotos.value[0].eventDate);
  const clusterDate = moment(cluster.startDate);
  return ((clusterDate - startDate) / (endDate - startDate)) * 100;
};

const handleTimelineClick = (event) => {
  if (!timelineTrack.value) return;
  
  const rect = timelineTrack.value.getBoundingClientRect();
  const clickPosition = (event.clientX - rect.left) / rect.width;
  
  // Find the nearest photo to the clicked position
  const startDate = moment(sortedPhotos.value[sortedPhotos.value.length - 1].eventDate);
  const endDate = moment(sortedPhotos.value[0].eventDate);
  const clickedDate = moment(startDate).add(
    (endDate - startDate) * clickPosition
  );
  
  // Find the nearest photo
  let nearestIndex = 0;
  let minDiff = Infinity;
  
  sortedPhotos.value.forEach((photo, index) => {
    const diff = Math.abs(moment(photo.eventDate) - clickedDate);
    if (diff < minDiff) {
      minDiff = diff;
      nearestIndex = index;
    }
  });
  
  currentIndex.value = nearestIndex;
};

const handleTimelineHover = (event) => {
  if (!timelineTrack.value) return;
  
  const rect = timelineTrack.value.getBoundingClientRect();
  const position = event.clientX - rect.left;
  const percentage = (position / rect.width) * 100;
  
  // Find nearest cluster
  const startDate = moment(sortedPhotos.value[sortedPhotos.value.length - 1].eventDate);
  const endDate = moment(sortedPhotos.value[0].eventDate);
  const hoverDate = moment(startDate).add(
    (endDate - startDate) * (percentage / 100)
  );
  
  // Find closest cluster
  const closest = smartClusters.value.reduce((prev, curr) => {
    const prevDiff = Math.abs(moment(prev.startDate) - hoverDate);
    const currDiff = Math.abs(moment(curr.startDate) - hoverDate);
    return currDiff < prevDiff ? curr : prev;
  });
  
  previewData.value = closest;
  previewPosition.value = position;
};

const hidePreview = () => {
  previewData.value = null;
};

const formatPreviewDate = (date) => {
  return moment(date).format('MMM D, YYYY');
};

const goToClusterDate = (date) => {
  const index = sortedPhotos.value.findIndex(photo => 
    moment(photo.eventDate) >= moment(date)
  );
  if (index !== -1) {
    currentIndex.value = index;
  }
};

// Update cluster label formatting
const formatClusterLabel = (cluster) => {
  const start = moment(cluster.startDate);
  const end = moment(cluster.endDate);
  
  if (start.year() !== end.year()) {
    return `${start.format('MMM YYYY')} - ${end.format('MMM YYYY')}`;
  }
  if (start.month() !== end.month()) {
    return `${start.format('MMM')} - ${end.format('MMM YYYY')}`;
  }
  if (start.date() !== end.date()) {
    return `${start.format('MMM D')} - ${end.format('D, YYYY')}`;
  }
  return start.format('MMM D, YYYY');
};

const showClusterPreview = (cluster, event) => {
  previewData.value = cluster;
  if (timelineTrack.value) {
    const rect = timelineTrack.value.getBoundingClientRect();
    previewPosition.value = event.clientX - rect.left;
  }
};

// Timeline state
const timelineLayer = ref('all'); // 'all', 'year', 'month', 'day'
const selectedRange = ref(null);
const selectedPath = ref([]);

// Compute adaptive ranges based on current layer
const adaptiveRanges = computed(() => {
  if (!sortedPhotos.value.length) return [];
  
  const photos = sortedPhotos.value;
  const startDate = moment(photos[photos.length - 1].eventDate);
  const endDate = moment(photos[0].eventDate);
  
  switch (timelineLayer.value) {
    case 'all':
      return createMajorRanges(startDate, endDate);
    case 'year':
      return createYearRanges(selectedRange.value);
    case 'month':
      return createMonthRanges(selectedRange.value);
    case 'day':
      return createDayRanges(selectedRange.value);
    default:
      return [];
  }
});

// Helper function to get all years that have photos
const getAvailableYears = () => {
  const years = new Set();
  sortedPhotos.value.forEach(photo => {
    years.add(moment(photo.eventDate).year());
  });
  return Array.from(years).sort((a, b) => a - b);
};

// Helper function to calculate how many buttons can fit in the timeline
const calculateButtonCount = () => {
  // Each button is roughly 100px wide including spacing
  const buttonWidth = 100;
  const minButtons = 2; // We always need at least 2 buttons
  const maxButtons = Math.min(4, Math.floor(window.innerWidth / buttonWidth)); // Never more than 4 buttons
  return Math.max(minButtons, maxButtons);
};

// Helper function for consistent range positioning across all layers
const createRanges = (start, end, intervalType = 'years') => {
  if (intervalType === 'years' && timelineLayer.value === 'all') {
    // For the initial year ranges, use all available years
    const availableYears = getAvailableYears();
    const totalYears = availableYears.length;
    const maxButtons = calculateButtonCount();
    
    // If we have space for all years and it's 4 or fewer, show individual year buttons
    if (maxButtons >= totalYears && totalYears <= 4) {
      const spacing = 25; // More generous spacing between buttons
      const totalWidth = (totalYears - 1) * spacing;
      const startOffset = (100 - totalWidth) / 2;
      
      return availableYears.map((year, index) => {
        const yearStart = moment().year(year).startOf('year');
        const yearEnd = moment().year(year).endOf('year');
        const count = countPhotosInRange(yearStart, yearEnd);
        
        return {
          id: year.toString(),
          startDate: yearStart.toDate(),
          endDate: yearEnd.toDate(),
          count,
          left: `${startOffset + (index * spacing)}%`
        };
      });
    }
    
    // Otherwise, create range buttons that evenly distribute the years
    const yearsPerRange = Math.ceil(totalYears / maxButtons);
    const ranges = [];
    const spacing = 25; // More generous spacing between buttons
    const totalWidth = (maxButtons - 1) * spacing;
    const startOffset = (100 - totalWidth) / 2;
    
    for (let i = 0; i < totalYears; i += yearsPerRange) {
      const rangeYears = availableYears.slice(i, Math.min(i + yearsPerRange, totalYears));
      if (rangeYears.length > 0) {
        const rangeStart = moment().year(rangeYears[0]).startOf('year');
        const rangeEnd = moment().year(rangeYears[rangeYears.length - 1]).endOf('year');
        const count = countPhotosInRange(rangeStart, rangeEnd);
        
        ranges.push({
          id: rangeStart.format('YYYY'),
          startDate: rangeStart.toDate(),
          endDate: rangeEnd.toDate(),
          availableYears: rangeYears,
          count,
          left: `${startOffset + (ranges.length * spacing)}%`
        });
      }
    }
    
    return ranges;
  } else if (timelineLayer.value === 'year' && selectedRange.value?.availableYears) {
    const years = selectedRange.value.availableYears;
    const maxButtons = calculateButtonCount();
    
    // If we have space for all years and it's 4 or fewer, show them individually
    if (maxButtons >= years.length && years.length <= 4) {
      const spacing = 25; // More generous spacing between buttons
      const totalWidth = (years.length - 1) * spacing;
      const startOffset = (100 - totalWidth) / 2;
      
      return years.map((year, index) => {
        const yearStart = moment().year(year).startOf('year');
        const yearEnd = moment().year(year).endOf('year');
        const count = countPhotosInRange(yearStart, yearEnd);
        
        return {
          id: year.toString(),
          startDate: yearStart.toDate(),
          endDate: yearEnd.toDate(),
          count,
          left: `${startOffset + (index * spacing)}%`
        };
      });
    }
    
    // Otherwise, create sub-ranges
    const yearsPerRange = Math.ceil(years.length / maxButtons);
    const ranges = [];
    const spacing = 25; // More generous spacing between buttons
    const totalWidth = (maxButtons - 1) * spacing;
    const startOffset = (100 - totalWidth) / 2;
    
    for (let i = 0; i < years.length; i += yearsPerRange) {
      const rangeYears = years.slice(i, Math.min(i + yearsPerRange, years.length));
      if (rangeYears.length > 0) {
        const rangeStart = moment().year(rangeYears[0]).startOf('year');
        const rangeEnd = moment().year(rangeYears[rangeYears.length - 1]).endOf('year');
        const count = countPhotosInRange(rangeStart, rangeEnd);
        
        ranges.push({
          id: rangeStart.format('YYYY'),
          startDate: rangeStart.toDate(),
          endDate: rangeEnd.toDate(),
          availableYears: rangeYears,
          count,
          left: `${startOffset + (ranges.length * spacing)}%`
        });
      }
    }
    
    return ranges;
  } else {
    // For months and days, use similar logic
    const totalInterval = end.diff(start, intervalType);
    const maxButtons = calculateButtonCount();
    const intervalsPerRange = Math.ceil(totalInterval / maxButtons);
    
    let ranges = [];
    let currentStart = moment(start);
    
    const spacing = 20; // More generous spacing between buttons
    const totalWidth = (maxButtons - 1) * spacing;
    const startOffset = (100 - totalWidth) / 2;
    
    while (currentStart.isBefore(end)) {
      const rangeEnd = moment.min(
        moment(currentStart).add(intervalsPerRange - 1, intervalType),
        moment(end)
      );
      
      const count = countPhotosInRange(currentStart, rangeEnd);
      
      ranges.push({
        id: currentStart.format('YYYY'),
        startDate: currentStart.toDate(),
        endDate: rangeEnd.toDate(),
        count,
        left: `${startOffset + (ranges.length * spacing)}%`
      });
      
      currentStart = moment(rangeEnd).add(1, intervalType);
      
      if (currentStart.isAfter(end) || ranges.length >= maxButtons) break;
    }
    
    return ranges;
  }
};

// Use the unified range creation for all layers
const createMajorRanges = (start, end) => {
  return createRanges(start, end, 'years');
};

const createYearRanges = (parentRange) => {
  const start = moment(parentRange.startDate);
  const end = moment(parentRange.endDate);
  return createRanges(start, end, 'years');
};

const createMonthRanges = (parentRange) => {
  const start = moment(parentRange.startDate);
  const end = moment(parentRange.endDate);
  return createRanges(start, end, 'months');
};

const createDayRanges = (parentRange) => {
  const start = moment(parentRange.startDate);
  const end = moment(parentRange.endDate);
  return createRanges(start, end, 'days');
};

// Helper to count photos in a date range
const countPhotosInRange = (start, end) => {
  return sortedPhotos.value.filter(photo => 
    moment(photo.eventDate).isBetween(start, end, null, '[]')
  ).length;
};

// Maximum photo count in current ranges for density calculation
const maxCount = computed(() => {
  return Math.max(...adaptiveRanges.value.map(r => r.count));
});

// Format range label based on current layer
const formatRangeLabel = (range) => {
  const start = moment(range.startDate);
  const end = moment(range.endDate);
  
  switch (timelineLayer.value) {
    case 'all':
      if (start.year() === end.year()) {
        return start.format('YYYY');
      }
      return `${start.format('YYYY')} - ${end.format('YYYY')}`;
    case 'year':
      return start.format('YYYY');
    case 'month':
      return start.format('MMM YYYY');
    case 'day':
      return start.format('MMM D');
    default:
      return '';
  }
};

// Timeline navigation
const selectRange = (range) => {
  selectedRange.value = range;
  selectedPath.value.push(range);
  
  switch (timelineLayer.value) {
    case 'all':
      timelineLayer.value = 'year';
      break;
    case 'year':
      timelineLayer.value = 'month';
      break;
    case 'month':
      timelineLayer.value = 'day';
      break;
    case 'day':
      // Navigate to first photo in range
      const firstPhoto = sortedPhotos.value.find(photo => 
        moment(photo.eventDate).isBetween(range.startDate, range.endDate, null, '[]')
      );
      if (firstPhoto) {
        const index = sortedPhotos.value.indexOf(firstPhoto);
        currentIndex.value = index;
      }
      break;
  }
};

const goBack = () => {
  selectedPath.value.pop();
  selectedRange.value = selectedPath.value[selectedPath.value.length - 1] || null;
  
  switch (timelineLayer.value) {
    case 'year':
      timelineLayer.value = 'all';
      break;
    case 'month':
      timelineLayer.value = 'year';
      break;
    case 'day':
      timelineLayer.value = 'month';
      break;
  }
};

const resetTimeline = () => {
  timelineLayer.value = 'all';
  selectedRange.value = null;
  selectedPath.value = [];
};

// Computed properties for UI
const timelineTitle = computed(() => {
  if (!sortedPhotos.value.length) return 'No Photos';
  
  switch (timelineLayer.value) {
    case 'all':
      return 'Select Time Period';
    case 'year':
      return `Select Year (${moment(selectedRange.value.startDate).format('YYYY')} - ${moment(selectedRange.value.endDate).format('YYYY')})`;
    case 'month':
      return `Select Month (${moment(selectedRange.value.startDate).format('YYYY')})`;
    case 'day':
      return `Select Day (${moment(selectedRange.value.startDate).format('MMM YYYY')})`;
    default:
      return 'Select Time Period';
  }
});

// Format timeline path based on current layer and selected range
const formatTimelinePath = computed(() => {
  if (!selectedRange.value) return '';
  
  const start = moment(selectedRange.value.startDate);
  const end = moment(selectedRange.value.endDate);
  
  switch (timelineLayer.value) {
    case 'year':
      return `${start.format('YYYY')} - ${end.format('YYYY')}`;
    case 'month':
      return `${start.format('MMMM YYYY')}`;
    case 'day':
      return `${start.format('MMMM D, YYYY')}`;
    default:
      return '';
  }
});

onMounted(() => {
  currentIndex.value = 0;
  window.addEventListener("keydown", handleKeyDown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
.button-icon {
  width: 16px;
  height: 16px;
}

.timeline-range.selected {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.4), rgba(147, 197, 253, 0.3));
  border-color: rgba(96, 165, 250, 0.6);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.timeline-range.selected .range-label {
  color: #bfdbfe;
}

.timeline-range.selected .range-count {
  color: rgba(255, 255, 255, 0.8);
}
</style>
