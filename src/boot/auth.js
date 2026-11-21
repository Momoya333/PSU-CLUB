import { defineBoot } from '#q-app'
import { useAuthStore } from '@/stores/auth-store'

export default defineBoot(async () => {
  const auth = useAuthStore()
  await auth.checkAuth()
})