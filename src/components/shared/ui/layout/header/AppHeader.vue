<script setup>
import { useUserStore } from '@/stores/user.js'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { token, isAuth } = storeToRefs(userStore)
const { clearToken, setToken } = userStore

const router = useRouter()

const handleLogout = async () => {
  try {
    console.log('i has token', token.value)
    await router.push({ name: 'logout' })
    console.log('i has now token', token.value)
    clearToken()
    console.log("exit success; isAuth =", isAuth.value)
    router.push({ name: 'login' })
  } catch (error) {
    console.error("Cant logout!", error);
    clearToken()
    router.push({ name: 'login' })
  }
}

</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Главная</RouterLink>
        <RouterLink v-if="!isAuth" to="/auth/login">Вход</RouterLink>
        <RouterLink v-if="!isAuth" to="/auth/register">Регистрация</RouterLink>
        <RouterLink href="#" v-if="isAuth" to="/cart">Корзина</RouterLink>
        <a href="#" v-if="isAuth" @click.prevent="handleLogout">Выйти</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
}
nav {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 20px;
  width: 100%;
}
</style>
