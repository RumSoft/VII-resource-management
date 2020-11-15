import React, { Component } from "react";
import AuthService from "../../Services/AuthService";
import { Redirect } from "react-router-dom";
import { NotificationService } from "../../Services";
import { Card, Form, Button, Label } from 'semantic-ui-react'
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
    }).catch((e) => {
      NotificationService.apiError(e, "Nie udało się zalogować");
      if (e.response.status === 418) {
        this.setState({ errors: e.response.data.errors });
      }
      else {
        this.setState({ errors: {} });
      }
    });
  }

  render() {
    if (AuthService.isLogged()) {
      return <Redirect to={this.state.redirectUrl} />;
    }
    const errors = this.state.errors ?? {};
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
            {errors["EmailAddress"] && (
              <Label
                className="errorMessage"
                basic color="red" pointing>
                {errors["EmailAddress"][0]}
              </Label>
            )}
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
            {errors["Password"] && (
              <Label
                className="errorMessage"
                basic color="red" pointing>
                {errors["Password"][0]}
              </Label>
            )}
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
