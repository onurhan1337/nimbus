import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAdmin = ref(false)
  const router = useRouter()
  const email = ref('')
  const password = ref('')

  const checkAdmin = computed(() => isAdmin.value)
  const isAuthenticated = computed(() => !!user.value)

  async function login() {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      })

      if (error) {
        alert(error.message)
      } else {
        await checkSession()
        router.push('/')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('An error occurred during login')
    }
  }

  async function register() {
    try {
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          data: {
            is_admin: false
          }
        }
      })

      if (error) {
        alert(error.message)
      } else {
        await checkSession()
        router.push('/')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('An error occurred during registration')
    }
  }

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      user.value = null
      isAdmin.value = false
      await checkSession()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      alert('An error occurred during logout')
    }
  }

  async function checkSession() {
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) throw error

      user.value = data.session?.user ?? null

      if (user.value) {
        await checkUserIsAdmin()
      } else {
        isAdmin.value = false
      }
    } catch (error) {
      console.error('Session check error:', error)
      user.value = null
      isAdmin.value = false
    }
  }

  async function checkUserIsAdmin() {
    try {
      if (!user.value) return

      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.value.id)
        .single()

      if (error) throw error

      isAdmin.value = data?.is_admin ?? false
    } catch (error) {
      console.error('Admin check error:', error)
      isAdmin.value = false
    }
  }

  return {
    user,
    email,
    password,
    isAuthenticated,
    login,
    register,
    logout,
    checkSession,
    checkAdmin
  }
})
