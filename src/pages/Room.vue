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
const isUserAuthor = ref(false);
const idUser = ref(Number(localStorage.getItem('id')));

const searchClick = async () => {
  isSearchBlocked.value = true;
  await RoomStore.getAnime(animeName, htmlFrame, isSearchBlocked);
  if (htmlFrame.value !== '') {
    await RoomStore.addIFrameToRoom(id.value, htmlFrame.value);
  }
}

const isClosed = ref(true);
const setPrivateClick = async () => {
  isClosed.value = await RoomStore.setPrivate(id.value);
}

onMounted(async () => {
  isClosed.value = await RoomStore.getPrivate(id.value);
  isRoomExist.value = await RoomStore.getRoom(id.value);
  if (isClosed.value === true) {
    console.log('Комната общедоступная');
  }
  else {
    let getAccess = await RoomStore.checkAccessToRoom(idUser.value, id.value);
    if (getAccess !== 'Доступ к этой комнате есть у пользователя') {
      isRoomExist.value = 'Такой комнаты не существует!';
    }
  }
  htmlFrame.value = await RoomStore.getIFrame(id.value);
  isUserAuthor.value = await RoomStore.checkIsUserAuthor(id.value, idUser.value);
  if (htmlFrame !== '') {
    document.getElementsByClassName('video')[0].innerHTML = htmlFrame.value;
  }
});
</script>

<template>
  <div class="container" v-if="isRoomExist === 'true'">
    <div class="player">
      <div class="search">
        <input type="text" v-model="animeName" placeholder="Введите название аниме">
        <button @click="searchClick" v-if="isSearchBlocked === false">Найти</button>
        <button v-else disabled style="cursor: wait;">Загрузка...</button>
      </div>
      <div class="video">

      </div>
    </div>
    <div class="tools">
      <div class="buttonsSettings">
        <div class="private-button-div" v-show="isUserAuthor">
          <button v-if="isClosed" @click="setPrivateClick">Сделать комнату приватной</button>
          <button v-else @click="setPrivateClick">Сделать комнату открытой</button>
        </div>
      </div>
      <div class="chat">

      </div>
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
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;
}
.player {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
}
.tools {
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
