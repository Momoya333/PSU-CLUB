
import { defineRouter } from '#q-app'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import { Notify } from 'quasar'
import routes from './routes.js'
import { useAuthStore } from '@/stores/auth-store'

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE)
  })

  Router.beforeEach((to) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      Notify.create({
        type: 'warning',
        message: 'Please login first.'
      })
      return { name: 'login' }
    }

    if (to.meta.roles && !to.meta.roles.includes(authStore.role)) {
      Notify.create({
        type: 'negative',
        message: 'You do not have permission to access this page.'
      })
      return { name: 'home' }
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
      return { name: 'home' }
    }

    return true
  })

  return Router
})