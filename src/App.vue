<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { supabase } from './lib/supabaseClient'
import AuthView from './views/AuthView.vue'
import HomeView from './views/HomeView.vue'

const session = ref()

const logout = () => {
  supabase.auth.signOut()
}

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})
</script>

<template>
  <nav class="flex items-center gap-4">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/register">Register</RouterLink>
    <button
      @click="logout"
      v-if="session"
      class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
    >
      Logout
    </button>
  </nav>

  <HomeView v-if="session" :session="session" />
  <AuthView v-else />
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
