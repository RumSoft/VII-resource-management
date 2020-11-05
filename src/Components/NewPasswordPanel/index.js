import React, { Component } from "react";
import { AuthService, NotificationService, UserService } from "../../Services";
import { Redirect } from "react-router-dom";
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
      <div className="newpassword-form">
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <input type="hidden" name="token" value={this.state.token} />

          <h2 className="text-center">Nowe hasło</h2>
          <div className="form-group">
            Podaj nowe hasło
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Podaj hasło"
              value={this.state.password}
              onChange={(e) => this.handleChange(e)}
            />
          </div>

          <div className="form-group">
            Powtórz hasło
            <input
              type="password"
              className="form-control"
              name="repeatedPassword"
              placeholder="Powtórz hasło"
              value={this.state.repeatedPassword}
              onChange={(e) => this.handleChange(e)}
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary btn-block">
              Zaktualizuj hasło
            </button>
          </div>
        </form>
      </div>
    );
  }
}
