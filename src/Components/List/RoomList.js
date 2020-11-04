import React, { Component } from "react";
import { NotificationService, RoomService } from "../../Services";
import { RoomRow } from "../ListRows";
import EntityList from "./EntityList";
import "./index.scss";

export default class RoomList extends Component {
  state = {
    rooms: [],
  };
  componentDidMount() {
    this.fetchRooms();
  }

  fetchRooms() {
    RoomService.getList().then((result) => {
      const rooms = result && result.data;
      this.setState({ rooms });
    });
  }

  addRoomClick() {
    let roomName = prompt("Podaj nazwę nowego atrybutu");
    if (!roomName) return;

    RoomService.addRoom(roomName)
      .then(() => {
        NotificationService.success(`Dodano pokój "${roomName}"`);
        this.fetchRooms();
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się dodać pokoju");
      });
  }

  roomChanged(room) {
    RoomService.editRoom(room.id, room.name)
      .then(() => {
        NotificationService.success(
          `Pomyślnie zmieniono nazwę atrybutu`,
          ` → ${room.name}`
        );
        this.setState({
          rooms: this.state.rooms.map((x) => {
            if (x.id === room.id) x.name = room.name;
            return x;
          }),
        });
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się edytować atrybutu");
      });
  }

  roomDeleted(room) {
    RoomService.deleteRoom(room.id)
      .then(() => {
        NotificationService.success(`Usunięto atrybut ${room.name}`);
        this.setState({
          rooms: this.state.rooms.filter((x) => x.id !== room.id),
        });
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się usunąć atrybutu");
      });
  }

  render() {
    const { rooms } = this.state;
    return (
      <EntityList
        onReloadClick={() => this.fetchRooms()}
        onAddClick={() => this.addRoomClick()}
        entities={rooms}
        entityName="rooms"
        entityMapFunc={(x) => (
          <RoomRow
            onDelete={(room) => this.roomDeleted(room)}
            onChange={(room) => this.roomChanged(room)}
            key={x.id}
            room={x}
          />
        )}
        title="Pokoje"
      />
    );
  }
}
