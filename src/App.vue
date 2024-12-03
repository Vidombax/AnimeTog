<script setup>
  import {ref} from "vue";
  import axios from "axios";

  let animeName = ref('');
  let htmlIframe = ref('');

  const getAnime = async () => {
    try {
      const parentVideo = document.getElementsByClassName('video')[0]; // Инициализация внутри метода
      const response = await axios.get(`/api/anime`, {
        params: { animeName: animeName.value.toString().split(' ').join("-") },
      });
      htmlIframe.value = response.data;
      parentVideo.innerHTML = htmlIframe.value;
    }
    catch (e) {
      console.error(e);
    }
  };

</script>

<template>
  <div class="container">
    <div class="search">
      <input type="text" v-model="animeName" placeholder="Введите название аниме">
      <button @click="getAnime">Найти</button>
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
