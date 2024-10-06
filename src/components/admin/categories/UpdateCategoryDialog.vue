<script lang="ts">
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import { toTypedSchema } from '@vee-validate/zod'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle
} from 'radix-vue'
import { useForm } from 'vee-validate'
import { defineComponent, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import * as z from 'zod'

const isAddCategoryDialogOpen = ref<boolean>(false)

const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must not exceed 50 characters'),
  description: z.string().max(200, 'Description must not exceed 200 characters').optional()
})

type CategoryForm = z.infer<typeof categorySchema>

export default defineComponent({
  name: 'UpdateCategoryDialog',
  components: {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle
  },
  props: {
    categoryId: {
      type: Number,
      required: true
    },
    open: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update-complete', 'close'],
  setup(props, { emit }) {
    const authStore = useAuthStore()

    const { handleSubmit, errors, defineField, setValues, resetForm } = useForm<CategoryForm>({
      validationSchema: toTypedSchema(categorySchema)
    })

    const [name, nameAttrs] = defineField('name')
    const [description, descriptionAttrs] = defineField('description')

    async function fetchCategoryData() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', props.categoryId)
          .single()

        if (error) throw error

        setValues({
          name: data.name,
          description: data.description || ''
        })
      } catch (error) {
        toast.error('Error fetching category data!')
        emit('close')
      }
    }

    const onSubmit = handleSubmit(async (values: CategoryForm) => {
      try {
        if (!authStore.checkSession()) {
          throw new Error('You must be logged in to update a category.')
        }
        if (!authStore.checkAdmin) {
          throw new Error('You must have admin rights to update a category.')
        }

        const { error } = await supabase
          .from('categories')
          .update({
            name: values.name,
            description: values.description
          })
          .eq('id', props.categoryId)

        if (error) throw error

        setTimeout(() => {
          toast.success('Category updated successfully!')
        })
        emit('update-complete')
        emit('close')
      } catch (error) {
        toast.error('Error updating category!')
      }
    })

    const handleClose = () => {
      emit('close')
      resetForm()
    }

    watch(
      () => props.open,
      (newValue) => {
        if (newValue) {
          fetchCategoryData()
        }
      }
    )

    return {
      name,
      description,
      isAddCategoryDialogOpen,
      nameAttrs,
      descriptionAttrs,
      handleClose,
      errors,
      onSubmit
    }
  }
})
</script>

<template>
  <DialogRoot :open="open" @update:open="handleClose">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 bg-black/50 z-50" />
      <DialogContent
        class="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 bg-white rounded-md shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
      >
        <DialogTitle class="text-xl font-bold mb-2">Update Category</DialogTitle>
        <DialogDescription class="text-sm text-gray-500 mb-4">
          Update the details of your category below.
        </DialogDescription>

        <form @submit="onSubmit" class="grid grid-cols-2 w-full gap-4">
          <div class="col-span-2">
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              v-bind="nameAttrs"
              v-model="name"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
              placeholder="Enter category name"
            />
            <span v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</span>
          </div>

          <div class="col-span-2">
            <label for="markdown" class="block text-sm font-medium text-gray-700"
              >Content (Markdown)</label
            >
            <textarea
              v-bind="descriptionAttrs"
              v-model="description"
              rows="5"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
              placeholder="Write your category description"
            ></textarea>
          </div>

          <div class="col-span-2 flex justify-end gap-2">
            <DialogClose
              class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              @click="handleClose"
            >
              Cancel
            </DialogClose>
            <button
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Update Category
            </button>
          </div>
        </form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
  <AddCategoryDialog v-model:open="isAddCategoryDialogOpen" @category-added="handleClose" />
</template>
