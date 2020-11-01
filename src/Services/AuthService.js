import APIService from './APIService';

const authToken = 'auth_token';

export default class AuthService {

    static login(userData) {
        return APIService.post('auth/login', userData)
            .then(response => {
                this.handleLogin(response.data);

            });
    }

    static handleLogin(data) {
        window.localStorage.setItem(authToken, `${data.token.accessToken}`);
        const params = new URLSearchParams(window.location.search);
        const requestedURL = params.get('requested_url');
        if (requestedURL !== null) {
            window.location = requestedURL;
        }
        else {
            window.location = "/";
        }

    }

    static checkIfLogged() {
        return window.localStorage.getItem(authToken) !== null

    }

}