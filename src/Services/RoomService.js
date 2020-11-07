import APIService from "./APIService";

export default class RoomService {
  static getList() {
    return APIService.get("room");
  }

  static addRoom(roomName) {
    return APIService.post("room", { name: roomName });
  }

  static editRoom(room) {
    return APIService.put(`room`, room);
  }

  static deleteRoom(id) {
    return APIService.delete(`room/${id}`);
  }
}
