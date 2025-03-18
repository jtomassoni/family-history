<template>
  <div id="app">
    <!-- Persistent header -->
    <Header title="Tomassoni Family History" @help="toggleHintModal" />

    <!-- Main content (routed view) -->
    <router-view />

    <!-- Persistent footer -->
    <Footer />

    <!-- Optional: Global hint modal (if needed) -->
    <HintModal 
      v-if="showHintModal"
      :desktopHint="helpDesktopHint"
      :mobileHint="helpMobileHint"
      @dismiss="dismissHintModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import HintModal from './components/HintModal.vue';
import "./styles/Main.css";


const showHintModal = ref(false);
const toggleHintModal = () => {
  showHintModal.value = !showHintModal.value;
};
const dismissHintModal = () => {
  showHintModal.value = false;
};

const helpDesktopHint = "Need help?<br>Use your ⬅️/➡️ arrow keys to navigate, or press space for the date selector.";
const helpMobileHint = "Need help?<br>Swipe left/right to navigate, or tap the calendar icon for dates.";
</script>
