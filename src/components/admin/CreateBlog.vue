<template>
  <div class="container mx-auto py-10 px-4 sm:px-0">
    <h2 class="text-2xl font-bold font-mono mb-6">Create New Blog</h2>

    <form @submit="onSubmit" class="grid grid-cols-2 w-full gap-4">
      <!-- Blog Title -->
      <div class="col-span-2 sm:col-span-1">
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          v-bind="titleAttrs"
          v-model="title"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
          placeholder="Enter blog title"
        />
      </div>

      <!-- Category -->
      <div class="col-span-2 sm:col-span-1">
        <div class="flex items-center justify-between">
          <label for="category_id" class="block text-sm font-medium text-gray-700">Category</label>
          <button
            type="button"
            aria-label="Add Category"
            @click="openAddCategoryDialog"
            class="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            Add Category
          </button>
        </div>
        <select
          v-bind="categoryIdAttrs"
          v-model="categoryId"
          id="category_id"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
        >
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
            <span v-if="category.description" class="text-gray-500">
              - {{ category.description }}</span
            >
          </option>
        </select>
      </div>

      <!-- Author -->
      <div class="col-span-2 sm:col-span-1">
        <label for="author" class="block text-sm font-medium text-gray-700">Author</label>
        <input
          v-bind="authorAttrs"
          v-model="author"
          type="text"
          id="author"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
          placeholder="Enter author name"
        />
      </div>

      <!-- Summary -->
      <div class="col-span-2 sm:col-span-1">
        <label for="summary" class="block text-sm font-medium text-gray-700">Summary</label>
        <input
          v-bind="summaryAttrs"
          v-model="summary"
          type="text"
          id="summary"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
          placeholder="Enter a short summary of the blog post"
        />
      </div>

      <!-- Markdown Content -->
      <div class="col-span-2">
        <label for="markdown" class="block text-sm font-medium text-gray-700"
          >Content (Markdown)</label
        >
        <textarea
          id="markdown"
          v-bind="markdownAttrs"
          v-model="markdown"
          rows="5"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
          placeholder="Write your blog content using Markdown"
        ></textarea>
      </div>

      <!-- TODO: Convert that Tags Input -->
      <!-- Tags -->
      <div class="col-span-2 sm:col-span-1">
        <label for="tags" class="block text-sm font-medium text-gray-700"
          >Tags (comma-separated)</label
        >
        <input
          v-bind="tagsAttrs"
          v-model="tags"
          type="text"
          id="tags"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
          placeholder="e.g., vuejs, supabase, markdown"
        />
      </div>

      <!-- Cover Image URL -->
      <div class="col-span-2 sm:col-span-1">
        <label for="cover_image" class="block text-sm font-medium text-gray-700"
          >Cover Image URL</label
        >
        <input
          v-bind="coverImageAttrs"
          v-model="coverImage"
          type="url"
          id="cover_image"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
          placeholder="Enter cover image URL"
        />
      </div>

      <div class="col-span-2 sm:col-span-1">
        <label for="slug" class="block text-sm font-medium text-gray-700">Slug</label>
        <input
          v-bind="slugAttrs"
          v-model="slug"
          type="text"
          id="slug"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
          placeholder="Enter a unique slug for your blog post"
        />
        <button
          type="button"
          class="mt-2 text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
          @click="slug = slugify(title)"
          :disabled="slugAttrs.disabled"
        >
          Generate Slug
        </button>
      </div>

      <div class="col-span-2 flex justify-end">
        <button
          type="submit"
          class="w-auto py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
        >
          Create Blog Post
        </button>
      </div>
    </form>
  </div>
  <AddCategoryDialog v-model:open="isAddCategoryDialogOpen" @category-added="getCategories" />
</template>

<script lang="ts">
import { supabase } from '@/lib/supabaseClient'
import { slugify } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@supabase/supabase-js'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
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
  }),
  slug: zod.string()
})

type BlogFormValues = zod.infer<typeof blogSchema>

type Category = {
  id: number
  name: string
  description?: string
}

export default defineComponent({
  name: 'BlogForm',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const categories = ref<Category[]>([])
    const isAddCategoryDialogOpen = ref<boolean>(false)
    const user = authStore.user as User | null
    const userId = user?.id || ''

    function openAddCategoryDialog() {
      isAddCategoryDialogOpen.value = true
    }

    async function getCategories() {
      try {
        const { data, error } = await supabase.from('categories').select('*')
        if (error) throw error
        categories.value = data
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to fetch categories')
      }
    }

    onMounted(async () => {
      await getCategories()
    })

    const { handleSubmit, errors, defineField } = useForm<BlogFormValues>({
      validationSchema: toTypedSchema(blogSchema)
    })

    const [title, titleAttrs] = defineField('title')
    const [categoryId, categoryIdAttrs] = defineField('category_id')
    const [author, authorAttrs] = defineField('content.author')
    const [summary, summaryAttrs] = defineField('content.summary')
    const [markdown, markdownAttrs] = defineField('content.markdown')
    const [tags, tagsAttrs] = defineField('content.tags')
    const [coverImage, coverImageAttrs] = defineField('content.cover_image')
    const [slug, slugAttrs] = defineField('slug')

    const onSubmit = handleSubmit(async (values: BlogFormValues) => {
      try {
        // Check if user is logged in and has admin rights
        if (!authStore.checkSession()) {
          throw new Error('You must be logged in to create a blog post.')
        }
        if (!authStore.checkAdmin) {
          throw new Error('You must have admin rights to create a blog post.')
        }

        const { error } = await supabase.from('blogs').insert([
          {
            user_id: userId,
            title: values.title,
            category_id: values.category_id,
            slug: values.slug,
            content: {
              author: values.content.author,
              markdown: values.content.markdown,
              tags: values.content.tags,
              summary: values.content.summary,
              cover_image: values.content.cover_image
            }
          }
        ])

        if (error) throw error

        toast.success('Blog post created successfully!')
        router.push('/admin')
      } catch (error) {
        toast.error('Error creating blog post!')
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
      slug,
      slugify,
      coverImageAttrs,
      slugAttrs,
      errors,
      onSubmit,
      categories,
      getCategories,
      isAddCategoryDialogOpen,
      openAddCategoryDialog,
      schema: toTypedSchema(blogSchema)
    }
  }
})
</script>
