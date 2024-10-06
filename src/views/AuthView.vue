<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { ref, watch } from 'vue'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoginView = ref(true)

watch(
  () => authStore.email,
  (newValue) => {
    if (newValue !== email.value) {
      email.value = newValue
    }
  }
)

watch(
  () => authStore.password,
  (newValue) => {
    if (newValue !== password.value) {
      password.value = newValue
    }
  }
)

watch(
  () => email.value,
  (newValue) => {
    authStore.email = newValue
  }
)

watch(
  () => password.value,
  (newValue) => {
    authStore.password = newValue
  }
)

function toggleView() {
  isLoginView.value = !isLoginView.value
  authStore.email = ''
  authStore.password = ''
}

async function handleSubmit() {
  if (isLoginView.value) {
    await authStore.login()
  } else {
    await authStore.register()
  }
}
</script>

<template>
  <div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 border sm:rounded-lg sm:px-10">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 class="pb-6 text-start text-3xl font-semibold font-sans text-zinc-900">
            {{ isLoginView ? 'Login' : 'Register' }}
          </h2>
        </div>
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-zinc-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="authStore.email"
                class="appearance-none block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-blue-500 focus:border-blue-700 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-zinc-700"> Password </label>
            <div class="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                v-model="authStore.password"
                class="appearance-none block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-blue-700 focus:border-blue-700 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
            >
              {{ isLoginView ? 'Login' : 'Register' }}
            </button>
          </div>
        </form>
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-zinc-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-zinc-500"> Or </span>
            </div>
          </div>
          <div class="mt-6">
            <a
              href="#"
              @click.prevent="toggleView"
              class="w-full flex justify-center py-2 px-4 text-sm font-medium text-zinc-600 focus:outline-none hover:underline underline-offset-4"
              role="button"
            >
              {{
                isLoginView ? "Don't have an account? Register" : 'Already have an account? Login'
              }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
