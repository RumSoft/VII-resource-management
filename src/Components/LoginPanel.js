import React, { Component } from "react";
import AuthService from "../Services/AuthService";

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (AuthService.checkIfLogged()) {
      window.location = "/";
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    AuthService.login({
      emailAddress: this.state.email,
      password: this.state.password
    });
  }

  render() {
    return (
      <div class="login-panel">
        <h1>Login page</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            <b>Email:</b>
            <br />
            <input
              placeholder="Enter Email"
              type="text"
              name="email"
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            <b>Password:</b>
            <br />
            <input
              placeholder="Enter Password"
              type="password"
              name="password"
              onChange={this.handleChange}
            />
          </label>
          <br />
          <input type="submit" value="Sign In" />
        </form>
      </div>
    );
  }
}
