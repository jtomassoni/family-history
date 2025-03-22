import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import AboutView from './views/AboutView.vue';
import GalleryView from './views/GalleryView.vue';
import FamilyTreeView from './views/FamilyTreeView.vue';
import StoriesView from './views/StoriesView.vue';
import AuthView from './views/AuthView.vue';
import NotFound from './views/NotFound.vue'; // Your 404 page component

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutView, meta: { hideBreadcrumbs: true } },
  { path: '/gallery', name: 'Gallery', component: GalleryView },
  { path: '/family-tree', name: 'FamilyTree', component: FamilyTreeView, meta: { hideBreadcrumbs: true } },
  { path: '/stories', name: 'Stories', component: StoriesView, meta: { hideBreadcrumbs: true } },
  // Use the same component for both login and signup:
  { path: '/login', name: 'Login', component: AuthView, alias: '/signup' },
  { path: '/404', name: 'NotFound', component: NotFound },
  // Any unmatched route will redirect to home
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
