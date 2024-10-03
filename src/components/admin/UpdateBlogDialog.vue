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
import { defineComponent, onMounted, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import * as zod from 'zod'

const blogSchema = zod.object({
  title: zod.string().min(3, 'Title must be at least 3 characters long.'),
  category_id: zod.number().int().positive('Category must be a positive number.'),
  content: zod.object({
    author: zod.string().min(2, 'Author name must be at least 2 characters long.'),
    markdown: zod.string().min(10, 'Markdown content must be at least 10 characters long.'),
    tags: zod
      .string()
      .transform((val) => val.split(',').map((tag) => tag.trim()))
      .refine((val) => val.length > 0, 'Tags cannot be empty.'),
    summary: zod.string().optional(),
    cover_image: zod.string().url('Cover image must be a valid URL.').optional()
  })
})

type BlogFormValues = zod.infer<typeof blogSchema>

interface Category {
  id: number
  name: string
  description?: string
}

export default defineComponent({
  name: 'UpdateBlogDialog',
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
    blogId: {
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
    const categories = ref<Category[]>([])

    const { handleSubmit, errors, defineField, setValues, resetForm } = useForm<BlogFormValues>({
      validationSchema: toTypedSchema(blogSchema)
    })

    const [title, titleAttrs] = defineField('title')
    const [categoryId, categoryIdAttrs] = defineField('category_id')
    const [author, authorAttrs] = defineField('content.author')
    const [summary, summaryAttrs] = defineField('content.summary')
    const [markdown, markdownAttrs] = defineField('content.markdown')
    const [tags, tagsAttrs] = defineField('content.tags')
    const [coverImage, coverImageAttrs] = defineField('content.cover_image')

    async function getCategories() {
      const { data, error } = await supabase.from('categories').select('*')
      if (error) throw error
      categories.value = data
    }

    async function fetchBlogData() {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', props.blogId)
          .single()

        if (error) throw error

        setValues({
          title: data.title,
          category_id: data.category_id,
          content: {
            author: data.content.author,
            markdown: data.content.markdown,
            tags: data.content.tags.join(', '),
            summary: data.content.summary || '',
            cover_image: data.content.cover_image || ''
          }
        })
      } catch (error) {
        toast.error('Error fetching blog data!')
        emit('close')
      }
    }

    const onSubmit = handleSubmit(async (values: BlogFormValues) => {
      try {
        if (!authStore.checkSession()) {
          throw new Error('You must be logged in to update a blog post.')
        }
        if (!authStore.checkAdmin) {
          throw new Error('You must have admin rights to update a blog post.')
        }

        const { error } = await supabase
          .from('blogs')
          .update({
            title: values.title,
            category_id: values.category_id,
            content: {
              author: values.content.author,
              markdown: values.content.markdown,
              tags: values.content.tags,
              summary: values.content.summary,
              cover_image: values.content.cover_image
            }
          })
          .eq('id', props.blogId)

        if (error) throw error

        toast.success('Blog post updated successfully!')
        emit('update-complete')
        emit('close')
      } catch (error) {
        toast.error('Error updating blog post!')
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
          fetchBlogData()
        }
      }
    )

    onMounted(async () => {
      await getCategories()
      if (props.open) {
        await fetchBlogData()
      }
    })

    return {
      title,
      categoryId,
      author,
      summary,
      markdown,
      tags,
      coverImage,
      titleAttrs,
      categoryIdAttrs,
      authorAttrs,
      summaryAttrs,
      markdownAttrs,
      tagsAttrs,
      coverImageAttrs,
      errors,
      handleClose,
      onSubmit,
      categories
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
        <DialogTitle class="text-xl font-bold mb-2">Update Blog Post</DialogTitle>
        <DialogDescription class="text-sm text-gray-500 mb-4">
          Update the details of your blog post below.
        </DialogDescription>

        <form @submit="onSubmit" class="grid grid-cols-2 w-full gap-4">
          <div class="col-span-2 sm:col-span-1">
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              v-bind="titleAttrs"
              v-model="title"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
              placeholder="Enter blog title"
            />
            <span v-if="errors.title" class="text-sm text-red-500">{{ errors.title }}</span>
          </div>

          <div class="col-span-2 sm:col-span-1">
            <label for="category_id" class="block text-sm font-medium text-gray-700"
              >Category</label
            >
            <select
              v-bind="categoryIdAttrs"
              v-model="categoryId"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
            >
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
                <span v-if="category.description" class="text-gray-500">
                  - {{ category.description }}</span
                >
              </option>
            </select>
            <span v-if="errors['category_id']" class="text-sm text-red-500">{{
              errors['category_id']
            }}</span>
          </div>

          <div class="col-span-2 sm:col-span-1">
            <label for="author" class="block text-sm font-medium text-gray-700">Author</label>
            <input
              v-bind="authorAttrs"
              v-model="author"
              type="text"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
              placeholder="Enter author name"
            />
            <span v-if="errors['content.author']" class="text-sm text-red-500">{{
              errors['content.author']
            }}</span>
          </div>

          <div class="col-span-2 sm:col-span-1">
            <label for="summary" class="block text-sm font-medium text-gray-700">Summary</label>
            <input
              v-bind="summaryAttrs"
              v-model="summary"
              type="text"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
              placeholder="Enter a short summary"
            />
            <span v-if="errors['content.summary']" class="text-sm text-red-500">{{
              errors['content.summary']
            }}</span>
          </div>

          <div class="col-span-2">
            <label for="markdown" class="block text-sm font-medium text-gray-700"
              >Content (Markdown)</label
            >
            <textarea
              v-bind="markdownAttrs"
              v-model="markdown"
              rows="5"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
              placeholder="Write your blog content using Markdown"
            ></textarea>
            <span v-if="errors['content.markdown']" class="text-sm text-red-500">{{
              errors['content.markdown']
            }}</span>
          </div>

          <div class="col-span-2 sm:col-span-1">
            <label for="tags" class="block text-sm font-medium text-gray-700"
              >Tags (comma-separated)</label
            >
            <input
              v-bind="tagsAttrs"
              v-model="tags"
              type="text"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
              placeholder="e.g., vuejs, supabase, markdown"
            />
            <span v-if="errors['content.tags']" class="text-sm text-red-500">{{
              errors['content.tags']
            }}</span>
          </div>

          <div class="col-span-2 sm:col-span-1">
            <label for="cover_image" class="block text-sm font-medium text-gray-700"
              >Cover Image URL</label
            >
            <input
              v-bind="coverImageAttrs"
              v-model="coverImage"
              type="url"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
              placeholder="Enter cover image URL"
            />
            <span v-if="errors['content.cover_image']" class="text-sm text-red-500">{{
              errors['content.cover_image']
            }}</span>
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
              Update Blog Post
            </button>
          </div>
        </form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
