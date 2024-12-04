import axios from "axios";

class MainStore {
    async GetUser(email, password) {
        const response = await axios.get(`/api/account/${email}/${password}`);
        return response.data.id_user;
    }
}

export default new MainStore();