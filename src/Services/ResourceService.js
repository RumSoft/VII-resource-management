import APIService from "./APIService";

export default class ResourceService {
  static getResource(id) {
    return APIService.get(`resource/${id}`);
  }

  // static editResource(id, resourceSplit, resourceSplitAmount, resourceName, resourceQuantity, resourceAttributes, resourceRoom) {
  //     return APIService.put(`Resource/`, { split: resourceSplit, splitAmount: resourceSplitAmount, name: resourceName, quantity: resourceQuantity, attributes: resourceAttributes, room: resourceRoom });
  // }

  static deleteResource(id) {
    return APIService.delete(`resource/${id}`);
  }

  static getList() {
    return APIService.get("resource");
  }

  static addResource(
    resourceName,
    resourceQuantity,
    resourceAttributes,
    resourceRoom
  ) {
    return APIService.post("resource", {
      name: resourceName,
      quantity: resourceQuantity,
      attributes: resourceAttributes,
      room: resourceRoom,
    });
  }
}
