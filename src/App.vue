<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import NavBar from './components/navBar.vue'
</script>

<template>
  <NavBar />

  <RouterView />
  <Toaster />
</template>
