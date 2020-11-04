import React, { Component } from "react";
import { Tooltip } from "@material-ui/core";
import "./RoomRow.scss";

export default class RoomRow extends Component {
  handleEditClick() {
    const { name, id } = this.props.room;
    const newRoomName = prompt("Podaj nową nazwę atrybutu.", name);
    newRoomName &&
      this.props.onChange &&
      this.props.onChange({ id: id, name: newRoomName });
  }

  handleDeleteClick() {
    this.props.onDelete && this.props.onDelete(this.props.room);
  }

  render() {
    const { name } = this.props.room;
    return (
      <div className="list-row room-row">
        <div className="list-row__content">{name}</div>
        <div className="list-row__actions">
          <Tooltip title="Edytuj">
            <button
              className="list-row__actions__edit"
              onClick={() => this.handleEditClick()}
            >
              E
            </button>
          </Tooltip>
          <Tooltip title="Usuń">
            <button
              className="list-row__actions__delete"
              onClick={() => this.handleDeleteClick()}
            >
              X
            </button>
          </Tooltip>
        </div>
      </div>
    );
  }
}
