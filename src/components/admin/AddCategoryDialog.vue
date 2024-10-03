<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import { toTypedSchema } from '@vee-validate/zod'
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle
} from 'radix-vue'
import { useForm } from 'vee-validate'
import { defineEmits } from 'vue'
import { toast } from 'vue-sonner'
import { z } from 'zod'

const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must not exceed 50 characters'),
  description: z.string().max(200, 'Description must not exceed 200 characters').optional()
})

type CategoryForm = z.infer<typeof categorySchema>

const props = defineProps({
  open: {
    type: Boolean
  }
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'category-added': []
}>()

const authStore = useAuthStore()

if (!authStore.checkAdmin) throw new Error('You must be an admin to add a category.')

const { handleSubmit, errors, resetForm, defineField } = useForm({
  validationSchema: toTypedSchema(categorySchema)
})

const [name, nameAttrs] = defineField('name')
const [description, descriptionAttrs] = defineField('description')

const onSubmit = handleSubmit(async (values: CategoryForm) => {
  try {
    const { error } = await supabase.from('categories').insert([
      {
        name: values.name,
        description: values.description || null
      }
    ])

    if (error) throw error

    toast.success('Category added successfully!')
    emit('category-added')
    handleClose()
  } catch (error) {
    console.error('Error adding category:', error)
    toast.error('Failed to add category')
  }
})

const handleClose = () => {
  resetForm()
  emit('update:open', false)
}
</script>

<template>
  <DialogRoot :open="props.open" @update:open="handleClose" :modal="true">
    <DialogPortal>
      <DialogOverlay class="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-30" />
      <DialogContent
        class="z-[100] text-[15px] data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
      >
        <DialogTitle class="text-xl font-bold mb-2"> Add New Category </DialogTitle>
        <DialogDescription class="text-sm text-gray-500 mb-4">
          Categories are used to group blogs together. You can add a new category by filling out the
          form below.
        </DialogDescription>

        <form @submit="onSubmit" class="mt-4">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                v-model="name"
                v-bind="nameAttrs"
                type="text"
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                required
              />
              <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                v-model="description"
                v-bind="descriptionAttrs"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
              ></textarea>
              <span v-if="errors.description" class="text-red-500 text-sm">
                {{ errors.description }}
              </span>
            </div>
          </div>

          <div class="mt-5 flex justify-end gap-2">
            <button
              type="button"
              @click="handleClose"
              class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Add Category
            </button>
          </div>
        </form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
