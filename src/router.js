import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import AboutPage from './views/AboutPage.vue';
import ContactPage from './views/ContactPage.vue';
import GalleryPage from './views/GalleryPage.vue';
import FamilyTreePage from './views/FamilyTreePage.vue';
import StoriesPage from './views/StoriesPage.vue';
import AuthPage from './views/AuthPage.vue';
import NotFound from './views/NotFound.vue'; // Your 404 page component

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutPage, meta: { hideBreadcrumbs: true } },
  { path: '/contact', name: 'Contact', component: ContactPage, meta: { hideBreadcrumbs: true } },
  { path: '/gallery', name: 'Gallery', component: GalleryPage },
  { path: '/family-tree', name: 'FamilyTree', component: FamilyTreePage, meta: { hideBreadcrumbs: true } },
  { path: '/stories', name: 'Stories', component: StoriesPage, meta: { hideBreadcrumbs: true } },
  // Use the same component for both login and signup:
  { path: '/login', name: 'Login', component: AuthPage, alias: '/signup' },
  { path: '/404', name: 'NotFound', component: NotFound },
  // Any unmatched route will redirect to home
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
