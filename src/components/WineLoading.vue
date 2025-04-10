<template>
  <div class="wine-loading-container">
    <div class="wine-bottle">
      <div class="bottle-neck"></div>
      <div class="bottle-body">
        <div class="wine-liquid" :style="{ height: `${fillLevel}%` }"></div>
      </div>
      <div class="bottle-label">
        <span>Loading...</span>
      </div>
    </div>
    <div class="wine-splash" v-for="(splash, index) in splashes" :key="index" :style="splash.style"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const fillLevel = ref(0);
const splashes = ref([]);
let animationFrame;

const createSplash = () => {
  const size = Math.random() * 20 + 10;
  return {
    style: {
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 100}%`,
      bottom: `${Math.random() * 30}%`,
      animationDuration: `${Math.random() * 2 + 1}s`,
      animationDelay: `${Math.random() * 0.5}s`
    }
  };
};

const animate = () => {
  fillLevel.value = (fillLevel.value + 1) % 100;
  
  if (Math.random() > 0.7) {
    splashes.value.push(createSplash());
    if (splashes.value.length > 5) {
      splashes.value.shift();
    }
  }
  
  animationFrame = requestAnimationFrame(animate);
};

onMounted(() => {
  animate();
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
.wine-loading-container {
  position: relative;
  width: 100px;
  height: 200px;
  margin: 0 auto;
}

.wine-bottle {
  position: relative;
  width: 100%;
  height: 100%;
}

.bottle-neck {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 40px;
  background: #e6e6e6;
  border-radius: 5px;
}

.bottle-body {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 160px;
  background: #e6e6e6;
  border-radius: 5px 5px 15px 15px;
  overflow: hidden;
}

.wine-liquid {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #8b0000;
  transition: height 0.3s ease;
}

.bottle-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 60px;
  background: #f5f5f5;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  text-align: center;
  padding: 2px;
}

.wine-splash {
  position: absolute;
  background: #8b0000;
  border-radius: 50%;
  opacity: 0;
  animation: splash 1s ease-out forwards;
}

@keyframes splash {
  0% {
    transform: scale(0);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style> 