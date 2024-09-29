<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="flex items-center gap-4">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>

  <RouterView />
</template>

<style>
nav {
  background-color: #eee;
  padding: 1rem;
}

nav a {
  font-weight: bold;
  color: #333;
  text-decoration: none;
  margin-right: 1rem;
}
</style>
