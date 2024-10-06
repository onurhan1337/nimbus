<template>
  <header class="bg-zinc-50">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
      <div class="flex lg:flex-1">
        <a href="#" class="-m-1.5 p-1.5 font-serif font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-yin-yang-filled"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#2c3e50"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-9 1.732a8 8 0 0 0 4 14.928l.2 -.005a4 4 0 0 0 0 -7.99l-.2 -.005a4 4 0 0 1 -.2 -7.995l.2 -.005a7.995 7.995 0 0 0 -4 1.072zm4 1.428a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3z"
              stroke-width="0"
              fill="currentColor"
            />
            <path
              d="M12 14.5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0 -3z"
              stroke-width="0"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
      <div class="flex lg:hidden">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-zinc-700"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <PopoverGroup class="hidden lg:flex lg:gap-x-4">
        <RouterLink
          v-for="item in NAV_ITEMS"
          :key="item.name"
          :to="item.href"
          :class="[
            'text-sm font-semibold leading-6 px-4 py-1 rounded-md border border-transparent',
            route.path === item.href
              ? 'text-blue-600 bg-zinc-200 border-zinc-300'
              : 'text-zinc-900 hover:text-zinc-700'
          ]"
        >
          {{ item.name }}
        </RouterLink>
      </PopoverGroup>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end items-center">
        <RouterLink
          v-if="!authStore.isAuthenticated"
          to="/auth"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
          >Login <span aria-hidden="true">&rarr;</span></RouterLink
        >
        <button
          v-else
          @click="authStore.logout"
          class="text-zinc-500 hover:underline focus:ring-2 focus:ring-zinc-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
        >
          Logout
          <span aria-hidden="true">&rarr;</span>
        </button>
        <RouterLink
          v-if="authStore.checkAdmin"
          to="/admin"
          class="text-zinc-500 bg-zinc-200 border border-zinc-300 hover:bg-zinc-300 focus:ring-2 focus:ring-zinc-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
          >Admin</RouterLink
        >
      </div>
    </nav>
    <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10" />
      <DialogPanel
        class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-zinc-900/10"
      >
        <div class="flex items-center justify-between">
          <a href="#" class="-m-1.5 p-1.5 font-serif font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-yin-yang-filled"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2c3e50"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-9 1.732a8 8 0 0 0 4 14.928l.2 -.005a4 4 0 0 0 0 -7.99l-.2 -.005a4 4 0 0 1 -.2 -7.995l.2 -.005a7.995 7.995 0 0 0 -4 1.072zm4 1.428a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3z"
                stroke-width="0"
                fill="currentColor"
              />
              <path
                d="M12 14.5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0 -3z"
                stroke-width="0"
                fill="currentColor"
              />
            </svg>
          </a>
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-zinc-700"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-zinc-500/10">
            <div class="space-y-2 py-6" v-for="item in NAV_ITEMS" :key="item.name">
              <RouterLink
                :to="item.href"
                @click="mobileMenuOpen = false"
                :class="[
                  '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7',
                  route.path === item.href
                    ? 'bg-zinc-100 text-blue-600'
                    : 'text-zinc-900 hover:bg-zinc-50'
                ]"
              >
                {{ item.name }}
              </RouterLink>
            </div>
            <div class="py-6">
              <RouterLink
                v-if="!authStore.isAuthenticated"
                to="/auth"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
                >Login <span aria-hidden="true">&rarr;</span></RouterLink
              >
              <div v-else>
                <RouterLink
                  v-if="authStore.checkAdmin"
                  to="/admin"
                  @click="mobileMenuOpen = false"
                  class="text-zinc-500 bg-zinc-200 border border-zinc-300 hover:bg-zinc-300 focus:ring-2 focus:ring-zinc-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
                  >Admin</RouterLink
                >
                <button
                  @click="handleLogout"
                  class="text-zinc-500 hover:underline focus:ring-2 focus:ring-zinc-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
                >
                  Logout
                  <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { Dialog, DialogPanel, PopoverGroup } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const mobileMenuOpen = ref(false)
const authStore = useAuthStore()
const route = useRoute()

const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Blogs', href: '/blogs' }
]

const handleLogout = () => {
  mobileMenuOpen.value = false
  authStore.logout()
}

onMounted(async () => {
  await authStore.checkSession()
})
</script>
