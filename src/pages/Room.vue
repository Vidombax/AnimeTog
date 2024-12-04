<script setup>
import {ref} from "vue";
import { useRoute } from 'vue-router'

import RoomStore from "@/store/room.store.js";

const route = useRoute();
const id = ref(Number(route.params.id));

let animeName = ref('');
let htmlFrame = ref('');

const searchClick = async () => {
  await RoomStore.getAnime(animeName, htmlFrame);
}
</script>

<template>
  <div class="container">
    <div class="search">
      <input type="text" v-model="animeName" placeholder="Введите название аниме">
      <button @click="searchClick">Найти</button>
    </div>
    <div class="video">

    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
}
.search {
  display: flex;
  flex-direction: row;
  gap: 24px;
}
.search input {
  font-size: large;
}
.video {
  width: 607px;
  height: 360px;
}
</style>