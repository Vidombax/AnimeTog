import axios from "axios";

class RoomStore {
    async getAnime(animeName, htmlFrame, isSearchBlocked)  {
        try {
            const parentVideo = document.getElementsByClassName('video')[0]; // Инициализация внутри метода
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

}

export default new RoomStore()