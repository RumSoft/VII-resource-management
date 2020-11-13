import React, { Component } from "react";
import AuthService from "../../Services/AuthService";
import { Redirect } from "react-router-dom";
import { NotificationService } from "../../Services";
import { Card, Form, Button } from 'semantic-ui-react'
import "./index.scss";

export default class LoginPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      redirectUrl: null,
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    AuthService.login({
      emailAddress: this.state.email,
      password: this.state.password,
    }).catch((x) => {
      NotificationService.apiError(x, "Nie udało się zalogować");
    });
  }

  render() {
    if (AuthService.isLogged()) {
      return <Redirect to={this.state.redirectUrl} />;
    }

    return (
      <Card className="login-form" >
        <Card.Content>
          <Card.Header as="h1">
            Panel logowania
          </Card.Header>
        </Card.Content>

        <Card.Content>
          <Form onSubmit={(e) => this.handleSubmit(e)}>
            <Form.Input
              fluid
              submit
              label="Adres e-mail"
              type="text"
              name="email"
              placeholder="e-mail"
              value={this.state.email}
              onChange={(e) => this.handleChange(e)}
            />

            <Form.Input
              fluid
              submit
              label="Hasło"
              type="password"
              name="password"
              placeholder="hasło"
              value={this.state.password}
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
            Zaloguj się
          </Button>
        </Card.Content>
      </Card >
    );
  }
}
