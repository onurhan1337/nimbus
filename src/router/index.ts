import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth' // Make sure this path is correct

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/blogs',
      name: 'blogs',
      component: () => import('../views/BlogsView.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views//admin/AdminView.vue'),
      meta: {
        requiresAdmin: true
      }
    },
    {
      path: '/admin/blogs/create',
      name: 'create-blog',
      component: () => import('../views/admin/blogs/CreateView.vue'),
      meta: {
        requiresAdmin: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Check the session status
  await authStore.checkSession()

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // If the route requires a guest (unauthenticated) user and the user is authenticated,
    // redirect to the home page
    next({ name: 'home' })
  }
  // If the route requires an admin user and the user is not an admin, redirect to the home page
  else if (to.meta.requiresAdmin && !authStore.checkAdmin) {
    next({ name: 'home' })
  } else {
    // Otherwise, allow navigation to proceed
    next()
  }
})

export default router
