import React, { Component } from "react";
import { UserService, NotificationService } from "../../Services";
import { Redirect } from "react-router-dom";
import UserManager from "../../Components/UserManager";
import Title from "../Title";

export default class EditUserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      redirect: false,
      errors: {},
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
        if (e.response.status === 418) {
          this.setState({ errors: e.response.data.errors });
        } else {
          this.setState({ errors: {} });
        }
      });
  }

  render() {
    const { user, redirect, errors } = this.state;
    return (
      <>
        <Title>Edytuj użytkownika</Title>
        {redirect && <Redirect to="/dashboard" />}
        {user && (
          <UserManager
            onSave={(u) => this.editUser(u)}
            edit
            user={user}
            errors={errors}
          />
        )}
      </>
    );
  }
}
