import React, { Component } from "react";
import { UserService, NotificationService } from "../../Services";
import { Redirect } from "react-router-dom";
import UserManager from "../../Components/UserManager";

export default class EditUserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      redirect: false,
    };
  }

  componentDidMount() {
    let id = new URLSearchParams(window.location.search.toLowerCase()).get(
      "userid"
    );
    UserService.getUser(id).then((res) => {
      this.setState({ user: res.data });
    });
  }

  editUser(user) {
    UserService.editUser(user)
      .then((e) => {
        NotificationService.success(
          `Zmieniono dane użytkownika na ${user.firstName} ${user.lastName} o adresie ${user.emailAddress}`
        );
        this.setState({ redirect: true });
      })
      .catch((e) => {
        NotificationService.apiError(e, "Edycja użytkownika nie powiodła się");
      });
  }

  render() {
    const { user, redirect } = this.state;
    return (
      <>
        {redirect && <Redirect to="/dashboard" />}
        {user && (
          <UserManager onSave={(u) => this.editUser(u)} edit user={user} />
        )}
      </>
    );
  }
}
