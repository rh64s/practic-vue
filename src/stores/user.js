import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || null)

  const isAuth = computed(() => !!(token.value))

  function setToken (token) {
    token.value = token
    localStorage.setItem('token', token)
  }

  function clearToken()  {
    token.value = null
    localStorage.removeItem('token')
  }

  return {token, isAuth, clearToken}
})
