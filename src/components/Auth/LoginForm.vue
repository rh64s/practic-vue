<script setup>

import { userService } from '@/utils/api/userService.js'
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.js'

const loginInfo = reactive({
  email: '',
  password: ''
})

const userStore = useUserStore()
const { token } = storeToRefs(userStore)
const { setToken } = userStore
const loginAction = async () => {
  const response = await userService.login(loginInfo)
  userStore.setToken(response.user_token)
}

</script>

<template>
  <form class="login" @submit.prevent="loginAction">
    <h1>Войти</h1>
    <label>Ваша почта</label>
    <input type="text" required v-model="loginInfo.email">
    <label>Пароль</label>
    <input type="password" required v-model="loginInfo.password">
    <hr>
    <button type="submit">Логин</button>
  </form>
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
