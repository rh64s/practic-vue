import { defineStore} from "pinia";
import {ref} from "vue";
import { api } from "../api";

export const useLoginDataStore = defineStore('loginData', () => {
  const username = ref("")
  const password = ref("")
  const token = ref("")
  function login() {
    const userData = {
      username: username,
      password: password
    };

    api.post("login", userData).then((res) => {
      token.value = res.data.data.user_token
    });

    localStorage.setItem("token", JSON.stringify(token.value));

  }

  return { username, password, login }
})

