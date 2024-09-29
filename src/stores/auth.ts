import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const router = useRouter()

  const isAuthenticated = computed(() => !!user.value)

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    if (error) alert(error.message)
    else {
      await checkSession()
      router.push('/')
    }
  }

  async function register() {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value
    })
    if (error) alert(error.message)
    else {
      await checkSession()
      router.push('/')
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    else {
      user.value = null
      await checkSession()
      router.push('/auth')
    }
  }

  async function checkSession() {
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user || null
  }

  return { user, isAuthenticated, login, register, logout, checkSession }
})
