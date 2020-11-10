import APIService from "./APIService";

export default class RequestService {

    static addRequest(
        requestId,
        takerId,
        quantity
    ) {
        return APIService.post("trade-request", {
            RequestId: requestId,
            TakerId: takerId,
            Quantity: quantity
        });
    }

    static getList() {
        return APIService.get("trade-request");
    }

    static editRequest(request) {
        return APIService.put(`trade-request`, request);
    }

    static getRequest(id) {
        return APIService.get(`trade-request/${id}`);
    }

}
