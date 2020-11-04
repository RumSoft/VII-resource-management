import React, { Component } from "react";
import { NotificationService } from "../../Services";
import UserService from "../../Services/UserService";
import "./UserRow.scss";

export default class UserRow extends Component {
  handleEditClick() {
    const { firstName, lastName, emailAddress, id } = this.props.data;

    let newUserFirstName = prompt("Podaj nowe imię użytkownika.", firstName);
    let newUserLastName = prompt("Podaj nowe imię użytkownika.", lastName);
    let newUserEmailAddress = prompt("Podaj nowy adres email użytkownika.", emailAddress);

    if (newUserFirstName !== null && newUserLastName !== null && newUserEmailAddress !== null) {
      UserService.editUser(id, newUserFirstName, newUserLastName, newUserEmailAddress)
        .then(() => {
          NotificationService.success(
            `Pomyślnie zmieniono użytkownika`,
            `${firstName} → ${newUserFirstName}`,
            `${lastName} → ${newUserLastName}`,
            `${emailAddress} → ${newUserEmailAddress}`,
          );
          this.props.onChange &&
            this.props.onChange({ id: id, firstName: newUserFirstName, lastName: newUserLastName, emailAddress: newUserEmailAddress });
        })
        .catch((e) => {
          NotificationService.apiError(e, "Nie udało się edytować użytkownika");
        });
    }
  }

  handleDeleteClick() {
    console.log(this.props.data);
    const { firstName, lastName, emailAddress, id } = this.props.data;

    UserService.deleteUser(id)
      .then((res) => {
        NotificationService.info(`Usunięto użytkownika ${firstName} ${lastName} o adresie ${emailAddress}`);
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
        <button onClick={() => this.handleEditClick()}>Edytuj</button>
        <button onClick={() => this.handleDeleteClick()}>Usuń</button>
      </div>
    );
  }
}