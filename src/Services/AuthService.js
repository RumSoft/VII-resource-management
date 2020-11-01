import APIService from "./APIService";

const authToken = "auth_token";
const roleToken = "role_token";

export default class AuthService {
  static login(userData) {
    return APIService.post("auth/login", userData).then((response) => {
      this.handleLogin(response.data);
    });
  }

  static handleLogin(data) {
    window.localStorage.setItem(authToken, `${data.token.accessToken}`);
    window.localStorage.setItem(roleToken, `${data.role}`);

    const params = new URLSearchParams(window.location.search);
    const requestedURL = params.get("requested_url");
    if (requestedURL !== null) {
      window.location = requestedURL;
    } else {
      window.location = "/";
    }
  }

  static isLogged() {
    return window.localStorage.getItem(authToken) !== null;
  }

  static logout() {
    window.localStorage.removeItem(authToken);
    window.localStorage.removeItem(roleToken);
    window.location = "/";
  }
}