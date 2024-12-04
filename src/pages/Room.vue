<script setup>
import {onMounted, ref} from "vue";
import { useRoute } from 'vue-router'

import RoomStore from "@/store/room.store.js";

const route = useRoute();
const id = ref(route.params.id);

const isRoomExist = ref('');
let animeName = ref('');
let htmlFrame = ref('');
let isSearchBlocked = ref(false);

const searchClick = async () => {
  isSearchBlocked.value = true;
  await RoomStore.getAnime(animeName, htmlFrame, isSearchBlocked);
}

onMounted(async () => {
  isRoomExist.value = await RoomStore.getRoom(id.value);
});
</script>

<template>
  <div class="container" v-if="isRoomExist === 'true'">
    <div class="search">
      <input type="text" v-model="animeName" placeholder="Введите название аниме">
      <button @click="searchClick" v-if="isSearchBlocked === false">Найти</button>
      <button v-else disabled style="cursor: wait;">Загрузка...</button>
    </div>
    <div class="video">

    </div>
  </div>
  <div class="container" v-else>
    <div class="search">
      <h2>{{ isRoomExist }}</h2>
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