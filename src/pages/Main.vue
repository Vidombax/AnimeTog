<script setup>
import {ref, inject, provide} from "vue";
import RoomStore from "@/store/room.store.js";
import ModalAuthorization from "../components/main/ModalAuthorization.vue";

const {Toast} = inject('app')

const id = ref(Number(localStorage.getItem('id')) || 0);

const isModalOpen = ref(false);

const modalActiveClick = () => {
  isModalOpen.value = isModalOpen.value === false;
}

provide('main', {
  modalActiveClick
});

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
  <ModalAuthorization v-show="isModalOpen"/>
  <button @click="modalActiveClick" v-if="id === 0">Авторизоваться</button>
  <button v-else @click="createRoomClick">Создать комнату</button>
</template>

<style scoped>

</style>
