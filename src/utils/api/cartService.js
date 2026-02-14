import { api } from './api.js'
import router from '@/router/index.js'


export const cartService = {
  register: (data) =>
    api.post('signup', data).then(response => response.data).then( (data) => {
      console.log(response)
      localStorage.setItem('token', JSON.stringify(data.data.user_token))
      router.push('/')
    }),

  login: (data) =>
    api.post('login', data).then(response => response.data).then( (data) => {
      console.log(response)
      localStorage.setItem('token', JSON.stringify(data.data.user_token))
      router.push('/')
    }),

  logout: (data) =>
    api.get('logout').then(response => {
      localStorage.removeItem('token')
      router.push('/login')
    }),

  cart: (data) =>
    api.get('cart', data).then(response => response.data),
}
