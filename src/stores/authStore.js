import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore(
  'auth',
  () => {
    //Stete
    const islogin = ref(false)
    const username = ref('')
    const uid = ref(0)

    //Getters
    const loginStatus = computed(() => {
      return islogin.value ? 'Logged in' : 'Logged Out'
    })
    const welcomeMessage = computed(() => {
      return islogin.value ? `Welcome ${username.value}` : 'Please Login'
    })

    const login = (inputUser, inputPass) => {
      if (inputUser === 'student' && inputPass === '123456') {
        islogin.value = true
        username.value = inputUser
        uid.value = 101
        return
      }
      return false
    }

    const logOut = () => {
      islogin.value = false
      username.value = ''
      uid.value = 0
    }

    return {
      islogin,
      username,
      uid,
      loginStatus,
      welcomeMessage,
      login,
      logOut
    }
  },
  { persist: true }
)
