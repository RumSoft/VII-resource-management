import APIService from "./APIService";

export default class ResourceService {
  static getResource(id) {
    return APIService.get(`resource/${id}`);
  }

  static editResource(res) {
    return APIService.put(`resource`, res);
  }

  static deleteResource(id) {
    return APIService.delete(`resource/${id}`);
  }

  static getList() {
    return APIService.get("resource");
  }

  static addResource(res) {
    return APIService.post("resource", res);
  }

  static splitResource(res) {
    return APIService.post("resource/split-and-update", res);
  }
}
