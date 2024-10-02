<template>
  <section>
    <div class="divide-y divide-white/5">
      <div
        class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
      >
        <div>
          <h2 class="text-base font-semibold leading-7 text-zinc-800">All Blogs</h2>
          <p class="mt-1 text-sm leading-6 text-gray-400">
            Here you can see all the blogs you have created. You can also edit or delete them.
          </p>
          <RouterLink
            to="/admin/blogs/create"
            class="mt-6 inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 sm:text-base"
          >
            Write a new blog
          </RouterLink>
        </div>

        <div class="md:col-span-2">
          <div
            v-for="blog in blogs"
            :key="blog.id"
            class="mb-8 p-4 rounded-lg border bg-gradient-to-br from-neutral-50 to-zinc-50"
          >
            <div class="w-full flex justify-end">
              <DropdownMenuRoot>
                <DropdownMenuTrigger class="flex items-center justify-between">
                  <EllipsisHorizontalIcon class="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent
                    align="start"
                    side="right"
                    class="w-48 border rounded-sm bg-white shadow-lg"
                  >
                    <DropdownMenuItem
                      class="w-full bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-100 focus:outline-none rounded-sm p-1 text-sm text-zinc-700 cursor-pointer"
                      >Edit</DropdownMenuItem
                    >
                    <DropdownMenuItem v-on:select="(e) => e.preventDefault()">
                      <RemoveBlogDialog :blogId="blog.id" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenuRoot>
            </div>
            <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div class="col-span-full space-y-2">
                <h2 class="text-2xl font-bold">{{ blog.title }}</h2>
                <h6 class="text-sm text-zinc-500">
                  {{ blog.content.author }} - {{ blog.created_at.split('T')[0] }}
                </h6>
                <div v-for="(tag, index) in blog.content.tags" :key="index">
                  <span
                    class="inline-block bg-zinc-100 text-zinc-700 border rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
                  >
                    {{ tag }}
                  </span>
                </div>
                <p class="mt-1 text-sm leading-6 text-gray-400">
                  {{ blog.content.summary }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger
} from 'radix-vue'
import { onMounted, ref } from 'vue'

interface Blog {
  id: number
  title: string
  category_id: number
  content: {
    author: string
    markdown: string
    tags: string[]
    summary: string
    cover_image: string
  }
  user_id: number
  created_at: string
  updated_at: string
}

const loading = ref<boolean>(true)
const blogs = ref<Blog[]>([])
const error = ref<string | null>(null)

async function getBlogs() {
  try {
    const { data, error: supabaseError } = await supabase.from('blogs').select('*')
    if (supabaseError) throw supabaseError
    blogs.value = data as Blog[]
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getBlogs()
})
</script>
