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
    console.log(id);
    UserService.getUser(id).then((res) => {
      this.setState({ user: res.data });
    });
  }

  editUser(user) {
    console.log(this.state.user);
    UserService.editUser(user)
      .then((e) => {
        NotificationService.success(
          `Zmieniono dane użytkownika ${this.state.firstName} ${this.state.lastName} o adresie ${this.state.emailAddress} na ${user.firstName} ${user.lastName} o adresie ${user.emailAddress}`
        );
        this.setState({ redirect: true });
      })
      .catch((e) => {
        NotificationService.apiError(e, "Edycja użytkownika nie powiodła się");
      });
  }

  render() {
    return (
      <>
        {this.state.redirect && <Redirect to="/dashboard" />}
        {this.state.user && (
          <UserManager
            onSave={(user) => this.editUser(user)}
            edit
            user={this.state.user}
          />
        )}
      </>
    );
  }
}
