import React, { Component } from "react";
import { Events, EventService, NotificationService } from "../../Services";
import UserService from "../../Services/UserService";
import "./UserRow.scss";

export default class UserRow extends Component {
  handleEditClick(id) {
    EventService.Emit(Events.Redirect, `/user/edit?userid=${id}`);
  }

  handleDeleteClick() {
    console.log(this.props.data);
    const { firstName, lastName, emailAddress, id } = this.props.data;

    UserService.deleteUser(id)
      .then((res) => {
        NotificationService.info(
          `Usunięto użytkownika ${firstName} ${lastName} o adresie ${emailAddress}`
        );
        this.props.onDelete && this.props.onDelete(id);
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się usunąć użytkownika");
      });
  }

  render() {
    const { firstName, lastName, emailAddress, id } = this.props.data;
    return (
      <div>
        {firstName} {lastName} {emailAddress}
        <button onClick={() => this.handleEditClick(id)}>Edytuj</button>
        <button onClick={() => this.handleDeleteClick()}>Usuń</button>
      </div>
    );
  }
}
