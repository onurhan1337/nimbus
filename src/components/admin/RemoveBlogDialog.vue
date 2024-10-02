<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger
} from 'radix-vue'
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const props = defineProps({
  blogId: {
    type: Number,
    required: true
  }
})

const router = useRouter()
const authStore = useAuthStore()

if (!authStore.checkAdmin) throw new Error('You must be an admin to remove a blog.')

const handleRemove = async () => {
  const { error } = await supabase.from('blogs').delete().eq('id', props.blogId)
  if (error) toast.error('Error removing blog!')
  else {
    toast.success('Blog removed successfully!')
    router.push('/admin')
  }
}
</script>

<template>
  <AlertDialogRoot>
    <AlertDialogTrigger
      class="w-full bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-100 focus:outline-none rounded-sm p-1 text-sm text-zinc-700 cursor-pointer"
      :as-child="true"
    >
      <button class="flex">Remove</button>
    </AlertDialogTrigger>

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
        <div class="flex justify-end gap-[25px]">
          <AlertDialogCancel
            class="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            @click="handleRemove"
            class="text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
          >
            Yes, delete blog
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
