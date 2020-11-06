import APIService from "./APIService";

export default class ResourceService {
    static getResource(id) {
        return APIService.get(`Resource/${id}`);
    }

    static editResource(id, resourceSplit, resourceSplitAmount, resourceName, resourceQuantity, resourceAttributes, resourceRoom) {
        return APIService.put(`Resource/${id}`, { split: resourceSplit, splitAmount: resourceSplitAmount, name: resourceName, quantity: resourceQuantity, attributes: resourceAttributes, room: resourceRoom });
    }

    static deleteResource(id) {
        return APIService.delete(`Resource/${id}`);
    }

    static getList() {
        return APIService.put("Resource/list");
    }

    static addResource(resourceName, resourceQuantity, resourceAttributes, resourceRoom) {
        return APIService.post("Resource/", { name: resourceName, quantity: resourceQuantity, attributes: resourceAttributes, room: resourceRoom });
    }

}
