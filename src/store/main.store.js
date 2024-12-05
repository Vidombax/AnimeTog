import axios from "axios";

class MainStore {
    async GetUser(email, password) {
        const response = await axios.get(`/api/account/${email}/${password}`);
        return response.data.id_user;
    }
    async getUserByID(id) {
        const response = await axios.get(`/api/account/${id}`);
        return response.data.name_user;
    }
    async createUser(login, email, password) {
        try {
            const response = await axios.post(`/api/account/`, {
                login: login,
                email: email,
                password: password
            });
            return response.data.id_user;
        }
        catch (e) {
            console.error(e);
        }
    }
}

export default new MainStore();
