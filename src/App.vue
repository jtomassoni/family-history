<template>
  <div id="app">
    <!-- Persistent header -->
    <Header title="Tomassoni Family History" @help="toggleHintModal" />

    <!-- Main content (routed view) -->
    <router-view />

    <!-- Persistent footer -->
    <Footer />

    <!-- Optional: Global hint modal (if needed) -->
    <transition name="hint-fade">
      <HintModal 
        v-if="showHintModal"
        :desktopHint="helpDesktopHint"
        :mobileHint="helpMobileHint"
        @dismiss="dismissHintModal"
      />
    </transition>

    
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import HintModal from './components/HintModal.vue';
import "./styles/main.css";


const showHintModal = ref(false);
const toggleHintModal = () => {
  showHintModal.value = !showHintModal.value;
};
const dismissHintModal = () => {
  showHintModal.value = false;
};

const helpDesktopHint = "LOST ❓ <br>Use your ⬅️/➡️ arrow keys to navigate.<br>Press space ⌨️ for the date selection.";
const helpMobileHint = "LOST ❓ <br>Swipe (👈 and 👉) to navigate.<br>Tap the 📅 for date selection.";

</script>
