import axios from "axios";
import { nextTick } from "vue";

class RoomStore {
    async getAnime(animeName, htmlFrame, isSearchBlocked)  {
        try {
            const parentVideo = document.getElementsByClassName('video')[0];
            const response = await axios.get(`/api/anime`, {
                params: { animeName: animeName.value.toString().split(' ').join("-") },
            });
            htmlFrame.value = response.data;
            parentVideo.innerHTML = htmlFrame.value;
            isSearchBlocked.value = false;
        }
        catch (e) {
            console.error(e);
        }
    }
    async createRoom(id) {
        try {
            const response = await axios.post(`/api/room`, {
                id: id,
            });
            return response.data.uuid_room;
        }
        catch (e) {
            console.log(e);
        }
    }
    async getRoom(uuid) {
        try {
            const response = await axios.get(`/api/room/${uuid}`);
            return response.data.answer;
        } catch (e) {
            console.log(e);
            return 'Такой комнаты не существует';
        }
    }
    async addIFrameToRoom(uuid, iframe) {
        try {
            const response = await axios.put('/api/room', {
                uuid: uuid,
                iframe: iframe
            });
            return response.data;
        }
        catch (e) {
            console.log(e);
        }
    }
    async getIFrame(uuid) {
        try {
            const response = await axios.get(`/api/info-room/${uuid}`);
            return response.data.iframe;
        }
        catch (e) {
            console.log(e);
        }
    }
    async setPrivate(uuid) {
        try {
            const response = await axios.put(`/api/room-visible`, {
                uuid: uuid
            });
            return response.data;
        }
        catch (e) {
            console.log(e);
        }
    }
    async getPrivate(uuid) {
        try {
            const response = await axios.get(`/api/info-room/${uuid}`);
            return response.data.is_opened;
        }
        catch (e) {
            console.log(e);
        }
    }
    async checkAccessToRoom(id, uuid) {
        try {
            const response = await axios.get(`/api/access-to-room/${id}/${uuid}`);
            return response.data.answer;
        }
        catch (e) {
            console.log(e);
        }
    }
    async checkIsUserAuthor(uuid, id) {
        try {
            const response = await axios.get(`/api/info-room/${uuid}`);
            if (response.data.id_user === id) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async giveAccessToUser(id, uuid) {
        try {
            const url = new URL(window.location.href);
            const hasShareParam = url.searchParams.has('share');

            if (hasShareParam) {
                const response = await axios.post(`/api/give-access`, {
                    uuid: uuid,
                    id: id
                });

                url.searchParams.delete('share');
                window.history.replaceState({}, '', url.toString());
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async createMessage(id, uuid, message) {
        try {
            const response = await axios.post(`/api/message`, {
               id: id,
               uuid: uuid,
               message: message
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    async scrollToBottom(element) {
        let div = document.getElementById(element);
        if (div) {
            await nextTick();
            div.scrollTop = div.scrollHeight;
        }
        else {
            console.error(`Не нашел div с чатом`);
        }
    }
    async shareLink(idUser, Toast)  {
        navigator.clipboard.writeText(`${location.href}?share=${idUser.value}`)
            .then(() => {
                Toast.fire({
                    icon: "success",
                    title: "Ссылка скопирована!"
                });
            })
            .catch(err => {
                console.log('Something went wrong', err);
            });
    }
}

export default new RoomStore()
