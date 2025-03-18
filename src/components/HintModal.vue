<template>
  <transition name="hint-fade" @after-enter="logAfterEnter">
    <div class="hint-modal-overlay" @click="dismiss">
      <!-- Remove click-stop here so clicking inside the modal also closes it -->
      <div class="hint-modal-content-wrapper" @click="dismiss">
        <div :class="['hint-modal-content', themeClass]">
          <!-- Display desktop and mobile hint content -->
          <p class="hint-text hint-desktop" v-html="desktopHint"></p>
          <p class="hint-text hint-mobile" v-html="mobileHint"></p>
          <div class="close-message">
            <span class="close-text">👆Tap anywhere to close!👆👆</span>
            <span class="countdown-text">
              ⏱️Auto-closing in {{ countdownSeconds }} second<span v-if="countdownSeconds !== 1">s</span> 
            </span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineEmits, defineProps, computed, ref, onMounted, onUnmounted } from 'vue';
import "../styles/HintModal.css";

const props = defineProps({
  timeoutDuration: {
    type: Number,
    default: 10000,
  },
  desktopHint: {
    type: String,
    default: "Use your ⬅️ arrow keys ➡️ to glide through photos.<br>For a quick jump to the oldest or newest, hold ⬆️ Shift ⬆️ with your arrows!<br>⌨️ Press space to open the 🗓️ date selector."
  },
  mobileHint: {
    type: String,
    default: "📱 Swipe left/right to cruise through family memories.<br>👆Tap the 🗓️ icon to pick a special date!"
  },
  theme: {
    type: String,
    default: "light"
  }
});
console.log("[HintModal] Props:", props);

const emit = defineEmits(["dismiss"]);

const localTheme = ref(props.theme);
const themeClass = computed(() => (localTheme.value === "dark" ? "dark-theme" : "light-theme"));

const countdownSeconds = ref(Math.ceil(props.timeoutDuration / 1000));
let countdownInterval;
let timeoutId;

const dismiss = () => {
  console.log("[HintModal] dismiss() called – closing modal");
  emit("dismiss");
};

const logAfterEnter = () => {
  console.log("[HintModal] Transition after-enter complete");
};

onMounted(() => {
  console.log("[HintModal] Component mounted");
  if (props.timeoutDuration > 0) {
    console.log("[HintModal] Setting auto-dismiss timeout to", props.timeoutDuration, "ms");
    countdownInterval = setInterval(() => {
      if (countdownSeconds.value > 0) {
        countdownSeconds.value -= 1;
        console.log("[HintModal] Countdown:", countdownSeconds.value);
      }
    }, 1000);
    timeoutId = setTimeout(() => {
      console.log("[HintModal] Auto-dismiss timeout reached");
      dismiss();
    }, props.timeoutDuration);
  } else {
    console.log("[HintModal] Auto-dismiss disabled (timeoutDuration <= 0)");
  }
});

onUnmounted(() => {
  console.log("[HintModal] Component unmounted");
  if (timeoutId) {
    console.log("[HintModal] Clearing timeout", timeoutId);
    clearTimeout(timeoutId);
  }
  if (countdownInterval) {
    console.log("[HintModal] Clearing countdown interval", countdownInterval);
    clearInterval(countdownInterval);
  }
});
</script>
