import APIService from "./APIService";

export default class UserService {
  static getUser(userId) {
    return APIService.get(`User/${userId}`);
  }

  static getList() {
    return APIService.get("User/list");
  }

  static addUser(user) {
    return APIService.post("User/", user);
  }

  static editUser(user) {
    return APIService.put(`User/${user.id}`, user);
  }

  static deleteUser(userId) {
    return APIService.delete(`User/${userId}`);
  }

  static resetPassword(userId) {
    return APIService.post(`User/reset-password/${userId}`);
  }
}
