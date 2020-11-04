import APIService from "./APIService";

export default class RoomService {
  static getList() {
    return APIService.get("Room/list");
  }

  static addRoom(roomName) {
    return APIService.post("Room/", { name: roomName });
  }

  static editRoom(id, roomName) {
    return APIService.put(`Room/${id}`, { name: roomName });
  }

  static deleteRoom(id) {
    return APIService.delete(`Room/${id}`);
  }

}
