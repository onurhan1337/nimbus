<template>
  <div class="w-full">
    <header class="w-full border-b bg-white/90 backdrop-blur-sm">
      <nav class="flex overflow-x-auto">
        <ul
          role="list"
          class="flex min-w-full flex-none gap-x-8 px-4 text-sm font-medium leading-6 sm:px-6 lg:px-8"
        >
          <li v-for="item in navigationItems" :key="item.name">
            <RouterLink
              :to="item.href"
              class="relative block py-4 transition-colors duration-200 hover:text-gray-900"
              :class="[
                isCurrentRoute(item.href)
                  ? 'text-blue-600 before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:rounded-full before:bg-blue-600'
                  : 'text-gray-500'
              ]"
            >
              {{ item.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </header>
  </div>
  <BlogsSection />
</template>

<script lang="ts" setup>
import BlogsSection from '@/components/admin/BlogsSection.vue'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const NAVIGATION = [
  { name: 'Blogs', href: '/admin' },
  { name: 'Users', href: '/admin/users' }
]

const navigationItems = computed(() => NAVIGATION)

const isCurrentRoute = (href: string): boolean => {
  return route.path === href
}
</script>
