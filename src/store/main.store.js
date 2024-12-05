import axios from "axios";

class MainStore {
    async GetUser(email, password) {
        const response = await axios.get(`/api/account/${email}/${password}`);
        return response.data.id_user;
    }
    async getUserByID(id) {
        const response = await axios.get(`api/account/${id}`);
        return response.data.name_user;
    }
}

export default new MainStore();
