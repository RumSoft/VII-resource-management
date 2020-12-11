import { APIService, EventService } from ".";
import Events from "./Events";

const authTokenKey = "auth_token";
const roleKey = "role";

export default class AuthService {
  static login(userData) {
    return APIService.post("auth/login", userData).then((response) => {
      let data = response.data;
      const { token, role } = data;

      window.localStorage.setItem(authTokenKey, token);
      window.localStorage.setItem(roleKey, role);
      EventService.Emit(Events.Auth_Login);
    });
  }

  static isLogged() {
    return window.localStorage.getItem(authTokenKey) !== null;
  }

  static isAdmin() {
    return window.localStorage.getItem(roleKey) === "Admin";
  }

  static logout() {
    window.localStorage.removeItem(authTokenKey);
    window.localStorage.removeItem(roleKey);
    EventService.Emit(Events.Auth_Logout);
  }
}
