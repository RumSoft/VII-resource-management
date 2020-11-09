import APIService from "./APIService";

export default class RequestService {

    static addRequest(
        resourceId,
        takerId,
        quantity
    ) {
        return APIService.post("trade-request", {
            ResourceId: resourceId,
            TakerId: takerId,
            Quantity: quantity
        });
    }

    static getList() {
        return APIService.get("trade-request");
    }

    static editRequest(id, action) {
        return APIService.put(`trade-request`, id, action);
    }

    static getRequest(id) {
        return APIService.get(`trade-request/${id}`);
    }

}
