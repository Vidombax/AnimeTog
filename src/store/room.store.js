import axios from "axios";

class RoomStore {
    async getAnime(animeName, htmlFrame)  {
        try {
            const parentVideo = document.getElementsByClassName('video')[0]; // Инициализация внутри метода
            const response = await axios.get(`/api/anime`, {
                params: { animeName: animeName.value.toString().split(' ').join("-") },
            });
            htmlFrame.value = response.data;
            parentVideo.innerHTML = htmlFrame.value;
        }
        catch (e) {
            console.error(e);
        }
    }
}

export default new RoomStore()