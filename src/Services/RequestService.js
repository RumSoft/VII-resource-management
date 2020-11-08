import APIService from "./APIService";

export default class RequestService {

    static addRequest(
        resourceId,
        takerId,
        quantity
    ) {
        return APIService.post("request", {
            ResourceId: resourceId,
            TakerId: takerId,
            Quantity: quantity
        });
    }

    static getList() {
        return APIService.get("request");
    }

    static editRequest(id, action) {
        return APIService.put(`request`, id, action);
    }

    static getRequest(id) {
        return APIService.get(`request/${id}`);
    }

}
