import { api } from './api.js'
import router from '@/router/index.js'

export const cartService = {
  register: (data) =>
    api.post('signup', data).then(response => {
      response.data
      router.push('/auth/login')
    }),

  login: (data) =>
    api.post('login', data).then(response => response.data).then( (data) => {
      localStorage.setItem('token', JSON.stringify(data.data.user_token))
      router.push('/')
    }),

  logout: (data) =>
    api.get('logout'),

  cart: (data) =>
    api.get('cart', data).then(response => response.data),
}
