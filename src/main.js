import { createApp } from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory} from 'vue-router'
import 'boxicons'
import VueTheMask from 'vue-the-mask'

import Main from "@/pages/Main.vue";
import Room from '@/pages/Room.vue';

const app = createApp(App);

const routes = [
    { path: '/', name: 'Main', component: Main },
    { path: '/room/:id', name: 'Room', component: Room },
]

app.component('box-icons');

const router = createRouter({
    history: createWebHistory(),
    routes
})

app.use(router);
app.use(VueTheMask);
app.mount('#app');
