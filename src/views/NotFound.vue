<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>Sorry, we couldn't find the page you requested.</p>
    <router-link to="/" class="home-link">Return Home</router-link>
  </div>
</template>

<script setup>
// No special logic needed unless you want to add something extra.
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 3rem;
}
.not-found h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
.not-found p {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}
.home-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
  border: 1px solid #007bff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.2s ease;
}
.home-link:hover {
  background: #007bff;
  color: #fff;
}
</style>
