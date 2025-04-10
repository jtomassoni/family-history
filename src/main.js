import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';  // Import the router
import Vue3TouchEvents from 'vue3-touch-events';
import { setupRouterGuards } from './router/guards';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(Vue3TouchEvents);
app.use(router);

// Set up router guards after Pinia is initialized
setupRouterGuards(router);

app.mount('#app');
