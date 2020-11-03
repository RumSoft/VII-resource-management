import APIService from "./APIService";

export default class UserService {

    static AddUser(data) {
        return APIService.post("User/", data);
    }

    static EditUser(id, data) {
        return APIService.put(`User/{${id}}`, data);
    }
}