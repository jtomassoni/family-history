import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import AboutPage from './views/AboutPage.vue';
import ContactPage from './views/ContactPage.vue';
import GalleryPage from './views/GalleryPage.vue'; // Gallery is implemented
// For the other pages, you can create placeholder components until you're ready to add full code.
import FamilyTreePage from './views/FamilyTreePage.vue';
import StoriesPage from './views/StoriesPage.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutPage, meta: { hideBreadcrumbs: true } },
  { path: '/contact', name: 'Contact', component: ContactPage, meta: { hideBreadcrumbs: true } },
  { path: '/gallery', name: 'Gallery', component: GalleryView },
  { path: '/family-tree', name: 'FamilyTree', component: FamilyTreeView, meta: { hideBreadcrumbs: true } },
  { path: '/stories', name: 'Stories', component: StoriesView, meta: { hideBreadcrumbs: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
