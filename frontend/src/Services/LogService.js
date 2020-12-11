import { APIService } from ".";
import qs from "query-string";

export default class LogService {
  static get(level = 3, length = 100) {
    const params = qs.stringify({
      LogLevel: level,
      length,
    });
    return APIService.get(`log?${params}`);
  }
}
