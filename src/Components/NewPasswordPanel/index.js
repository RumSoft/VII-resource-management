import React, { Component } from "react";
import { AuthService, NotificationService, UserService } from "../../Services";
import { Redirect } from "react-router-dom";
import { Card, Form, Button, Confirm } from 'semantic-ui-react'
import "./index.scss";

export default class NewPasswordPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      repeatedPassword: "",
      token: "",
      redirect: false,
    };
  }

  componentDidMount() {
    let URLToken = new URLSearchParams(
      window.location.search.toLowerCase()
    ).get("token");
    this.setState({ token: URLToken });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit() {
    const { password, repeatedPassword, token } = this.state;

    if (password) {
      if (password === repeatedPassword) {
        UserService.newPassword(token, password)
          .then((e) => {
            NotificationService.success(`Ustawiono nowe hasło`);
          })
          .catch((e) => {
            NotificationService.apiError(
              e,
              "Nie udało się ustawić nowego hasła"
            );
          });
        this.setState({ redirect: true });
      } else {
        NotificationService.warning("Hasła nie są jednakowe");
      }
    } else {
      NotificationService.warning("Hasło nie może być puste");
    }
  }

  render() {
    if (this.state.redirect || this.state.token === null) {
      return <Redirect to="/dashboard" />;
    }

    if (AuthService.isLogged()) {
      NotificationService.warning("Jesteś już zalogowany");
      return <Redirect to="/dashboard" />;
    }

    return (
      <Card className="newpassword-form">
        <Card.Content>
          <Card.Header as="h1">
            Nowe hasło
          </Card.Header>
        </Card.Content>

        <Card.Content>
          <Form onSubmit={(e) => this.handleSubmit(e)}>
            <Form.Input
              label="Podaj nowe hasło"
              fluid
              submit
              type="password"
              name="password"
              value={this.state.password}
              onChange={(e) => this.handleChange(e)}
            />
            <Form.Input
              label="Powtórz hasło"
              fluid
              submit
              type="password"
              name="repeatedPassword"
              value={this.state.repeatedPassword}
              onChange={(e) => this.handleChange(e)}
            />
            <Button
              style={{ display: "none" }} //super hack xD
              color="green"
              type="submit"
              onClick={(e) => this.handleSubmit(e)}
            />
          </Form>
        </Card.Content>

        <Card.Content>
          <Button
            fluid
            color="green"
            type="submit"
            onClick={(e) => this.handleSubmit(e)}
          >
            Zaktualizuj hasło
                </Button>
        </Card.Content>
      </Card >
    );
  }
}
