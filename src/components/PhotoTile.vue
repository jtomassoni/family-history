<template>
  <div class="photo-tile-container">
    <h2 class="photo-title">
      {{ photo.externalName }} ({{ formattedMonth }} {{ formattedDay }}, {{ formattedYear }})
    </h2>
    <div class="photo-content">
      <div class="photo-image-container">
        <img class="photo-image" :src="photo.url" alt="Photo" @error="onImageError" />
      </div>
      <div class="photo-info">
        <p><strong>Description:</strong> {{ photo.description }}</p>
        <p><strong>Event Date:</strong> {{ photo.eventDate.toISOString().split("T")[0] }}</p>
        <p><strong>Uploaded At:</strong> {{ formattedUploadedAt }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";
import "../styles/PhotoTile.css";

const props = defineProps({
  photo: { type: Object, required: true }
});

const formattedYear = computed(() => props.photo.eventDate.getUTCFullYear().toString());
const formattedMonth = computed(() =>
  props.photo.eventDate.toLocaleString("default", { month: "long", timeZone: "UTC" })
);
const formattedDay = computed(() => props.photo.eventDate.getUTCDate().toString());
const formattedUploadedAt = computed(() =>
  new Date(props.photo.uploadedAt).toLocaleString("default", { timeZone: "UTC" })
);

const onImageError = (event) => {
  event.target.src = "https://placehold.co/400x250?text=Image+Not+Available";
};
</script>
