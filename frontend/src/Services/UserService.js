import APIService from "./APIService";

export default class UserService {
  static getUser(userId) {
    return APIService.get(`User/${userId}`);
  }

  static getList() {
    return APIService.get("user");
  }

  static addUser(user) {
    return APIService.post("user", user);
  }

  static editUser(user) {
    return APIService.put(`user`, user);
  }

  static deleteUser(userId) {
    return APIService.delete(`user/${userId}`);
  }

  static resetPassword(userId) {
    return APIService.get(`user/reset-password/${userId}`);
  }

  static newPassword(token, password) {
    return APIService.post(`user/new-password`, {
      token: token,
      password: password,
    });
  }
}
