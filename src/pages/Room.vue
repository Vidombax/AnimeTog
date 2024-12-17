<script setup>
import {inject, nextTick, onMounted, ref, watch} from "vue";
import { useRoute } from 'vue-router';
import Swal from "sweetalert2";
import mqtt from 'mqtt';

import RoomStore from "@/store/room.store.js";
import Message from "../components/room/Message.vue";
import axios from "axios";
import Video from "../components/room/Video.vue";
const {Toast} = inject('app');

const route = useRoute();
const id = ref(route.params.id);

const client = mqtt.connect("wss://broker.hivemq.com:8000/mqtt");
const topic = `chat/${id.value}`;

const isRoomExist = ref('');
let animeName = ref('');
let htmlFrame = ref('');
let isSearchBlocked = ref(false);
const isUserAuthor = ref(false);
const idUser = ref(Number(localStorage.getItem('id')));
const chat = ref([]);

const searchClick = async () => {
  isSearchBlocked.value = true;
  await RoomStore.getAnime(animeName, htmlFrame, isSearchBlocked);
  if (htmlFrame.value !== '') {
    await RoomStore.addIFrameToRoom(id.value, htmlFrame.value);
    const iframeData = ref({
      typeMQTT: 1,
      iframe: htmlFrame.value,
      uuidRoom: id.value
    });
    client.publish(topic, JSON.stringify(iframeData.value));
  }
}

const isOpened = ref(true);
const setPrivateClick = async () => {
  isOpened.value = await RoomStore.setPrivate(id.value);
}

const shareLinkClick = async () => {
  await RoomStore.shareLink(idUser, Toast);
}

const comment = ref('');
const messageData = ref({});
const createCommentClick = async () => {
  if (comment.value.trim() === "") {
    await Toast.fire({
      icon: "error",
      title: "Введите сообщение!",
    });
  } else {
    let date = new Date();
    messageData.value = {
      typeMQTT: 0,
      idUser: idUser.value,
      idRoom: id.value,
      comment: comment.value,
      name_user: localStorage.getItem('name'),
      date_message: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    };
    client.publish(topic, JSON.stringify(messageData.value));
    comment.value = "";
  }
};

client.on("message", async (receivedTopic, payload) => {
  if (receivedTopic === topic) {
    const newMessage = JSON.parse(payload.toString());
    console.log(newMessage)
    switch (newMessage.typeMQTT) {
      case 0:
        //Добавление сообщение в чат
        if (newMessage.idUser === idUser.value) {
          await RoomStore.createMessage(newMessage.idUser, newMessage.idRoom, newMessage.comment);
          chat.value.push(newMessage);
        }
        else {
          chat.value.push(newMessage);
        }
        await nextTick();
        await RoomStore.scrollToBottom('messages');
        break;
      case 1:
        //Добавление iframe в комнату
        htmlFrame.value = newMessage.iframe;
        await nextTick();
        iframe.value = document.querySelector('iframe');
        break;
      case 2:
        //Запуск плеера
        break;
      case 3:
        //Стоп плеера
        break;
    }
  }
});

const connection = ref(false);
client.on("connect", () => {
  console.log('MQTT connected:', client.connected);
  connection.value = true;
});

const loadComment = async () => {
  const response = await axios.get(`/api/message/${id.value}`);
  chat.value = response.data;
}

watch(connection, async () => {
  if (connection.value === true) {
    await nextTick();
    const inputMessages = document.getElementsByClassName('input-text')[0];
    if (inputMessages) {
      inputMessages.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          createCommentClick();
        }
      });
    }
  }
});

onMounted(async () => {
  if (idUser.value !== 0) {
    isOpened.value = await RoomStore.getPrivate(id.value);
    if (isOpened.value === false) {
      await RoomStore.giveAccessToUser(idUser.value, id.value);
    }

    isRoomExist.value = await RoomStore.getRoom(id.value);

    if (isOpened.value === true) {
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

    await loadComment();

    document.getElementsByClassName('messages')[0].scrollTo({
      top: document.getElementsByClassName('messages')[0].scrollHeight,
    });

    client.subscribe(topic);
  }
  else {
    Swal.fire({
      title: "Ошибка доступа",
      text: "Пожалуйста авторизуйтесь",
      icon: "error",
      showCancelButton: false,
      confirmButtonColor: "#1a1a1a",
      confirmButtonText: "Авторизоваться"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem('redirectUrl', location.href);
        location.replace(`${import.meta.env.VITE_HOST}`);
      }
    });
  }
});
</script>

<template>
  <div class="container" v-if="isRoomExist === 'true'">
    <div class="player">
      <div class="search" v-show="isUserAuthor">
        <input type="text" v-model="animeName" placeholder="Введите название аниме">
        <button @click="searchClick" v-if="isSearchBlocked === false">Найти</button>
        <button v-else disabled style="cursor: wait;">Загрузка...</button>
      </div>
      <Video
          :inner-html="htmlFrame"
      />
    </div>
    <div class="tools">
      <div class="buttonsSettings">
        <div class="private-button-div" v-show="isUserAuthor">
          <button v-if="isOpened" @click="setPrivateClick">Сделать комнату приватной</button>
          <button v-else @click="setPrivateClick">Сделать комнату открытой</button>
        </div>
        <div class="share-button-div">
          <button @click="shareLinkClick">Поделиться ссылкой</button>
        </div>
      </div>
      <div class="chat">
        <div class="messages" id="messages">
          <Message v-for="item in chat"
                   :key="item.id"
                   :message="item.comment"
                   :name="item.name_user"
                   :time="item.date_message"
          />
        </div>
        <div class="chat-inputs">
          <input
              type="text"
              placeholder="Введите текст"
              class="input-text"
              v-model="comment"
              maxlength="150"
              v-if="connection"
          >
          <input
              type="text"
              placeholder="Загрузка..."
              class="input-text"
              v-model="comment"
              v-else
              disabled
              style="cursor: progress"
          >
          <box-icon
              name='send'
              type='solid'
              color='#ffffff'
              style="cursor: pointer;"
              @click="createCommentClick"
              v-if="connection"
          />
          <box-icon
              name='send'
              type='solid'
              color='#DCDCDC'
              style="cursor: progress"
              v-else
          />
        </div>
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
.buttonsSettings {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
.chat {
  background-color: #101010;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 500px;
  height: 560.5px;
}
.messages {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
  background-color: #242424;
  height: 450px;
  width: 455px;
  border-radius: 6px;
  margin-bottom: 15%;
}
.messages::-webkit-scrollbar {
  width: 8px;
}

.messages::-webkit-scrollbar-track {
  background: rgba(241, 241, 241, 0.0);
}

.messages::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.messages::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
.chat-inputs {
  display: flex;
  position: absolute;
  bottom: 0;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}
.chat-inputs input {
  width: 300px;
  height: 30px;
  font-size: large;
}
.search {
  display: flex;
  flex-direction: row;
  gap: 24px;
  background-color: #242424;
}
.search input {
  font-size: large;
}
</style>
