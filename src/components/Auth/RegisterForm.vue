<script setup>

import { userService } from '@/utils/api/userService.js'
import { reactive } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { storeToRefs } from 'pinia'

const registerData = reactive({
  fio: '',
  email: '',
  password: '',
})

const userStore = useUserStore()
const { token } = storeToRefs(userStore)
const { setToken } = userStore

const registerAction = async () => {
  const response = await userService.register(registerData)
  userStore.setToken(response.user_token)
}
</script>

<template>
  <form class="login" @submit.prevent="registerAction">
    <h1>Регистрация</h1>
    <label>Ваше ФИО</label>
    <input type="text" required v-model="registerData.fio">
    <label>Ваша почта</label>
    <input type="email" required v-model="registerData.email">
    <label>Пароль</label>
    <input type="password" required v-model="registerData.password">
    <hr>
    <button type="submit">Регистрация</button>
  </form>
  <RouterLink to="/auth/login">У вас есть аккаунт?</RouterLink>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 10px;
  margin: 0 auto;
}

.login input, button {
  border: 1px solid black;
  border-radius: 5px;
}

hr {
  margin: 10px 0;
}
</style>
