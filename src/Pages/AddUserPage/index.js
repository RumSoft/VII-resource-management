import React, { Component } from "react";
import { UserService, NotificationService } from "../../Services";
import { Redirect } from "react-router-dom";
import UserManager from "../../Components/UserManager";

export default class AddUserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      errors: {},
    };
  }

  addUser(user) {
    UserService.addUser(user)
      .then((e) => {
        NotificationService.success(
          `Dodano użytkownika ${user.firstName} ${user.lastName} o adresie ${user.emailAddress}`
        );
        this.setState({ redirect: true });
      })
      .catch((e) => {
        NotificationService.apiError(e, "Nie udało się dodać użytkownika");
        if (e.response.status === 418) {
          this.setState({ errors: e.response.data.errors });
        }
        else {
          this.setState({ errors: {} });
        }
      });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <>
        {this.state.redirect && <Redirect to="/dashboard" />}
        <UserManager
          onSave={(user) => this.addUser(user)}
          errors={this.state.errors}
        />
      </>
    );
  }
}
