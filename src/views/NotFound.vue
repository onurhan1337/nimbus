<template>
  <section class="flex flex-col items-center justify-center px-6 py-12 text-center">
    <h1 class="text-8xl font-thin text-center font-sans">404</h1>
    <p class="mt-6 text-center text-zinc-500">
      Sorry, we couldn't find the page you're looking for.
    </p>
    <RouterLink to="/" class="mt-6 text-center bg-blue-700 text-white py-1.5 px-3 rounded-full"
      >Go back home</RouterLink
    >
  </section>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
</script>
