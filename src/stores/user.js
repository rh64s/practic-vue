import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')

  const isAuthenticated = computed(() => !!token.value);

  function authRequest() {

  }

})
