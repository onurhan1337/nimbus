<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import type { Blog } from '@/types'
import { MagnifyingGlassIcon, MagnifyingGlassMinusIcon } from '@heroicons/vue/24/outline'
import { debounce } from 'lodash'
import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue
} from 'radix-vue'
import { onMounted, ref, watch } from 'vue'

interface Category {
  id: number
  name: string
}

const loading = ref<boolean>(true)
const blogs = ref<Blog[]>([])
const categories = ref<Category[]>([])
const error = ref<string | null>(null)
const currentPage = ref<number>(1)
const itemsPerPage = ref<number>(6)
const totalPages = ref<number>(0)
const totalItemsCount = ref<number | null>(null)

const searchQuery = ref('')
const selectedCategory = ref<string>('all')

async function getCategories() {
  try {
    const { data, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (categoryError) throw categoryError
    categories.value = data as Category[]
  } catch (e) {
    error.value = (e as Error).message
  }
}

async function getBlogs() {
  try {
    loading.value = true
    let query = supabase
      .from('blogs')
      .select('*', { count: 'exact' })
      .range(
        (currentPage.value - 1) * itemsPerPage.value,
        (currentPage.value - 1) * itemsPerPage.value + itemsPerPage.value - 1
      )
      .order('created_at', { ascending: false })

    if (selectedCategory.value && selectedCategory.value !== 'all') {
      query = query.eq('category_id', parseInt(selectedCategory.value))
    }

    if (searchQuery.value) {
      query = query.ilike('title', `%${searchQuery.value}%`)
    }

    const { data, count, error: supabaseError } = await query

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
  }
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
  getBlogs()
}, 300)

function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  debouncedSearch()
}

function handleCategoryChange(value: string) {
  selectedCategory.value = value
  currentPage.value = 1
  getBlogs()
}

watch(
  () => currentPage.value,
  () => {
    getBlogs()
  }
)

onMounted(() => {
  getCategories()
  getBlogs()
})
</script>

<template>
  <section class="w-full">
    <div class="w-full divide-y divide-white/5">
      <div class="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div class="w-full mx-auto">
          <div class="flex flex-col sm:flex-row justify-between items-center space-y-6 mb-12">
            <h2 class="text-3xl font-semibold tracking-tight text-neutral-600 sm:text-4xl">
              Latest Blog Posts
            </h2>

            <div class="w-auto flex flex-row justify-end gap-4">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon class="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="text"
                  class="block w-auto pl-10 pr-3 py-2 border border-zinc-300 rounded-md leading-5 bg-white placeholder-zinc-500 focus:outline-none focus:placeholder-zinc-400 focus:ring-1 focus:ring-zinc-300 focus:border-zinc-300 sm:text-sm"
                  placeholder="Search blogs..."
                  :value="searchQuery"
                  @input="handleSearchInput"
                />
              </div>

              <SelectRoot :modelValue="selectedCategory" @update:modelValue="handleCategoryChange">
                <SelectTrigger
                  aria-label="Select category"
                  class="inline-flex items-center justify-between w-auto px-3 py-2 text-sm border border-zinc-300 rounded-md bg-white hover:bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-300"
                >
                  <SelectValue :placeholder="'Select category'">
                    {{
                      !selectedCategory || selectedCategory === 'all'
                        ? 'All Categories'
                        : categories.find((cat) => cat.id.toString() === selectedCategory)?.name
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent
                    position="popper"
                    :side="'bottom'"
                    :align="'start'"
                    :sideOffset="5"
                    class="z-50 min-w-[200px] bg-white rounded-md shadow-lg border border-zinc-200 overflow-hidden"
                  >
                    <SelectViewport class="p-1">
                      <SelectGroup>
                        <SelectItem
                          value="all"
                          class="relative flex items-center px-8 py-2 text-sm text-zinc-700 hover:bg-zinc-100 cursor-pointer outline-none rounded data-[highlighted]:bg-zinc-100"
                        >
                          All Categories
                        </SelectItem>
                        <SelectItem
                          v-for="category in categories"
                          :key="category.id"
                          :value="category.id.toString()"
                          class="relative flex items-center px-8 py-2 text-sm text-zinc-700 hover:bg-zinc-100 cursor-pointer outline-none rounded data-[highlighted]:bg-zinc-100"
                        >
                          {{ category.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectViewport>
                  </SelectContent>
                </SelectPortal>
              </SelectRoot>
            </div>
          </div>

          <div v-if="loading" class="text-center py-8">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto"
            ></div>
          </div>

          <div v-else-if="error" class="text-center py-8 text-red-600">
            {{ error }}
          </div>

          <div
            v-else-if="blogs.length === 0"
            class="flex flex-col border py-16 space-y-6 px-8 rounded-lg border-zinc-100 items-center justify-center animate-fade-in"
          >
            <MagnifyingGlassMinusIcon class="h-12 w-12 text-neutral-400" />
            <h6 class="text-2xl font-semibold text-neutral-600">No blog posts found</h6>
            <p class="text-neutral-400 max-w-md text-center">
              We couldn't find any blog posts matching your criteria. Try searching for something
              else or reset the filters to see more results.
            </p>
          </div>

          <div v-else class="grid grid-cols-12 gap-x-8 gap-y-10">
            <article
              v-for="blog in blogs"
              :key="blog.id"
              class="w-full col-span-12 md:col-span-6 lg:col-span-4"
            >
              <div
                class="flex flex-col justify-between relative p-6 rounded-lg border bg-gradient-to-br from-neutral-50 to-zinc-50 transition-shadow hover:shadow-md h-full"
              >
                <div class="space-y-3">
                  <h3 class="text-2xl font-bold text-zinc-900 line-clamp-2">
                    {{ blog.title }}
                  </h3>
                  <div class="flex items-center gap-x-2 text-sm text-zinc-500">
                    <span>{{ blog.content.author }}</span>
                    <span>•</span>
                    <time>{{ new Date(blog.created_at).toLocaleDateString() }}</time>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(tag, index) in blog.content.tags"
                      :key="index"
                      class="inline-block bg-zinc-100 text-zinc-700 rounded-full px-3 py-1 text-xs font-semibold"
                    >
                      {{ tag }}
                    </span>
                  </div>
                  <p class="text-zinc-600 line-clamp-3">
                    {{ blog.content.summary }}
                  </p>
                </div>
                <RouterLink :to="`/blog/${blog.slug}`" class="col-span-4 w-full">
                  <button
                    class="w-full bg-gradient-to-br from-neutral-100 to-zinc-200 text-zinc-500 px-4 text-sm font-medium rounded border border-zinc-300/50 hover:opacity-90 shadow-sm mt-4 py-1"
                  >
                    Read
                  </button>
                </RouterLink>
              </div>
            </article>
          </div>

          <div v-if="totalPages > 1" class="mt-12 flex justify-center">
            <PaginationRoot
              :total="totalItemsCount ?? 0"
              :siblingCount="1"
              class="flex items-center gap-2"
            >
              <!-- Pagination content remains the same -->
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
  </section>
</template>
