<template>
  <div class="mt-8 flow-root overflow-hidden">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <table class="w-full text-left">
        <thead class="bg-white">
          <tr>
            <th
              scope="col"
              class="relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
            >
              Name
              <div
                class="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200"
              />
              <div class="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200" />
            </th>
            <th
              scope="col"
              class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
            >
              Description
            </th>
            <th
              scope="col"
              class="relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
            >
              <span>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td class="relative py-4 pr-3 text-sm font-medium text-gray-900">
              {{ category.name }}
              <div class="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
              <div class="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
            </td>
            <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
              {{ category.description || 'No description provided' }}
            </td>
            <td class="flex gap-x-2 relative py-4 pl-3 text-right text-sm font-medium">
              <button @click="openUpdateDialog(category.id)">
                <PencilSquareIcon
                  class="size-4 text-zinc-400 hover:text-blue-400 cursor-pointer"
                  aria-hidden="true"
                />
              </button>
              <button @click="openRemoveDialog(category.id)">
                <TrashIcon
                  class="size-4 text-zinc-400 hover:text-red-400 cursor-pointer"
                  aria-hidden="true"
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <UpdateCategoryDialog
    :categoryId="selectedCategoryId"
    :open="isUpdateDialogOpen"
    @update-complete="handleUpdateDialogClose"
    @close="isUpdateDialogOpen = false"
  />
  <RemoveCategoryDialog
    :categoryId="selectedCategoryId"
    :open="isRemoveDialogOpen"
    @remove-complete="handleRemoveDialogClose"
    @close="isRemoveDialogOpen = false"
  />
</template>

<script lang="ts" setup>
import { supabase } from '@/lib/supabaseClient'
import type { Category } from '@/types'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue'

const categories = ref<Category[]>([])
const selectedCategoryId = ref<number | null>(null)
const isUpdateDialogOpen = ref<boolean>(false)
const isRemoveDialogOpen = ref<boolean>(false)

const openUpdateDialog = (categoryId: number) => {
  selectedCategoryId.value = categoryId
  isUpdateDialogOpen.value = true
}

const handleUpdateDialogClose = () => {
  selectedCategoryId.value = null
  isUpdateDialogOpen.value = false
  window.location.reload()
}

const openRemoveDialog = (categoryId: number) => {
  selectedCategoryId.value = categoryId
  isRemoveDialogOpen.value = true
}

const handleRemoveDialogClose = () => {
  selectedCategoryId.value = null
  isRemoveDialogOpen.value = false
  window.location.reload()
}

onMounted(async () => {
  const { data, error } = await supabase.from('categories').select('*')
  if (error) {
    console.error('Error fetching categories:', error)
  } else {
    categories.value = data
  }
})
</script>
