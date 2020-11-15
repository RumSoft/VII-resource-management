import { EventService } from ".";
import Events from "./Events";

export default class APIServiceQueueHandler {
  static activeRequests = 0;

  static requestStarted() {
    if (this.activeRequests === 0) {
      EventService.Emit(Events.API_RequestStarted);
    }

    this.activeRequests += 1;
  }

  static requestEnded() {
    this.activeRequests -= 1;

    if (this.activeRequests === 0) {
      EventService.Emit(Events.API_RequestEnded);
    }
  }
}
