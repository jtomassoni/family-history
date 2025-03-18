<template>
  <div class="auth-page-wrapper">
    <div class="auth-page-container">
      <h1>{{ isSignup ? "Sign Up" : "Login" }}</h1>
      <form class="auth-form" @submit.prevent="handleSubmit">
        <label for="username">Username</label>
        <input 
          type="text" 
          id="username" 
          v-model="username" 
          placeholder="Enter username" 
        />

        <!-- Show email field only on signup -->
        <label v-if="isSignup" for="email">Email</label>
        <input 
          v-if="isSignup" 
          type="email" 
          id="email" 
          v-model="email" 
          placeholder="Enter your email" 
        />

        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="Enter password" 
        />

        <!-- Show confirm password field only on signup -->
        <label v-if="isSignup" for="confirm-password">Confirm Password</label>
        <input 
          v-if="isSignup" 
          type="password" 
          id="confirm-password" 
          v-model="confirmPassword" 
          placeholder="Confirm password" 
        />

        <button type="submit" class="submit-button">
          {{ isSignup ? "Create Account" : "Sign In" }}
        </button>
      </form>

      <div class="sso-section">
        <p>Or use SSO:</p>
        <button class="sso-button spid-button" @click="handleSpidLogin">
          {{ isSignup ? "Sign Up with SPID" : "Login with SPID" }}
        </button>
        <button class="sso-button cie-button" @click="handleCieLogin">
          {{ isSignup ? "Sign Up with CIE" : "Login with CIE" }}
        </button>
      </div>

      <p class="auth-info">
        {{ isSignup ? "Already have an account?" : "Need an account?" }}
        <router-link :to="isSignup ? '/login' : '/signup'">
          {{ isSignup ? "Log in" : "Sign up" }}
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import './AuthPage.css'


const route = useRoute();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

// Check if user is on "/signup" or "/login"
const isSignup = computed(() => route.path === '/signup');

function handleSubmit() {
  if (isSignup.value) {
    if (password.value !== confirmPassword.value) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signing up:", username.value, email.value, password.value);
    alert(`Account created for ${username.value}!`);
    // Here, you'd send a POST request to your signup API endpoint.
  } else {
    console.log("Logging in:", username.value, password.value);
    alert(`Logged in as ${username.value}!`);
    // Here, you'd send a POST request to your login API endpoint.
  }
}

function handleSpidLogin() {
  alert(isSignup.value ? "SPID signup clicked!" : "SPID login clicked!");
}

function handleCieLogin() {
  alert(isSignup.value ? "CIE signup clicked!" : "CIE login clicked!");
}
</script>
