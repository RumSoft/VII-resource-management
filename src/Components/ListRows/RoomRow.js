import React, { Component } from "react";
import { NotificationService } from "../../Services";
import RoomService from "../../Services/RoomService";
import "./RoomRow.scss";

export default class RoomRow extends Component {
  handleEditClick() {
    const { name, id } = this.props.data;

    let newRoomName = prompt("Podaj nową nazwę pokoju.", name);

    if (newRoomName !== null) {
      RoomService.editAttribute(id, newRoomName)
        .then(() => {
          NotificationService.success(
            `Pomyślnie zmieniono nazwę pokoju`,
            `${name} → ${newRoomName}`
          );
          this.props.onChange &&
            this.props.onChange({ id: id, name: newRoomName });
        })
        .catch((e) => {
          NotificationService.apiError(e, "Nie udało się edytować atrybutu");
        });
    }
  }

  handleDeleteClick() {
    const { id, name } = this.props.data;
    RoomService.deleteAttribute(id)
      .then((res) => {
        NotificationService.info(`Usunięto pokój ${name}`);
        this.props.onDelete && this.props.onDelete(id);
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się usunąć atrybutu");
      });
  }

  render() {
    const { name, id } = this.props.data;
    return (
      <div>
        {id}&gt; {name}
        <button onClick={() => this.handleEditClick()}>Edytuj</button>
        <button onClick={() => this.handleDeleteClick()}>Usuń</button>
      </div>
    );
  }
}