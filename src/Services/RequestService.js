import APIService from "./APIService";

export default class RequestService {

    static addRequest(request) {
        return APIService.post("trade-request", request);
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
