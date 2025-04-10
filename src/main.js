import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';  // Import the router
import Vue3TouchEvents from 'vue3-touch-events';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(Vue3TouchEvents);
app.use(router);
app.mount('#app');
