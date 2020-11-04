import React, { Component } from "react";
import { Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./UserRow.scss";

export default class UserRow extends Component {
  handleEditClick(id) {
    EventService.Emit(Events.Redirect, `/user/edit?userid=${id}`);
  }

  handleDeleteClick() {
    this.props.onDelete && this.props.onDelete(this.props.user);
  }

  render() {
    const { firstName, lastName, id } = this.props.user;
    return (
      <div>
        {firstName} {lastName} {emailAddress}
        <button onClick={() => this.handleEditClick(id)}>Edytuj</button>
        <button onClick={() => this.handleDeleteClick()}>Usuń</button>
      </div>
    );
  }
}
