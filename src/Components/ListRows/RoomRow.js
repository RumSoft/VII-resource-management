import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import "./RoomRow.scss";

export default class RoomRow extends Component {
  handleEditClick() {
    this.props.onChange && this.props.onChange(this.props.room);
    // const { name, id } = this.props.room;
    // const newRoomName = prompt("Podaj nową nazwę atrybutu.", name);
    // newRoomName &&
    //   this.props.onChange &&
    //   this.props.onChange({ id: id, name: newRoomName });
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
          <Button
            circular
            onClick={() => this.handleEditClick()}
            icon="edit"
            color="blue"
          />
          <Button
            circular
            onClick={() => this.handleDeleteClick()}
            icon="delete"
            color="red"
          />
        </div>
      </div>
    );
  }
}
