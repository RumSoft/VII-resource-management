import APIService from "./APIService";

export default class AttributeService {
  static getList() {
    return APIService.get("attribute");
  }

  static addAttribute(attribute) {
    return APIService.post("attribute", { name: attribute.name, color: attribute.color });
  }

  static deleteAttribute(id) {
    return APIService.delete(`attribute/${id}`);
  }

  static editAttribute(attribute) {
    return APIService.put(`attribute`, attribute);
  }
}
