import APIService from "./APIService";

export default class UserService {
  static getUser() {
    return APIService.get(`User/${id}`);
  }

  static editUser(id, userFirstName, userLastName, userEmailAddress) {
    return APIService.put(`User/${id}`, { firstName: userFirstName, 
        lastName: userLastName, emailAddress: userEmailAddress});
  }

  static deleteUser(id) {
    return APIService.delete(`User/${id}`);
  }

  static getList() {
    return APIService.get("User/list");
  }

  static addUser(id, userFirstName, userLastName, userEmailAddress) {
    return APIService.post(`User/${id}`, { firstName: userFirstName, 
        lastName: userLastName, emailAddress: userEmailAddress});
  }

  //todo
  //reset password
  //new password

}
