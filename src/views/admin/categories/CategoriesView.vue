<script lang="ts">
import { ref } from 'vue'
import CategoriesTable from '@/components/admin/categories/CategoriesTable.vue'

const isAddCategoryDialogOpen = ref<boolean>(false)

const openAddCategoryDialog = () => {
  isAddCategoryDialogOpen.value = true
}

const closeAddCategoryDialog = () => {
  isAddCategoryDialogOpen.value = false
  window.location.reload()
}

export default {
  components: {
    CategoriesTable
  },
  setup() {
    return {
      isAddCategoryDialogOpen,
      openAddCategoryDialog,
      closeAddCategoryDialog
    }
  }
}
</script>

<template>
  <section class="w-full">
    <div class="w-full divide-y divide-white/5">
      <div
        class="grid w-full grid-cols-3 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8 jusfiy-between"
      >
        <div class="col-span-3 md:col-span-1 space-y-2">
          <h2 class="text-base font-semibold leading-7 text-zinc-800">All Categories</h2>
          <p class="mt-1 text-sm leading-6 text-zinc-400">
            Here you can see all the categories you have created. You can also edit or delete them.
          </p>
          <button
            type="button"
            @click="openAddCategoryDialog"
            class="mt-6 inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 sm:text-base"
          >
            Add Category
          </button>
        </div>

        <div class="col-span-3 md:col-span-2 space-y-2">
          <CategoriesTable />
        </div>
      </div>
    </div>
  </section>
  <AddCategoryDialog
    v-model:open="isAddCategoryDialogOpen"
    @category-added="closeAddCategoryDialog"
  />
</template>
