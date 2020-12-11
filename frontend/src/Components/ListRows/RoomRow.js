import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import "./RoomRow.scss";

export default class RoomRow extends Component {
  handleEditClick() {
    this.props.onChange && this.props.onChange(this.props.room);
  }

  handleDeleteClick() {
    this.props.onDelete && this.props.onDelete(this.props.room);
  }

  render() {
    const { name, color } = this.props.room;
    return (
      <div className="list-row room-row" style={{ backgroundColor: color }}>
        <div className="list-row__content">{name}</div>
        <div className="list-row__actions">
          <Button
            circular
            onClick={() => this.handleEditClick()}
            icon="edit"
            color="yellow"
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
