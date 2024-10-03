<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle
} from 'radix-vue'
import { defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const props = defineProps({
  blogId: {
    type: Number,
    required: true
  },
  open: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits<{
  'remove-complete': []
  close: []
}>()

const router = useRouter()
const authStore = useAuthStore()

if (!authStore.checkAdmin) throw new Error('You must be an admin to remove a blog.')

const handleRemove = async () => {
  const { error } = await supabase.from('blogs').delete().eq('id', props.blogId)
  if (error) {
    toast.error('Error removing blog!')
    emit('close')
  } else {
    toast.success('Blog removed successfully!')
    emit('remove-complete')
    router.push('/admin')
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <AlertDialogRoot :open="open" @update:open="handleClose">
    <AlertDialogPortal>
      <AlertDialogOverlay
        class="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-30"
      />
      <AlertDialogContent
        class="z-[100] text-[15px] data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
      >
        <AlertDialogTitle class="text-mauve12 m-0 text-[17px] font-semibold">
          Are you absolutely sure?
        </AlertDialogTitle>
        <AlertDialogDescription class="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
          This action cannot be undone. This will permanently delete your account and remove your
          blog from our servers.
        </AlertDialogDescription>
        <div class="flex justify-end gap-2">
          <button
            @click="handleClose"
            class="text-zinc-900 bg-white border border-zinc-300 focus:outline-none hover:bg-zinc-100 focus:ring-4 focus:ring-zinc-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:hover:bg-zinc-700 dark:hover:border-zinc-600 dark:focus:ring-zinc-700"
          >
            Cancel
          </button>
          <AlertDialogAction
            @click="handleRemove"
            class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Yes, delete blog
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
