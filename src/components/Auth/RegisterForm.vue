<script setup>

import { cartService } from '@/utils/api/cartService.js'
import { reactive } from 'vue'

const registerData = reactive({
  fio: '',
  email: '',
  password: '',
})
const registerAction = () => {
  cartService.register(registerData)
}

</script>

<template>
  <form class="login" @submit.prevent="registerAction">
    <h1>Войти</h1>
    <label>Ваше ФИО</label>
    <input type="text" required v-model="registerData.fio">
    <label>Ваша почта</label>
    <input type="email" required v-model="registerData.email">
    <label>Пароль</label>
    <input type="password" required v-model="registerData.password">
    <hr>
    <button type="submit">Регистрация</button>
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
