<script setup>

import { cartService } from '@/utils/api/cartService.js'
import { reactive } from 'vue'

const loginInfo = reactive({
  email: '',
  password: ''
})
const loginAction = () => {
  cartService.login(loginInfo)
  console.log("залогинились")
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
