<script setup>
import {inject, ref} from 'vue';
import MainStore from "@/store/main.store.js";
import cryptoJs from "crypto-js";

const {Toast} = inject('app');
const {modalActiveClick} = inject('main');

const login = ref(``);
const email = ref(``);
const password = ref(``);

const loginClick = async () => {
  try {
    const encodePassword = cryptoJs.enc.Base64.stringify(cryptoJs.enc.Utf8.parse(`${password.value}`));
    const userId = await MainStore.GetUser(email.value, encodePassword);
    localStorage.setItem('id', userId);
    location.reload();
  } catch (e) {
    if (e.response && e.response.status === 401) {
      await Toast.fire({
        icon: "error",
        title: "Неверный email или пароль. Попробуйте ещё раз."
      });
    } else {
      await Toast.fire({
        icon: "error",
        title: "Произошла ошибка. Обратитесь к администратору"
      });
    }
  }
};

const registrationClick = async () => {
  try {

  }
  catch (e) {
    if (e.response && e.response.status === 401) {
      await Toast.fire({
        icon: "error",
        title: "На эту почту уже зарегистрирован аккаунт!"
      });
    } else {
      await Toast.fire({
        icon: "error",
        title: "Произошла ошибка. Обратитесь к администратору"
      });
    }
  }
}

const isRegistration = ref(true);
const isRegistrationClickCheck = () => {
  isRegistration.value = isRegistration.value === false;
}
</script>

<template>
  <div class="modal_authorization">
    <div class="header">
      <h3 v-if="isRegistration">Авторизоваться</h3>
      <h3 v-else>Регистрация</h3>
      <box-icon name='x' color='#ffffff' style="cursor: pointer;" @click="modalActiveClick"></box-icon>
    </div>
    <div class="items" v-if="isRegistration">
      <input type="email" placeholder="Почта" v-model="email">
      <input type="password" placeholder="Пароль" v-model="password">
      <button @click="loginClick">Авторизоваться</button>
      <p @click="isRegistrationClickCheck">Зарегистрироваться</p>
    </div>
    <div class="items" v-else>
      <input type="text" placeholder="Логин" v-model="login">
      <input type="email" placeholder="Почта" v-model="email">
      <input type="password" placeholder="Пароль" v-model="password">
      <button @click="registrationClick">Зарегистрироваться</button>
      <p @click="isRegistrationClickCheck">Авторизоваться</p>
    </div>
  </div>
</template>

<style scoped>
.modal_authorization {
  display: flex;
  position: fixed;
  flex-direction: column;
  gap: 12px;
  left: 37%;
  top: 30%;
  background-color: #101010;
  padding: 36px;
  border-radius: 12px;
  width: 20%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.items {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
}
.items p {
  cursor: pointer;
}
.items input {
  font-size: large;
  padding: 4px;
}
</style>
