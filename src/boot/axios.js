import { defineBoot } from '#q-app'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const api = axios.create({
  // baseURL: import.meta.env.QCLI_API_URL || 'http://127.0.0.1:3000'
    baseURL: import.meta.env.QCLI_API_URL || ''
})

api.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json; charset=UTF-8'
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      config.headers['Authorization'] = `Bearer ${authStore.accessToken}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }