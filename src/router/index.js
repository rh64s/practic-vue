import { createWebHistory, createRouter } from 'vue-router'

import HomeView from "@/views/HomeView.vue";
import LoginForm from '@/components/Auth/LoginForm.vue'
import AuthView from '@/views/AuthView.vue'
import RegisterForm from '@/components/Auth/RegisterForm.vue'
import CartView from '@/views/CartView.vue'
// import store from '@/store/index.js'
// const ifNotAuthenticated = (to, from, next) => {
//   if (!store.getters.isAuthenticated) {
//     next()
//     return
//   }
//   next('/')
// }
//
// const ifAuthenticated = (to, from, next) => {
//   if (store.getters.isAuthenticated) {
//     next();
//     return
//   }
//   next('/login')
// }

function checkToken() {
  return localStorage.getItem('token') !== null || localStorage.getItem('token') !== ''
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      children: [
        {
          path: '/auth/login',
          name: 'login',
          component: LoginForm,
        },
        {
          path: '/auth/register',
          name: 'register',
          component: RegisterForm
        },
        {
          path: '/auth/logout',
          name: 'logout',
          redirect: '/login',
        }
      ]
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
      beforeEnter: (to, from, next) => {
        if (checkToken()) {
          return next({name: 'login'})
        } else {
          next()
        }
      }
    }
  ],
})

export default router
