<template>
  <div class="xl:pl-72">
    <header class="border bg-zinc-100/90">
      <nav class="flex overflow-x-auto py-4">
        <ul
          role="list"
          class="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
        >
          <li v-for="item in SECONDARY_NAVIGATION" :key="item.name">
            <RouterLink
              :to="item.href"
              :class="item.current ? 'text-blue-800 underline underline-offset-4 p-2 rounded' : ''"
              >{{ item.name }}</RouterLink
            >
          </li>
        </ul>
      </nav>
    </header>

    <BlogsSection />
  </div>
</template>

<script lang="ts" setup>
import BlogsSection from '@/components/admin/BlogsSection.vue'

import { RouterLink } from 'vue-router'

const SECONDARY_NAVIGATION = [
  { name: 'Blogs', href: '/admin/blogs', current: true },
  { name: 'Users', href: '/admin/users', current: false }
]
</script>
