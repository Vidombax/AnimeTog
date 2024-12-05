import axios from "axios";

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
            const response = await axios.get(`/api/iframe/${uuid}`);
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
}

export default new RoomStore()
