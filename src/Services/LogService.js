import { APIService, EventService } from ".";
import Events from "./Events";
import qs from "query-string";

const authTokenKey = "auth_token";
const roleKey = "role";

export default class LogService {
  static get(level = 3, length = 100) {
    const params = qs.stringify({
      LogLevel: level,
      length,
    });
    return APIService.get(`log?${params}`);
  }
}
