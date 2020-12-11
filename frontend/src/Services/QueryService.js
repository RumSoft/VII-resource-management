import APIService from "./APIService";

export default class QueryService {

    static search(request) {
        return APIService.get(`search/${request}`);
    }

}
