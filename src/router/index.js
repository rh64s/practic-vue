import { createWebHistory, createRouter } from 'vue-router'

import HomeView from "@/views/HomeView.vue";
import LoginForm from '@/components/Auth/LoginForm.vue'
import store from '@/store/index.js'

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return
  }
  next('/login')
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginForm,
      beforeEnter: ifNotAuthenticated,
    }
  ],
})

export default router
