import React, { Component } from "react";
import AuthService from "../../Services/AuthService";
import { Redirect } from "react-router-dom";
import { NotificationService } from "../../Services";
import { Card, Form, Button } from 'semantic-ui-react'
import "./index.scss";

export default class LoginPage extends Component {
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
            {/* <Form.Field> */}
            {/* <label>Adres e-mail</label> */}
            <Form.Input
              label="Adres e-mail"
              fluid
              type="text"
              name="email"
              placeholder="e-mail"
              value={this.state.email}
              onChange={(e) => this.handleChange(e)}
            />
            {/* </Form.Field> */}

            {/* <Form.Field> */}
            {/* <label>Hasło</label> */}
            <Form.Input
              fluid
              label="Hasło"
              type="password"
              name="password"
              placeholder="hasło"
              value={this.state.password}
              onChange={(e) => this.handleChange(e)}
            />
            {/* </Form.Field> */}
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
            color="green"
            type="submit"
            onClick={(e) => this.handleSubmit(e)}
          >
            Zaloguj się
          </Button>
        </Card.Content>
      </Card >
      // <div className="login-form">
      //   <form onSubmit={(e) => this.handleSubmit(e)}>
      //     <h2 className="text-center">Panel logowania</h2>
      //     <div className="form-group">
      //       <input
      //         type="text"
      //         className="form-control"
      //         name="email"
      //         placeholder="e-mail"
      //         onChange={(e) => this.handleChange(e)}
      //       />
      //     </div>

      //     <div className="form-group">
      //       <input
      //         type="password"
      //         className="form-control"
      //         name="password"
      //         placeholder="hasło"
      //         onChange={(e) => this.handleChange(e)}
      //       />
      //     </div>

      //     <div className="form-group">
      //       <button type="submit" className="btn btn-primary btn-block">
      //         Zaloguj się
      //       </button>
      //     </div>
      //   </form>
      // </div>
    );
  }
}
