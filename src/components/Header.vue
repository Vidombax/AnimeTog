<script setup>
import {onMounted, ref} from "vue";
import MainStore from "@/store/main.store.js";

const id = ref(Number(localStorage.getItem('id')) || 0);
const userName = ref(``);

const isMenuOpen = ref(false);

const menuVisibleClick = () => {
  isMenuOpen.value = isMenuOpen.value === false;
}

const exitFromAccount = () => {
  localStorage.removeItem('id');
  location.reload();
}

onMounted(async () => {
  if (id.value !== 0) {
    userName.value = await MainStore.getUserByID(id.value);
  }
});
</script>
<template>
  <header class="site-header">
    <h2 class="site-title"><a href="http://localhost:5173/">AnimeTogether</a></h2>
    <div class="account" v-if="id !== 0">
      <h4 @click="menuVisibleClick">{{ userName }}</h4>
    </div>
  </header>
  <div class="menu" v-show="isMenuOpen">
    <ul>
      <li><router-link to="/">Мой аккаунт</router-link></li>
      <li @click="exitFromAccount">Выход</li>
    </ul>
  </div>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
}
h2 {
  cursor: pointer;
}
a {
  font-weight: bold;
  color: #ffffff;
}
.account {
  display: flex;
  flex-direction: row;
  left: -5%;
  position: relative;
}
.account h4 {
  cursor: pointer;
}
.menu {
  display: flex;
  flex-direction: column;
  position: fixed;
  padding: 12px;
  background-color: #101010;
  border-radius: 12px;
  width: 200px;
  right: 0;
  transition: .3s linear;
  top: 11.5%;
}
ul {
  list-style-type: none;
  display: flex;
  margin-left: -15%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
li {
  font-weight: bold;
  cursor: pointer;
  transition: .3s linear;
}
li:hover {
  color: #535bf2;
}
</style>
