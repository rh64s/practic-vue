import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { userService } from '@/utils/api/userService.js'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')

  const isAuth = computed(() => !!token.value)

  function setToken (newToken) {
    token.value = newToken
  }

  function clearToken()  {
    token.value = ''
    localStorage.removeItem('token')
  }
  const cart = ref([])

  const cartList = async () => {
    cart.value = await userService.cart()
  }
  return {token, isAuth, clearToken, setToken, cartList, cart}
})
