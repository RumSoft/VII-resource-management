import APIService from "./APIService";

export default class AttributeService {
  static getList() {
    return APIService.get("attribute");
  }

  static addAttribute(attributeName) {
    return APIService.post("attribute", { name: attributeName });
  }

  static deleteAttribute(id) {
    return APIService.delete(`attribute/${id}`);
  }

  static editAttribute(attribute) {
    return APIService.put(`attribute`, attribute);
  }
}
