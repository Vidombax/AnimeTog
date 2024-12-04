<script setup>
import {ref, inject} from "vue";
import MainStore from "@/store/main.store.js";
import RoomStore from "@/store/room.store.js";

const {Toast} = inject('app')

const id = ref(Number(localStorage.getItem('id')) || 0);

const email = 'kirilka360@gmail.com';
const password = '1234';

const loginClick = async () => {
  try {
    const userId = await MainStore.GetUser(email, password);
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


const createRoomClick = async () => {
  try {
    const uuid = await RoomStore.createRoom(id.value);
    location.replace(`http://localhost:5173/room/${uuid}`);
  } catch (e) {
    if (e.response && e.response.status === 400) {
      await Toast.fire({
        icon: "error",
        title: "Не удалось создать комнату"
      });
    } else {
      await Toast.fire({
        icon: "error",
        title: "Произошла ошибка. Обратитесь к администратору"
      });
    }
  }
}
</script>

<template>
  <button @click="loginClick" v-if="id === 0">Авторизоваться</button>
  <button v-else @click="createRoomClick">Создать комнату</button>
</template>

<style scoped>

</style>