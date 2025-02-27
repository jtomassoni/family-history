// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import AboutPage from './views/AboutPage.vue';
import ContactPage from './views/ContactPage.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutPage, meta: { hideBreadcrumbs: true } },
  { path: '/contact', name: 'Contact', component: ContactPage, meta: { hideBreadcrumbs: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
