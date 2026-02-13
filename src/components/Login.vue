<script setup>
import { useLoginDataStore} from "@/stores/loginData.js";
import { storeToRefs } from 'pinia';
import {computed} from "vue";

const store = useLoginDataStore();

// const username = computed(() => store.username)
// const password = computed(() => store.password)

const { username, password } = storeToRefs(store);
const { login } = store;
</script>

<template>
  <form class="login" @submit.prevent="login">
    <h1>Войти</h1>
    <label>Имя пользователя</label>
    <input type="text" required v-model="username">
    <label>Пароль</label>
    <input type="password" required v-model="password">
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
