import axios from "axios";
import Events from "./Events";
import EventService from "./EventService";
import APIServiceQueueHandler from "./APIServiceQueueHandler";
import { NotificationService } from ".";

const authToken = "auth_token";
const role = "role";

export default class APIService {
  static API_URL = "https://api.rum.software";

  static get(address) {
    this._requestStarted();
    return axios
      .get(`${this.API_URL}/${address}`, {
        headers: this._getHeaders(),
      })
      .catch(this._handleRequestEnded_Fail)
      .catch(this._handle401)
      .catch(this._handle403)
      .then(this._handleRequestEnded_Success);
  }

  static post(address, data) {
    this._requestStarted();
    return axios
      .post(`${this.API_URL}/${address}`, data, {
        headers: this._getHeaders(),
      })
      .catch(this._handleRequestEnded_Fail)
      .catch(this._handle401)
      .catch(this._handle403)
      .then(this._handleRequestEnded_Success);
  }

  static put(address, data) {
    this._requestStarted();
    return axios
      .put(`${this.API_URL}/${address}`, data, {
        headers: this._getHeaders(),
      })
      .catch(this._handleRequestEnded_Fail)
      .catch(this._handle401)
      .catch(this._handle403)
      .then(this._handleRequestEnded_Success);
  }

  static delete(address) {
    this._requestStarted();
    return axios
      .delete(`${this.API_URL}/${address}`, {
        headers: this._getHeaders(),
      })
      .catch(this._handleRequestEnded_Fail)
      .catch(this._handle401)
      .catch(this._handle403)
      .then(this._handleRequestEnded_Success);
  }

  static _getHeaders() {
    let token = window.localStorage.getItem(authToken);
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static _handle401(e) {
    if (e.response.status === 401) {
      EventService.Emit(Events.Auth_Unauthorized);
      window.localStorage.removeItem(authToken);
      window.localStorage.removeItem(role);
    } else throw e;
  }

  static _handle403(e) {
    if (e.response.status === 403) {
      NotificationService.error("Nie masz prawa do wykonania tej akcji");
    } else throw e;
  }

  static _requestStarted() {
    APIServiceQueueHandler.requestStarted();
  }

  static _handleRequestEnded_Fail(e) {
    APIServiceQueueHandler.requestEnded();
    throw e;
  }

  static _handleRequestEnded_Success(res) {
    APIServiceQueueHandler.requestEnded();
    return res;
  }
}
