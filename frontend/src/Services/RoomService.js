import APIService from "./APIService";

export default class RoomService {
  static getList() {
    return APIService.get("room");
  }

  static addRoom(room) {
    return APIService.post("room", { name: room.name, color: room.color });
  }

  static editRoom(room) {
    return APIService.put(`room`, room);
  }

  static deleteRoom(id) {
    return APIService.delete(`room/${id}`);
  }
}
