import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')

  const isAuth = computed(() => !!token.value)

  function setToken (newToken) {
    token.value = newToken
    localStorage.setItem('token', token)
  }

  function clearToken()  {
    token.value = ''
    localStorage.removeItem('token')
  }

  return {token, isAuth, clearToken, setToken}
})
