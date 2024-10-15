<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import type { Blog } from '@/types'
import { EllipsisHorizontalIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot
} from 'radix-vue'
import { onMounted, ref, watch } from 'vue'

const loading = ref<boolean>(true)
const blogs = ref<Blog[]>([])
const error = ref<string | null>(null)
const currentPage = ref<number>(1)
const itemsPerPage = ref<number>(3)
const totalPages = ref<number>(0)
const totalItemsCount = ref<number | null>(null)

const selectedBlogId = ref<number | null>(null)
const isUpdateDialogOpen = ref(false)
const isRemoveDialogOpen = ref(false)

const openUpdateDialog = (blogId: number) => {
  selectedBlogId.value = blogId
  isUpdateDialogOpen.value = true
}

const openRemoveDialog = (blogId: number) => {
  selectedBlogId.value = blogId
  isRemoveDialogOpen.value = true
}

async function getBlogs() {
  try {
    loading.value = true
    const {
      data,
      count,
      error: supabaseError
    } = await supabase
      .from('blogs')
      .select('*', { count: 'exact' })
      .range(
        (currentPage.value - 1) * itemsPerPage.value,
        (currentPage.value - 1) * itemsPerPage.value + itemsPerPage.value - 1
      )

      .order('created_at', { ascending: false })

    if (supabaseError) throw supabaseError

    totalItemsCount.value = count
    blogs.value = data as Blog[]
    totalPages.value = Math.ceil((count ?? 0) / itemsPerPage.value)
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

function changePage(newPage: number) {
  if (newPage > 0 && newPage <= totalPages.value) {
    currentPage.value = newPage
    getBlogs()
  }
}

function handleBlogUpdated() {
  getBlogs()
  isUpdateDialogOpen.value = false
}

function handleBlogRemoved() {
  getBlogs()
  isRemoveDialogOpen.value = false
}

watch(
  () => currentPage.value,
  () => {
    getBlogs()
  }
)

onMounted(() => {
  getBlogs()
})
</script>

<template>
  <section class="w-full">
    <div class="w-full divide-y divide-white/5">
      <div
        class="grid w-full grid-cols-3 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8 jusfiy-between"
      >
        <div class="col-span-3 md:col-span-1 space-y-2">
          <h2 class="text-base font-semibold leading-7 text-zinc-800">All Blogs</h2>
          <p class="mt-1 text-sm leading-6 text-zinc-400">
            Here you can see all the blogs you have created. You can also edit or delete them.
          </p>
          <RouterLink
            to="/admin/blogs/create"
            class="mt-6 inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 sm:text-base"
          >
            Write a new blog
          </RouterLink>
        </div>

        <div class="col-span-3 md:col-span-2 space-y-2">
          <div
            v-if="blogs.length === 0"
            class="p-4 rounded-lg border bg-gradient-to-br from-neutral-50 to-zinc-50"
          >
            <h3 class="text-lg text-center text-zinc-500">
              No blogs available. Create your first blog!
            </h3>
          </div>
          <div v-else>
            <div
              v-for="blog in blogs"
              :key="blog.id"
              class="mb-8 p-4 rounded-lg border bg-gradient-to-br from-neutral-50 to-zinc-50"
            >
              <div class="w-full flex justify-end">
                <DropdownMenuRoot>
                  <DropdownMenuTrigger
                    class="flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-inset focus:ring-slate-400 rounded-md"
                  >
                    <EllipsisHorizontalIcon class="h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuContent
                      align="start"
                      side="right"
                      class="w-48 border rounded-sm bg-white shadow-lg"
                    >
                      <DropdownMenuItem @click="openUpdateDialog(blog.id)">
                        <button
                          class="w-full flex items-center gap-x-2 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-100 focus:outline-none rounded-sm p-1 text-sm text-zinc-700 cursor-pointer"
                        >
                          <PencilSquareIcon class="size-4 text-slate-400" />
                          <span>Edit</span>
                        </button>
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="openRemoveDialog(blog.id)">
                        <button
                          class="w-full flex items-center gap-x-2 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-100 focus:outline-none rounded-sm p-1 text-sm text-zinc-700 cursor-pointer"
                        >
                          <TrashIcon class="size-4 text-slate-400" />
                          <span>Remove</span>
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenuPortal>
                </DropdownMenuRoot>
              </div>
              <div
                class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6 overflow-hidden break-words whitespace-normal"
              >
                <div class="col-span-full space-y-2">
                  <h2 class="text-2xl font-bold">{{ blog.title }}</h2>
                  <h6 class="text-sm text-zinc-500">
                    {{ blog.content.author }} - {{ blog.created_at.split('T')[0] }}
                  </h6>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(tag, index) in blog.content.tags"
                      :key="index"
                      class="inline-block bg-zinc-100 text-zinc-700 border rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
                    >
                      {{ tag }}
                    </span>
                  </div>
                  <p class="mt-1 text-sm leading-6 text-zinc-400">
                    {{ blog.content.summary }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="totalPages > 1" class="mt-8 flex justify-center">
            <PaginationRoot
              :total="totalItemsCount ?? 0"
              :siblingCount="1"
              class="flex items-center gap-2"
            >
              <PaginationList v-slot="{ items }" class="flex items-center gap-2">
                <PaginationFirst
                  @click="changePage(1)"
                  :disabled="currentPage === 1"
                  class="inline-flex items-center justify-center rounded-md border bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  First
                </PaginationFirst>
                <PaginationPrev
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="inline-flex items-center justify-center rounded-md border bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </PaginationPrev>

                <template v-for="(page, index) in items">
                  <PaginationListItem
                    v-if="page.type === 'page'"
                    :value="page.value"
                    class="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium"
                    :class="[
                      page.value === currentPage
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'
                    ]"
                    :key="index"
                  >
                    {{ page.value }}
                  </PaginationListItem>
                  <PaginationEllipsis
                    v-else
                    :key="page.type"
                    :index="index"
                    class="inline-flex items-center justify-center px-3 py-2 text-sm text-zinc-700"
                  >
                    &#8230;
                  </PaginationEllipsis>
                </template>

                <PaginationNext
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="inline-flex items-center justify-center rounded-md border bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </PaginationNext>
                <PaginationLast
                  @click="changePage(totalPages)"
                  :disabled="currentPage === totalPages"
                  class="inline-flex items-center justify-center rounded-md border bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Last
                </PaginationLast>
              </PaginationList>
            </PaginationRoot>
          </div>
        </div>
      </div>
    </div>
    <UpdateBlogDialog
      v-if="selectedBlogId"
      :blogId="selectedBlogId"
      :open="isUpdateDialogOpen"
      @update-complete="handleBlogUpdated"
      @close="isUpdateDialogOpen = false"
    />

    <RemoveBlogDialog
      v-if="selectedBlogId"
      :blogId="selectedBlogId"
      :open="isRemoveDialogOpen"
      @remove-complete="handleBlogRemoved"
      @close="isRemoveDialogOpen = false"
    />
  </section>
</template>
