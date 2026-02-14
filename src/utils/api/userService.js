import { api } from './api.js'
import router from '@/router/index.js'

export const userService = {
  register: (data) =>
    api.post('signup', data).then(response => response.data).then( (data) => {
      localStorage.setItem('token', JSON.stringify(data.data.user_token))
      router.push('/')
      return data.data
    }),

  login: (data) =>
    api.post('login', data).then(response => response.data).then( (data) => {
      localStorage.setItem('token', JSON.stringify(data.data.user_token))
      router.push('/')
      return data.data
    }),

  logout: (data) =>
    api.get('logout').then(response => {
      localStorage.removeItem('token')
      router.push('/login')
    }),

  cart: (data) =>
    api.get('cart', data).then(response => response.data),
}
